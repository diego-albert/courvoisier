/*
* @uses: el.core.managers.scrollManager
* @uses: el.core.events.globalDispatcher
* @uses: el.core.events.Event
* @uses: el.core.utils.AnimationFrame
* @uses: jQuery
*/

var el = el || {};
el.core.utils.createNamespace(el, 'core.utils');

el.core.utils.Parallax = function(options){

  this.scrollManager = el.core.managers.scrollManager;
  this.globalDispatcher = el.core.events.globalDispatcher;
  this.coreEvent = el.core.events.event;
  this.AF = el.core.utils.AnimationFrame;

  this.options = {
    'selector': '.parallax-js',
    'autoEnable': true,
    'autoRefresh': 0
  };

  this.options = $.extend(this.options, options);


  this.name = 'Parallax';
  this.id = el.core.utils.uniqueId.get(this.name + '-');

  this._scrollPosition = -1;
  this._$target = this.options.$target || $('.scroll-content');

  this._enabled = false;
}

el.core.utils.Parallax.prototype.init = function() {

  var that = this;

  this._targetsData = [];

  this._frameId = -1;
  this._frameCheckProxy = $.proxy(this._frameCheck, this);
  this._animationFrame = new this.AF();
  this._frameId = this._animationFrame.request(this._frameCheckProxy);

  this._refreshIntervalID = -1;

  this._$target.find(this.options.selector).each(function(i){

    var $target = $(this);

    var parallaxId = el.core.utils.uniqueId.get('parallax-');

    $target.data('parallaxId', parallaxId);

    that._targetsData.push({
      '$target': $target,
      'entered': false,
      'parallaxEnter': $target.data('parallaxEnter') ? $target.data('parallaxEnter') : 0,
      'top': 10000000,
      'height': 1000,
      'parallaxId': parallaxId,
      'parallaxType' : $target.data('parallaxType'),
      'parallaxEnterEvent': Boolean($target.data('parallaxEnterEvent')),
      'targetPanel' : $target.find('.story-item-wrapper img'),
      'targetGoldbar' : $target.find('.golden-border'),
      'targetImg' : $target.find('.content img'),
      'tagetBackground' : $target.find('.fullbg-parallax')
    });
  });

  if(this.options.autoEnable) {

    this.enable();
  }

  if(this.options.autoRefresh) {

    var that = this;
    this._refreshIntervalID = setInterval(function(){

      that._updatedCoordinates();
    }, this.options.autoRefresh);
  }

  return this;
}

el.core.utils.Parallax.prototype.resume = function() {

  if(this._animationFrame) {
    this._animationFrame.cancel(this._frameId);
    this._frameId = this._animationFrame.request(this._frameCheckProxy);
  }
}

el.core.utils.Parallax.prototype.enable = function() {

  this._enabled = true;
}

el.core.utils.Parallax.prototype.disable = function() {

  this._enabled = false;
}

el.core.utils.Parallax.prototype.reset = function() {

  if(this.options.autoEnable) {
    this.enable();
  }

  if(this._animationFrame) {
    this._animationFrame.cancel(this._frameId);
  }

  for (var i = 0; i < this._targetsData.length; i++) {
    var data = this._targetsData[i];

    data.entered = false;
    data.$target.removeClass('entered');
  }
}

el.core.utils.Parallax.prototype._frameCheck = function(e) {

  if(!this._enabled) return;

  this._check();

  this._frameId = this._animationFrame.request(this._frameCheckProxy);
}

el.core.utils.Parallax.prototype._check = function() {
  var newScrollPosition = this.scrollManager.getScrollPosition();

  if((newScrollPosition != this._scrollPosition || this._dirty) && el.core.managers.layoutManager.winSize.width > 960 ) {
    //Esto salta cada vez que hacemos scroll
    this._scrollPosition = newScrollPosition;
    this._dirty = false;

    //console.log('xxx',this._scrollPosition + this._winH);

    for (var i = 0; i < this._targetsData.length; i++) {
      var data = this._targetsData[i];

      var scroll = this._scrollPosition + el.core.managers.layoutManager.winSize.height;

      if(scroll > data.top && this._scrollPosition < data.top + data.height ) {
        //console.log('*********', data.$target);
        // console.log('scroll pos bottom: ',scroll);
        // console.log('target pos top: ', data.top);
        // console.log('target pos height: ', data.height);
        // console.log('target pos fin: ', data.top+data.height);

        // var pxDistance = (data.top + data.height) - (data.top - data.height);
        var pxDistance = el.core.managers.layoutManager.winSize.height + data.height;

        //console.log('px distance: ', pxDistance);

        var totalMovObj = data.$target.data('distance');

        var porcentaje = ( (scroll - data.top) /pxDistance).toFixed(2);
        porcentaje = (porcentaje > 1) ? 1 : porcentaje;
        //console.log(porcentaje);

        switch(data.parallaxType) {

          case 'panel':

            // mover Gold Bar
            var h = 75,// distance from top we want to move %
                h2;
            if (porcentaje < 0.50) {

              h2 = (h * porcentaje)+10 + '%';

            } else {

              h2 = (h - (h * porcentaje))+10 + '%';

            }
            data.targetGoldbar.css({
              'top' : h * porcentaje + '%',
              'height' : h2
            });

            // move image
            data.targetPanel.css('transform', 'translateY(-'+totalMovObj * porcentaje+'%)');
          break;

          case 'image':
            // Move Image
            data.targetImg.css('transform', 'translateY(-'+totalMovObj * porcentaje+'%)');
          break;

          case 'background':
            // move background image
            data.tagetBackground.css('transform', 'translateY(-'+totalMovObj * porcentaje+'%)');
          break;

          case 'header':
            // move HEADER background image
            scroll = this._scrollPosition;
            porcentaje = ((scroll - data.top)/pxDistance).toFixed(2);
            data.tagetBackground.css('transform', 'translateY(-'+totalMovObj * porcentaje+'%)');
          break;
        }
      }
    }
  }
}

el.core.utils.Parallax.prototype.resize = function(size) {

  this._winH = size.height;

  if(!this._enabled) return;

  this._updatedCoordinates();

  this._dirty = true;
}

el.core.utils.Parallax.prototype._updatedCoordinates = function() {

  // var scroll = this._$target.parents('.scroll-content').scrollTop();
  var scroll = 0;//this._$target.parents('.scroll-content').scrollTop();

  for (var i = 0; i < this._targetsData.length; i++) {
    if(!Boolean(this._targetsData[i].entered)) {
      // this._targetsData[i].top = this._targetsData[i].$target.position().top + scroll;

      var translate = parseInt(this._targetsData[i].$target.css('transform').split(',')[5]);
          translate = ( !isNaN(translate) ) ? translate : 0;

      this._targetsData[i].top = this._targetsData[i].$target.offset().top + scroll - translate;

      this._targetsData[i].height = this._targetsData[i].$target.outerHeight(true);
    }
  };

  // console.log('XXX',this._targetsData);
}

el.core.utils.Parallax.prototype.destroy = function() {

  if(this._animationFrame) {
    this._animationFrame.cancel(this._frameId);
  }

  clearInterval(this._refreshIntervalID);

  this._enabled = false;
  this._targetsData = null;
}
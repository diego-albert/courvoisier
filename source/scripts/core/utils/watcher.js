/*
* @uses: el.core.managers.scrollManager
* @uses: el.core.events.globalDispatcher
* @uses: el.core.events.Event
* @uses: el.core.utils.AnimationFrame
* @uses: jQuery
*/

var el = el || {};
el.core.utils.createNamespace(el, 'core.utils');

el.core.utils.Watcher = function(options){

  this.scrollManager = el.core.managers.scrollManager;
  this.globalDispatcher = el.core.events.globalDispatcher;
  this.coreEvent = el.core.events.event;
  this.AF = el.core.utils.AnimationFrame;

  this.options = {
    'selector': '.watcher-js',
    'autoEnable': true,
    'autoRefresh': 0
  };

  this.options = $.extend(this.options, options);


  this.name = 'Watcher';
  this.id = el.core.utils.uniqueId.get(this.name + '-');

  this._scrollPosition = -1;
  this._$target = this.options.$target || $('.scroll-content');

  this._enabled = false;
}

el.core.utils.Watcher.prototype.init = function() {

  var that = this;

  this._targetsData = [];

  this._frameId = -1;
  this._frameCheckProxy = $.proxy(this._frameCheck, this);
  this._animationFrame = new this.AF();
  this._frameId = this._animationFrame.request(this._frameCheckProxy);

  this._refreshIntervalID = -1;

  this._$target.find(this.options.selector).each(function(i){

    var $target = $(this);

    var watcherId = el.core.utils.uniqueId.get('watcher-');

    $target.data('watcherId', watcherId);

    that._targetsData.push({
      '$target': $target,
      'entered': false,
      'watcherEnter': $target.data('watcherEnter') ? $target.data('watcherEnter') : 0.20,
      'top': 10000000,
      'height': 1000,
      'watcherId': watcherId,
      'watcherEnterEvent': Boolean($target.data('watcherEnterEvent'))
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

el.core.utils.Watcher.prototype.resume = function() {

  if(this._animationFrame) {
    this._animationFrame.cancel(this._frameId);
    this._frameId = this._animationFrame.request(this._frameCheckProxy);
  }
}

el.core.utils.Watcher.prototype.enable = function() {

  this._enabled = true;
}

el.core.utils.Watcher.prototype.disable = function() {

  this._enabled = false;
}

el.core.utils.Watcher.prototype.reset = function() {

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

el.core.utils.Watcher.prototype._frameCheck = function(e) {

  if(!this._enabled) return;

  this._check();

  this._frameId = this._animationFrame.request(this._frameCheckProxy);
}

el.core.utils.Watcher.prototype._check = function() {

  var newScrollPosition = this.scrollManager.getScrollPosition();

  if(newScrollPosition != this._scrollPosition || this._dirty) {

    this._scrollPosition = newScrollPosition;
    this._dirty = false;

    // console.log('xxx',this._scrollPosition + this._winH);

    for (var i = 0; i < this._targetsData.length; i++) {
      var data = this._targetsData[i];

      if(!data.entered && this._scrollPosition + this._winH > data.top + data.height * data.watcherEnter) {
        data.entered = true;
        data.$target.addClass('entered');

        // var p = 0.2;

        // switch(data.$target.data('parallaxType')) {

        //   case 'panel':
        //     // move gold element: $tag.css('top', lerp(p, startVal, endVal));
        //     // move image
        //   break;

        //   case 'image':
        //     // move image
        //   break;

        //   case 'background':
        //     // move background
        //   break;
        // }

        if(data.watcherEnterEvent) {

          el.core.events.globalDispatcher.emit(el.core.events.event.WATCHER_ENTER, {
            'id': data.watcherId
          });
        }
      }
    }
  }
}

el.core.utils.Watcher.prototype.resize = function(size) {

  this._winH = size.height;

  if(!this._enabled) return;

  this._updatedCoordinates();

  this._dirty = true;
}

el.core.utils.Watcher.prototype._updatedCoordinates = function() {

  // var scroll = this._$target.parents('.scroll-content').scrollTop();
  var scroll = 0;//this._$target.parents('.scroll-content').scrollTop();

  for (var i = 0; i < this._targetsData.length; i++) {
    if(!Boolean(this._targetsData[i].entered)) {
      // this._targetsData[i].top = this._targetsData[i].$target.position().top + scroll;
      this._targetsData[i].top = this._targetsData[i].$target.offset().top + scroll;
      this._targetsData[i].height = this._targetsData[i].$target.outerHeight(true);
    }
  };

  // console.log('XXX',this._targetsData);
}

el.core.utils.Watcher.prototype.destroy = function() {

  if(this._animationFrame) {
    this._animationFrame.cancel(this._frameId);
  }

  clearInterval(this._refreshIntervalID);

  this._enabled = false;
  this._targetsData = null;
}
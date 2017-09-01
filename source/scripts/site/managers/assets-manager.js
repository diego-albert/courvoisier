var site = site || {};


el.core.utils.createNamespace(site, 'managers').AssetsManager = el.core.utils.class.extend(function(options){


  this.options = {
    'scopeSelector': 'body',
    'assetsSelector': '[data-preload-image-src]',
    'preloadCount': 3
  };

  this.options = $.extend(this.options, options);

  this.name = 'AssetsManager';
  this.id = el.core.utils.uniqueId.get(this.name + '-');

  this._q = new site.utils.LoadQueue();
  this._q.init();

  this._assetsData = [];
  this._assetsDataByID = [];

  this._q.on(el.core.events.event.LOAD_COMPLETE, $.proxy(this._imagesLoadedHandler, this));

}, el.core.events.EventsDispatcher);

site.managers.AssetsManager.prototype._parse = function() {

  var $assetTags = $(this.options.scopeSelector + ' ' + this.options.assetsSelector);

  var that = this;

  // // console.log(this.name, '_parse', $assetTags);

  $assetTags.each(function(i, tag){

    var $tag = $(tag),
        id = el.core.utils.uniqueId.get('preload-asset-')
    ;

    var data = {
      'id': id,
      'url': site.utils.responsive.getImageURL($tag.data('preloadImageSrc')),
      '$tag': $tag
    };

    that._assetsData.push(data);
    that._assetsDataByID[data.id] = data;
  });

  // we only want to add subset of images/banners
  var toPreload = this._assetsData.slice(0, this.options.preloadCount);

  that._q.addImages(toPreload);
};

site.managers.AssetsManager.prototype.load = function() {

  this._parse();
  this._q.start();
};

site.managers.AssetsManager.prototype.getAssetByID = function(id) {

  return this._assetsDataByID[id] || {};
};

site.managers.AssetsManager.prototype._imagesLoadedHandler = function(e) {
  // // console.log(this.name, '_imagesLoadedHandler', e);

  this.emit(el.core.events.event.ASSETS_LOADED, {
    // 'data': e.data
    'data': this._assetsData
  });
};
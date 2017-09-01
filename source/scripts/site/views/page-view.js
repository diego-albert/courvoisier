var site = site || {};

el.core.utils.createNamespace(site, 'views');

site.views.Page = el.core.utils.class.extend(function(options){

  this.options = {};
  this.components = [];

  $.extend(this.options, options);

  this.name = 'PageView';
  this.id = el.core.utils.uniqueId.get(this.name + '-');

  this.$el = this.options.$el;
  // this.$content = this.$el.find('#main-content');

  // el.core.events.globalDispatcher.on(el.core.events.event.RESIZE, $.proxy(this._resizeHandler, this));

}, el.core.events.EventsDispatcher);

site.views.Page.prototype.init = function(e) {

  console.log('::init', this );

}




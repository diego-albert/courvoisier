var site = site || {};

el.core.utils.createNamespace(site, 'views');

site.views.Header = el.core.utils.class.extend(function(options){

  var globalDispatcher = el.core.events.globalDispatcher,
      event = site.events.event
  ;

  this.options = {};

  $.extend(this.options, options);

  this.name = 'HeaderView';
  this.id = el.core.utils.uniqueId.get(this.name + '-');

  this.$el = this.options.$el;


}, el.core.events.EventsDispatcher);

site.views.Header.prototype.init = function(e) {

  console.log('::init', this );

}
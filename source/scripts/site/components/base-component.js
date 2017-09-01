var site = site || {};

el.core.utils.createNamespace(site, 'components')

site.components.BaseComponent = el.core.utils.class.extend(function(options){

}, el.core.events.EventsDispatcher);

site.components.BaseComponent.prototype._register = function() {

  this.$el.data('componentId', this.id);

  site.managers.componentsManager.registerComponent(this);
}

site.components.BaseComponent.prototype.destroy = function() {

	this.$el.remove();

	// console.log('BaseComponent.destroy', this.id);
}

site.components.BaseComponent.prototype.resize = function() {

}
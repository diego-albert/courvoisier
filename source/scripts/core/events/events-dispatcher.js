/*
* @uses: Jvent https://github.com/pazguille/jvent
* @uses: jQuery
*/

var el = el || {};
el.core.utils.createNamespace(el, 'core.events');

el.core.events.EventsDispatcher = function(){
};

el.core.events.EventsDispatcher.prototype._initEmitter = function() {

  if(this.emitter)
    return;

  this.emitter = new Jvent();
}

el.core.events.EventsDispatcher.prototype.on = function(event, listener) {
  
  this._initEmitter();
  this.emitter.on(event, listener);
};

el.core.events.EventsDispatcher.prototype.once = function(event, listener) {

  this._initEmitter();
  this.emitter.once(event, listener);
}

el.core.events.EventsDispatcher.prototype.off = function(event, listener) {

  this._initEmitter();
  this.emitter.off(event, listener);
}

el.core.events.EventsDispatcher.prototype.removeAllListeners = function(event, listener) {

  this._initEmitter();
  this.emitter.removeAllListeners(event);
}

el.core.events.EventsDispatcher.prototype.emit = function(type, data) {

  this._initEmitter();

  var _data = $.extend({eventType:type}, data);

  this.emitter.emit.apply(this.emitter, [type, _data]);
}
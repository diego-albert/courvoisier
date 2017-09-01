/*
* @uses: Jvent https://github.com/pazguille/jvent
*/

var el = el || {};
el.core.utils.createNamespace(el, 'core.events');

el.core.events.globalDispatcher = new el.core.events.EventsDispatcher();
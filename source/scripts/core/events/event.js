var el = el || {};
el.core.utils.createNamespace(el, 'core.events');

el.core.events.event = {

  ROUTE_CHANGED                : 'event.route.changed',
  CONTENT_LOADED               : 'event.content.loaded',
  ASSETS_LOADED                : 'event.assets.loaded',
  LOAD_COMPLETE                : 'event.load.complete',
  LOAD_PROGRESS                : 'event.load.progress',
  SHOWN                        : 'event.display.shown',
  HIDDEN                       : 'event.display.hidden',
  RESIZE                       : 'event.display.resize',
  READY                        : 'event.state.ready',
  CHANGED                      : 'event.state.changed',

  INPUT_HOVER                  : 'event.input.mousehover',
  INPUT_OUT                    : 'event.input.mouseout',

  SCROLL                       : 'event.scroll',
  UPDATE                       : 'event.update',

  APP_INIT                     : 'event.app.init',
  LOAD_SECTION                 : 'event.load.section',

  WATCHER_ENTER                : 'event.watcher.enter'
};
var site = site || {}
;

el.core.utils.createNamespace(site, 'events');

site.events.event_base = {

  sectionScrollTo: {

    'REQUEST'               : 'event.sectionscroll.request',
    'START'                 : 'event.sectionscroll.start',
    'COMPLETE'              : 'event.sectionscroll.complete'
  },

  'PAGE_SHOWN'              : 'event.page.shown',
  'MAPS_API_READY'          : 'event.maps.api.ready',
  'LOCATION_UPDATE'         : 'event.location.update',
  'IMAGE_LOADED'            : 'event.image.loaded',

  'LANGUAGES_SELECTOR_SHOW_REQUEST'   : 'event.languages-selector.show.request',
  'STORIES_SELECTOR_SHOW_REQUEST'     : 'event.stories-selector.show.request',
  'OVERLAY_HIDE_REQUEST'              : 'event.overlay.hide.request',

  'HEADER_STATE_REQUEST'              : 'event.header-state.request',
  'LEAVE_INTRO_PAGE'              : 'event.leave.intro.page',

  'PAGE_CHANGE_START'        : 'event.page.change.start',
  'PAGE_CHANGE_READY'        : 'event.page.change.ready',

  'RECIPE_STEP_COMPLETE'     : 'event.recipe.step.complete'
};

site.events.event = $.extend(true, {}, site.events.event_base, el.core.events.event);

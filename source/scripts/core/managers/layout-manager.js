/*
* @uses: el.core.events.EventsDispatcher
* @uses: el.core.events.Event
* @uses: jQuery
*/

var el = el || {};
el.core.utils.createNamespace(el, 'core.managers');

el.core.managers.layoutManager = (function() {

  var initiated = false,
      $body = null,
      $window = null,
      winSize = {
        'width': 0,
        'height': 0,
        'w': 0,
        'h': 0
      },
      Event = el.core.events.event
  ;

  function init(options) {

    if(!initiated) {

      console.log('LayoutManager.init');

      initiated = true;

      $body = $('body');
      $window = $(window);

      _getWindowSize();

      resize();

      $window.on('resize', $.proxy(_resizeHandler, this));

      if(Boolean(window.matchMedia)) {

        if(el.core.utils.environment.isDevice() &&
          (window.matchMedia("(orientation: portrait)").matches && $window.width() < 480) ||
          (window.matchMedia("(orientation: landscape)").matches && $window.height() < 480)
          ) {

            $window.on('orientationchange', $.proxy(_orientationChangHandler, this));
          }
        else {

          $('[data-fullscreen-js-single]').each(function(i, tag) {
            $(tag).data('fullscreenJsSingle', false);
          });
        }
      }
      else {
        $('[data-fullscreen-js-single]').each(function(i, tag) {
          $(tag).data('fullscreenJsSingle', false);
        });
      }
    }

    return this;
  }

  function _orientationChangHandler(e) {

    // reset resize locking values
    $('[data-fullscreen-js-single]').each(function(i, tag) {
      $(tag).data('fullscreenJsSingleExecuted', false);
    });
  }

  function _getWindowSize() {

    winSize.w = winSize.width = $window.width();
    winSize.h = winSize.height = $window.height();

    return winSize;
  }

  function _resizeHandler(e) {

    resize('body');
  }

  function resizeSingle(targetSelector) {

     _getWindowSize();

    $(targetSelector).find('.fullscreen-js').css({
      'width': winSize.width + 'px',
      'height': winSize.height + 'px'
    });
  }

  function _setSizes($target) {

    var w = winSize.width,
        h = winSize.height
    ; 

    if($target.data('fullscreenMinHeight')) {

      h = Math.max(h, parseInt($target.css('min-height')));
    }

    $target.css({
      'width': w + 'px',
      'height': h + 'px'
    });
  }

  function resize(targetSelector) {

    targetSelector = targetSelector || 'body';

    _getWindowSize();

    $(targetSelector).find('.fullscreen-js').each(function(i, target) {

      var $target = $(target);

      if(el.core.utils.environment.isDevice()) {

        // special case for mobiles
        if($target.data('fullscreenJsSingle') == true) {

          if(!Boolean($target.data('fullscreenJsSingleExecuted'))) {

            $target.data('fullscreenJsSingleExecuted', true);

            _setSizes($target);
          }
        }
        else {

          _setSizes($target);
        }
      }
      else {

        _setSizes($target);
      }
    });    

    el.core.events.globalDispatcher.emit(Event.RESIZE, {
      'winW': winSize.width,
      'winH': winSize.height,
      'width': winSize.width,
      'height': winSize.height
    });

    return this;
  }

  return {
    'init': init,
    'resize': resize,
    'resizeSingle': resizeSingle,
    '$body': $body,
    '$window': $window,
    'winSize': winSize
  };
})();
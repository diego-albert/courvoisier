/*
* @uses: el.core.events.GlobalDispatcher
* @uses: el.core.events.Event
* @uses: jQuery
* @uses: TweenLite
*/

var el = el || {};
el.core.utils.createNamespace(el, 'core.managers');

el.core.managers.scrollManager = (function() {

  var initiated = false,
      Event = el.core.events.event,
      scrollPosition = 0,
      options = {
        easing: null,
        targetSelector: '',
        enabledOnDevices: 'true'
      },
      animProps = {
        scroll: 0
      },
      locked = false,
      tween = null,
      scrollAnimUpdateProxy = null
  ;

  function init(options_) {

    if(!initiated) {

      initiated = true;

      $.extend(options, options_);

      console.log('scrollManager.init', options);

      if(options.targetSelector) {

        $target = $(options.targetSelector);
        $lockTarget = $target;
      }
      else {

        $target = $(window);
        $lockTarget = $('body');
      }

      animProps = {scroll: 0};

      if(!el.core.utils.environment.isDevice() || options.enabledOnDevices) {

        $target.on('scroll', scrollHandler);
      }
    }
  };

  function scrollHandler() {

    scrollPosition = $target.scrollTop();

    el.core.events.globalDispatcher.emit(Event.SCROLL, {
      target: this,
      scroll: getScrollPosition()
    });
  };

  function globalEventsHandler(e) {

    switch(e.eventType) {
    }
  };

  function resetScroll() {

    console.log('ScrollManager.resetScroll');

    $target.scrollTop(0);
    scrollPosition = 0;

    $lockTarget.css({

      overflow: ''
    });

    if(tween) {
      tween.kill();
    }

    locked = false;
  };

  function lockScroll() {

    if(!locked) {

      locked = true;

      scrollPosition = $target.scrollTop();

      $lockTarget.css({

        overflow: 'hidden'
      });

      if(tween)
        tween.kill();

      $target.scrollTop(scrollPosition);
    }
  };

  function unlockScroll() {

    if(locked) {

      console.log('ScrollManager.unlockScroll');

      locked = false;

      $lockTarget.css({

        overflow: ''
      });

      $target.scrollTop(scrollPosition);
    }
  };

  function getScrollPosition() {

    if(el.core.utils.environment.isDevice() || options.enabledOnDevices){
      return $target.scrollTop();
    }

    return scrollPosition;
  };

  function scrollTo(scroll, params) {

    var params = params || {};

    if(!locked) {

      var animate = Boolean(params.animate),
          duration = params.duration || 0.5,
          delay = 0 || params.delay,
          easing = options.easing || params.easing
      ;

      // console.log('ScrollManager.scrollTo', params);

      if(tween) {
        tween.kill();
      }

      if(!animate) {
        $target.scrollTop(scroll);
      }
      else {
        //TODO: this should be replaced with jQuery/velocity version
        // if(el.core.utils.environment.isDevice()){
        //   scrollPosition = $target.scrollTop();
        // }
        // animProps.scroll = scrollPosition;
        // tween = TweenLite.to(animProps, duration, {
        //   'scroll': scroll,
        //   'ease': options.easing,
        //   'delay': delay,
        //   'onUpdate': scrollAnimationUpdateHandler,
        //   'onComplete': params.completeCallback
        // });
      }
    }
  };

  function scrollAnimationUpdateHandler() {

    $target.scrollTop(animProps.scroll);
  };

  return {
    init: init,
    scrollTo: scrollTo,
    lockScroll: lockScroll,
    unlockScroll: unlockScroll,
    getScrollPosition: getScrollPosition,
    isLocked: function() {
      return locked;
    }
  };
})();
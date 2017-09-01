(function($){

	$(document).ready(function(){

		console.log('Namespace site:', site);
		console.log('Namespace el:', el);

		if(el.core.utils.environment.isDevice()) {

			$('body').addClass('is-device');

		}	else {

			$('body').addClass('is-desktop');

		}

		var pageView, headerView;

		function initJS() {

			el.core.managers.layoutManager.init();

			pageView = new site.views.Page({
		    '$el': $('body')
		  });

		  headerView = new site.views.Header({
		    '$el': $('header')
		  });

		  headerView.init();
		  pageView.init();

		  // el.core.events.globalDispatcher.emit(el.core.events.event.APP_INIT);
		}

		initJS();

	});

})(jQuery);
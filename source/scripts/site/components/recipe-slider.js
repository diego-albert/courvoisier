var site = site || {};

el.core.utils.createNamespace(site, 'components')

site.components.RecipeSliderComponent = el.core.utils.class.extend(function(options){

	this.options = {

	};

	$.extend(this.options, options);

	this.name = 'RecipeSliderComponent';
	this.id = el.core.utils.uniqueId.get(this.name + '-');

	this.$el = this.options.$el;
	this.$slider = this.$el.find('.slider-wrapper');
	this.$moreInfoBtn = this.$slider.find('.more-info');

	this.distanceTop = 0;
	this.videoPlaying = false;
	this.youtubeReady = false;

	this._recipeInfoOpen = false;
	this.videoFS = false;

	this._register();

	console.log('::init', this.name);

	// Load the IFrame Player API code asynchronously.
	var tag = document.createElement('script');
	tag.src = "https://www.youtube.com/player_api";
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

	this.init();

	this.$moreInfoBtn.on('click', $.proxy(this.toogleRecipeInfo, this) );

}, site.components.BaseComponent);

site.components.RecipeSliderComponent.prototype.init = function() {

	var slideCount = this.$slider.on('init', $.proxy(
    function(event, slick){
      slideCount = slick.slideCount;
      return slideCount;
    }, this));

	this.$slider.slick({
	  infinite: false,
	  slidesToShow: 1,
	  slidesToScroll: 1,
	  arrows: true,
	  autoplay: false,
	  autoplaySpeed: 8000,
	  speed: 600,
	  prevArrow: '<button type="button" data-role="none" class="general-arrow slick-prev" aria-label="Previous" tabindex="0" role="button"><span class="arrow icon-base_arrow"></span></button>',
    nextArrow: '<button type="button" data-role="none" class="general-arrow slick-next" aria-label="Next" tabindex="0" role="button"><span class="arrow icon-base_arrow"></span></button>',
    dots: true
	});

	// Declare Youtube Videos for all items
	this.initYTPlayer(slideCount);


	if (el.core.utils.environment.isDesktop()) {

			$(document).on('scroll', $.proxy(this.checkScrollPosition, this));

			this.$slider.find('.state-control').on('click', $.proxy(this.toggleStatePlayer, this));
			this.$slider.find('.vol-control').on('click', $.proxy(this.toggleMutePlayer, this));

	} else {

		this.$slider.find('.recipe-video').on('click', $.proxy(this.playFullScreenVideo, this));

	}

	this.$slider.on('afterChange', $.proxy(this._closeAllRecipeInfo, this));

	this.$slider.on('beforeChange', $.proxy(
			function(event, slick, currentSlide, nextSlide, slideCount){
					if (currentSlide != nextSlide) {
							// console.log('slider: ', currentSlide, nextSlide);
							this.sliderChange(nextSlide)
					}
			}, this) );

}

site.components.RecipeSliderComponent.prototype.initYTPlayer = function(slideCount) {
	// console.log('***** SLIDECOUNT: ', slideCount);

		window.player = [];
		var that = this;

		window.onYouTubeIframeAPIReady = function () {

			that.youtubeReady = true;

		var stateChangeProxy = $.proxy( function( event ){ that.stateChange(event) }, this);


		i = 1;
		while (i <= slideCount) {
			player[i] = new YT.Player('fullvideo-'+i, {
	      videoId: that.$el.find('#fullvideo-'+i).data('yt-id'),
	      playerVars: {
	          controls: 0,
	          showinfo: 0,
	          rel: 0,
	          autohide: 1,
	          modestbranding: 0,
	          // mute: true,
	          //start: 260,
	          wmode: 'transparent'
	      },
	      events: {
	          'onStateChange': stateChangeProxy
	      }
	    });
	    i++;
		}

	}

}

site.components.RecipeSliderComponent.prototype.stateChange = function(event) {
	var state = event.data;
	var player = event.target.a.id;
	var id = player.substr(player.length - 1)

	console.log( 'state change: ', player, id, state );

	var target = '.play-controller-'+id;

	this.$slider.find(target).toggleClass('playing');

	if ( this.videoFS && (state === 0 || state === 2 ) ){
		this.removeFullScreenVideo();
	}

}

site.components.RecipeSliderComponent.prototype.sliderChange = function(nextSlide) {

	if ( nextSlide === 0 ) {

	  		// ga('send', 'event', 'cocktails', 'nextcocktail-Cafe-Courvoisier');

	  	if (el.core.utils.environment.isDesktop()) {
	  		player[1].playVideo();
	  		player[2].pauseVideo();
	  	}


	  } else {

	  		// ga('send', 'event', 'cocktails', 'nextcocktail-Espresso-Martini');

	  	if ( el.core.utils.environment.isDesktop() ) {
		  	player[2].playVideo();
	  		player[1].pauseVideo()
		  }
	  }

}

site.components.RecipeSliderComponent.prototype.toogleRecipeInfo = function(e) {
	e.preventDefault();

	if (this._recipeInfoOpen) {
		this._closeRecipeInfo(e.target);
	} else {
		this._openRecipeInfo(e.target);

			// ga('send', 'event', 'cocktails', 'ReadMore-'+$(e.target).data('recipe'))

	}

}

site.components.RecipeSliderComponent.prototype._closeAllRecipeInfo = function(e) {

	this.$slider.find('.recipe-info').removeClass('open');
	this.$slider.find('.more-info').addClass('down');

	this._recipeInfoOpen = false;
}

site.components.RecipeSliderComponent.prototype._closeRecipeInfo = function(target) {

	this._recipeInfoOpen = false;

	$(target).addClass('down')
					 .parent().removeClass('open');
}

site.components.RecipeSliderComponent.prototype._openRecipeInfo = function(target) {

	this._recipeInfoOpen = true;

	$(target).removeClass('down')
					 .parent().addClass('open');
}

site.components.RecipeSliderComponent.prototype.checkScrollPosition = function(ev) {

	if (!this.youtubeReady) {
		return;
	}

	var scrollPos = $(document).scrollTop();

	if ( (this.distanceTop - (window.innerHeight/2)) < scrollPos && !this.videoPlaying ){
		// console.log('play video!');

			console.log('play');
			this.videoPlaying = true;
			player[1].playVideo()
			player[2].pauseVideo()


	} else if ( (this.distanceTop - (window.innerHeight/2)) > scrollPos && this.videoPlaying ) {
	// if ( (this.distanceTop - (window.innerHeight/2)) > scrollPos && this.videoPlaying ) {

		this.videoPlaying = false;
		this.$slider.slick('slickGoTo', 0 );
		player[1].pauseVideo()
		player[2].pauseVideo()
	}

}

site.components.RecipeSliderComponent.prototype.resize = function() {

	var scrollTop     = $(window).scrollTop(),
	    elementOffset = this.$el.offset().top;

	 this.distanceTop = (elementOffset - scrollTop);

	    console.log('scrollTop', this.distanceTop );

}

site.components.RecipeSliderComponent.prototype.toggleMutePlayer = function(evt) {

	var id = $(evt.currentTarget).data('video');

	if(player[id].isMuted()){

      player[id].unMute();

  } else {

      player[id].mute();

  }

  $(evt.currentTarget).toggleClass('muted');

}

site.components.RecipeSliderComponent.prototype.playFullScreenVideo = function(evt) {
	var target = $(evt.currentTarget);
	var id = target.data('pvideo');

	target.addClass('ontop')
				.find('.video-full').fadeIn();
	player[id].playVideo();

	$(document).scrollTop($(document).height());
	$('html, body').css({ 'overflow': 'hidden' });

	this.videoFS = true;

}

site.components.RecipeSliderComponent.prototype.removeFullScreenVideo = function(evt) {
	$('.recipe-video').removeClass('ontop');
	$('.video-full').fadeOut();
	$('html, body').css({ 'overflow': 'auto' });
	this.videoFS = false;
}

site.components.RecipeSliderComponent.prototype.toggleStatePlayer = function(evt) {
	var id = $(evt.currentTarget).data('video');
	var state = player[id].getPlayerState();
	console.log('evt: ', id, state );

		if(state === 1){
			player[id].pauseVideo();
		} else {
			player[id].playVideo();
		}
}

site.components.RecipeSliderComponent.prototype.destroy = function() {

	this.parent.destroy.call(this);

}
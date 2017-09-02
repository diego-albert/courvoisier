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

	this._register();

	console.log('::init', this.name);

	this.init();

}, site.components.BaseComponent);

site.components.RecipeSliderComponent.prototype.init = function() {

	this.$slider.slick({
	  infinite: false,
	  slidesToShow: 1,
	  slidesToScroll: 1,
	  arrows: false,
	  autoplay: false,
	  speed: 300,
	  prevArrow: '<button type="button" data-role="none" class="slick-prev black" aria-label="Previous" tabindex="0" role="button"><span class="arrow icon-arrow-left"></span></button>',
    nextArrow: '<button type="button" data-role="none" class="slick-next black" aria-label="Next" tabindex="0" role="button"><span class="arrow icon-arrow-right"></span></button>',
    dots: false
	});

	// this.$slider.on('beforeChange', $.proxy(
 //  	function(event, slick, currentSlide, nextSlide){
	// 		this.animateSlideOut(currentSlide, nextSlide)
	// 	}, this));

	// this.$slider.on('afterChange', $.proxy(
	// 	function(event, slick, currentSlide){
	// 		this.animateSlideIn(currentSlide);
	// }, this));

}

site.components.RecipeSliderComponent.prototype.destroy = function() {

	this.parent.destroy.call(this);

}
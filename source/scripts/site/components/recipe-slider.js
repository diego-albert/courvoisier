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

	this._recipeInfoOpen = false;

	this._register();

	console.log('::init', this.name);

	this.init();

	this.$moreInfoBtn.on('click', $.proxy(this.toogleRecipeInfo, this) );

}, site.components.BaseComponent);

site.components.RecipeSliderComponent.prototype.init = function() {

	this.$slider.slick({
	  infinite: true,
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

	this.$slider.on('afterChange', $.proxy(this._closeAllRecipeInfo, this));

	this.$slider.on('beforeChange', function(event, slick, currentSlide, nextSlide){
	  console.log(nextSlide);
	  if ( nextSlide === 1 ) {
	  	ga('send', 'event', 'cocktails', 'nextcocktail-Cafe-Courvoisier');
	  } else {
	  	ga('send', 'event', 'cocktails', 'nextcocktail-Espresso-Martini');
	  }
	});

}

site.components.RecipeSliderComponent.prototype.toogleRecipeInfo = function(e) {
	e.preventDefault();

	if (this._recipeInfoOpen) {
		this._closeRecipeInfo(e.target);
	} else {
		this._openRecipeInfo(e.target);
		ga('send', 'event', 'cocktails', 'ReadMore-'+$(e.target).data('recipe'))
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

site.components.RecipeSliderComponent.prototype.resize = function() {

}

site.components.RecipeSliderComponent.prototype.destroy = function() {

	this.parent.destroy.call(this);

}
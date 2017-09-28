var site = site || {};

el.core.utils.createNamespace(site, 'components')

site.components.MarqueeComponent = el.core.utils.class.extend(function(options){

	this.options = {

	};

	$.extend(this.options, options);

	this.name = 'MarqueeComponent';
	this.id = el.core.utils.uniqueId.get(this.name + '-');

	this.$el = this.options.$el;
	this.$mainCta = this.$el.find('button.block--button');
	this.$continueScroll = this.$el.find('.continue-scroll');

	this._register();

	console.log('::init', this.name);

	this.init();

}, site.components.BaseComponent);

site.components.MarqueeComponent.prototype.init = function() {

	this.$el.slick({
	  infinite: true,
	  slidesToShow: 1,
	  slidesToScroll: 1,
	  arrows: true,
	  autoplay: true,
	  autoplaySpeed: 8000,
	  speed: 600,
	  prevArrow: '<button type="button" data-role="none" class="general-arrow slick-prev" aria-label="Previous" tabindex="0" role="button"><span class="arrow icon-base_arrow"></span></button>',
    nextArrow: '<button type="button" data-role="none" class="general-arrow slick-next" aria-label="Next" tabindex="0" role="button"><span class="arrow icon-base_arrow"></span></button>',
    dots: true
	});

	this.$mainCta.on('click', $.proxy(this.ctaUserClick, this));

	// this.$continueScroll.on('click', $.proxy(this.continueScroll, this));

}

site.components.MarqueeComponent.prototype.continueScroll = function() {
	// Add functionality to btn?
	// ga('send', 'event', 'Continue')
}

site.components.MarqueeComponent.prototype.ctaUserClick = function() {
	// Add functionality to btn?
	ga('send', 'event', 'Find-Your-Bar', )
}

site.components.MarqueeComponent.prototype.resize = function() {

}

site.components.MarqueeComponent.prototype.destroy = function() {

	this.parent.destroy.call(this);

}
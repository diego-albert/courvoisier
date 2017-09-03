var site = site || {};

el.core.utils.createNamespace(site, 'components')

site.components.MapComponent = el.core.utils.class.extend(function(options){

	this.options = {

	};

	$.extend(this.options, options);

	this.name = 'MapComponent';
	this.id = el.core.utils.uniqueId.get(this.name + '-');

	this.$el = this.options.$el;
	this.$mapView = document.getElementById('map-canvas');
	this.$slider = this.$el.find('.results');

	this.map = null;
	this.defaultZoom = 15;
	this.sliderMapSearch = false;

	this._register();

	console.log('::init', this.name);

	google.maps.event.addDomListener(window, "load", $.proxy(this.init, this));

}, site.components.BaseComponent);

site.components.MapComponent.prototype.init = function() {

	this.createMap();

	// if (window.innerWidth < 960 ) {

	// 	this.initSliderMapSearch();

	// }

}

site.components.MapComponent.prototype.createMap = function() {
	var that = this;

	var styledMapType = new google.maps.StyledMapType([
			{
	        "featureType": "all",
	        "elementType": "geometry",
	        "stylers": [{"color": "#1c2837"}]
	    },
			{
	        "featureType": "administrative",
	        "elementType": "labels.text",
	        "stylers": [{"visibility": "off"}]
	    },
	    {
	        "featureType": "administrative",
	        "elementType": "geometry",
	        "stylers": [{"visibility": "off"}]
	    },
			{
	        "featureType": "landscape",
	        "elementType": "geometry",
	        "stylers": [{"color": "#1c2837"}]
	    },
	    {
	        "featureType": "landscape",
	        "elementType": "geometry",
	        "stylers": [{"color": "#1c2837"}]
	    },
	    {
	        "featureType": "poi",
	        "elementType": "all",
	        "stylers": [{"color": "#1c2837","visibility": "off"}]
	    },
	    {
	        "featureType": "poi",
	        "elementType": "labels",
	        "stylers": [{"visibility": "off"}]
	    },
	    {
	        "featureType": "poi.park",
	        "elementType": "geometry",
	        "stylers": [{"color": "#1a3437","visibility": "on"}]
	    },
	    {
	        "featureType": "water",
	        "elementType": "all",
	        "stylers": [{"color": "#102035"}]
	    },
	    {
	        "featureType": "water",
	        "elementType": "labels",
	        "stylers": [{"visibility": "off"}]
	    },
	    {
	        "featureType": "water",
	        "elementType": "labels.icon",
	        "stylers": [{"visibility": "off"}]
	    },
	    {
          "featureType": "road",
          "elementType": "labels.icon",
          "stylers": [{"visibility": "off"}]
      },
      {
          "featureType": "road.highway",
          "elementType": "labels",
          "stylers": [{"visibility": "off"}]
      },
      {
          "featureType": "road",
          "elementType": "labels.text",
          "stylers": [{"color": "#2e3843"}]
      },
      {
          "featureType": "road",
          "elementType": "labels.text.fill",
          "stylers": [{"color": "#ffffff"}]
      },
	    {
          "featureType": "road.arterial",
          "elementType": "geometry",
          "stylers": [{"color": "#2e3843"}]
      },
      {
          "featureType": "road.highway",
          "elementType": "geometry",
          "stylers": [{"color": "#7c6139"}]
      },
      {
          "featureType": "road.local",
          "elementType": "geometry",
          "stylers": [{"color": "#2e3843"}]
      },
		  {
		    "featureType": "transit",
		    "elementType": "all",
		    "stylers": [{ "visibility": "off" }]
		  }
  ])

	this.map = new google.maps.Map(this.$mapView, {
     center: new google.maps.LatLng(41.399364, 2.1961556),
     zoom: that.defaultZoom,
     disableDefaultUI: true,
     scrollwheel: false,
     disableDoubleClickZoom: true
   });

	that.map.mapTypes.set('styled_map', styledMapType);
	that.map.setMapTypeId('styled_map');

}

site.components.MapComponent.prototype.destroySliderMapSearch = function() {
	this.$slider.slick('unslick');
	this.sliderMapSearch = false;
}

site.components.MapComponent.prototype.initSliderMapSearch = function() {
	this.$slider.slick({
	  infinite: true,
	  slidesToShow: 1,
	  slidesToScroll: 1,
	  arrows: true,
	  autoplay: false,
	  speed: 300,
	  prevArrow: '<button type="button" data-role="none" class="slick-prev black" aria-label="Previous" tabindex="0" role="button"><span class="arrow icon-arrow-left"></span></button>',
    nextArrow: '<button type="button" data-role="none" class="slick-next black" aria-label="Next" tabindex="0" role="button"><span class="arrow icon-arrow-right"></span></button>',
    dots: false
	});
	this.sliderMapSearch = true;
}

site.components.MapComponent.prototype.resize = function() {

	if (window.innerWidth < 960 && !this.sliderMapSearch ) {
		this.initSliderMapSearch();
	} else if ( window.innerWidth >= 960 && this.sliderMapSearch ){
		this.destroySliderMapSearch();
	}

}

site.components.MapComponent.prototype.destroy = function() {

	this.parent.destroy.call(this);
	this.$slider.slick('unslick');

}
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

	this.map = null;
	this.defaultZoom = 15;
	// this.$slider = this.$el.find('.slider-wrapper');

	this._register();

	console.log('::init', this.name);

	google.maps.event.addDomListener(window, "load", $.proxy(this.init, this));

}, site.components.BaseComponent);

site.components.MapComponent.prototype.init = function() {
	console.log('map loaded!');
	this.createMap();

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

return;


	// Bounds for North America
	// that.strictBounds = new google.maps.LatLngBounds(new google.maps.LatLng(46.70973, 4.1748),new google.maps.LatLng(55.40406, 15.07324));

}

site.components.MapComponent.prototype.resize = function() {

}

site.components.MapComponent.prototype.destroy = function() {

	this.parent.destroy.call(this);

}
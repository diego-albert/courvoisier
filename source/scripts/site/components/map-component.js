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

	this._init = false;
	this.map = null;
	this.defaultZoom = 15;
	this.sliderMapSearch = false;
	this.markers = new Array();

	this.locations = [
		['club one', 51.5101342, -0.1366865],
		['club two', 51.5166016, -0.1066241],
		['club three', 51.5127886, -0.0959259],
		['club four', 51.5144705, -0.1098388]
	];

	this._register();

	console.log('::init', this.name);

	google.maps.event.addDomListener(window, "load", $.proxy(this.init, this));

}, site.components.BaseComponent);

site.components.MapComponent.prototype.init = function() {

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
  ]);

	this.map = new google.maps.Map(this.$mapView, {
     center: new google.maps.LatLng(51.5101342, -0.1366865),
     zoom: that.defaultZoom,
     disableDefaultUI: true,
     scrollwheel: false,
     disableDoubleClickZoom: true
   });

	// SET STYLES TO MAP
	this.map.mapTypes.set('styled_map', styledMapType);
	this.map.setMapTypeId('styled_map');

	this.initSearchBar();

	// WAIT FOR GOOGLE MAP CREATED TO DISPLAY MARKERS
	google.maps.event.addListener( that.map, 'idle', $.proxy(this.displayLocationsMarker, this) );

	google.maps.event.addListener( that.map, 'bounds_changed', $.proxy(this.checkMarkerVisibility, this));

}

site.components.MapComponent.prototype.initSearchBar = function() {

	var that = this;

	var input = document.getElementById('searchbox');
  var searchBox = new google.maps.places.SearchBox(input);

  var autocomplete = new google.maps.places.Autocomplete(input);
      autocomplete.bindTo('bounds', that.map);

  autocomplete.addListener('place_changed', function() {
    // infowindow.close();
    // marker.setVisible(false);
    var place = autocomplete.getPlace();
    if (!place.geometry) return;

    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
      that.map.fitBounds(place.geometry.viewport);
    } else {
      that.map.setCenter(place.geometry.location);
      that.map.setZoom(17);  // Why 17? Because it looks good.
    }
    return;
    marker.setIcon(/** @type {google.maps.Icon} */({
      url: place.icon,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(35, 35)
    }));
    marker.setPosition(place.geometry.location);
    marker.setVisible(true);

    var address = '';
    if (place.address_components) {
      address = [
        (place.address_components[0] && place.address_components[0].short_name || ''),
        (place.address_components[1] && place.address_components[1].short_name || ''),
        (place.address_components[2] && place.address_components[2].short_name || '')
      ].join(' ');
    }

    infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
    infowindow.open(map, marker);
  });

}

site.components.MapComponent.prototype.displayLocationsMarker = function() {

		if ( this._init ) return;

		var that = this,
				marker, i;

		for (i = 0; i < that.locations.length; i++) {
	    marker = new google.maps.Marker({
	      position: new google.maps.LatLng(that.locations[i][1], that.locations[i][2]),
	      map: that.map
	    });

	    that.markers.push(marker);

	    // google.maps.event.addListener(marker, 'click', (function(marker, i) {
	    //   return function() {
	    //     infowindow.setContent(locations[i][0]);
	    //     infowindow.open(map, marker);
	    //   }
	    // })(marker, i));
	  }

	  this.checkMarkerVisibility();
	  this._init = true;

}

site.components.MapComponent.prototype.checkMarkerVisibility = function() {

		for (var i = 0; i < this.markers.length; i++) {

			if ( this.map.getBounds().contains(this.markers[i].getPosition()) )
	    {
	    	// console.log('hide marker');
	    		this.markers[i].setVisible(true);//to hide
	    }
	    else
	    {
	    	// console.log('show marker');
	    		this.markers[i].setVisible(false);//to show
	    }

		};
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
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
	this.initMapPos = [51.5101342, -0.1366865];
	this.sliderMapSearch = false;
	this.markers = new Array();
	this.locations = new Array();
	this.visibleMarkersId = new Array();
	this.currentVisibleMarkersId = new Array();
	this.currentLocationSelected = 0;

	this.markerImage = {
		iddle: './assets/img/marker.png',
		active: './assets/img/marker_active.png'
	};

	// Import locations from JSON file
	this.loadLocations();

	this._register();

	console.log('::init', this.name);

	google.maps.event.addDomListener(window, "load", $.proxy(this.init, this));

}, site.components.BaseComponent);

site.components.MapComponent.prototype.init = function() {

	this.createMap();

}

site.components.MapComponent.prototype.loadLocations = function() {
		var that = this;

		var oReq = new XMLHttpRequest();
		oReq.onload = reqListener;
		oReq.open("get", "./data/locations.json", true);
		oReq.send();

		function reqListener(e) {
		  that.locations = JSON.parse(this.responseText);
		  that.locations = that.locations.locations;
		  // console.log('treeData: ', that.locations[0] );
		}

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
     center: new google.maps.LatLng(this.initMapPos[0], this.initMapPos[1]),
     zoom: that.defaultZoom,
     disableDefaultUI: true,
     zoomControl: true,
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

  autocomplete.addListener('place_changed', function(e) {
  	// e.preventDefault();
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
	      position: new google.maps.LatLng(that.locations[i].coordinates[0], that.locations[i].coordinates[1]),
	      map: that.map,
	      id: that.locations[i].id,
	      icon: that.markerImage.iddle
	    });

	    that.markers.push(marker);

	  }

	  // Add Click event on marker
	  for (var i = 0; i < that.markers.length; i++) {

			that.markers[i].addListener('click', function(){
				that.setHighLightMarker(this)
			});

		};

	  this.checkMarkerVisibility();
	  this._init = true;

}

site.components.MapComponent.prototype.setHighLightMarker = function(target) {

	// Set Default icon to all markers
	for (var i = 0; i < this.markers.length; i++) {
			this.markers[i].setIcon(this.markerImage.iddle);
	};

	target.setIcon(this.markerImage.active);
	// this.map.setCenter( target.getPosition() );

	this.highLightListItem(target['id']);

}

site.components.MapComponent.prototype.highLightListItem = function(targetId) {

		if ( this.currentLocationSelected != targetId ) {

			// Reset all list item styles
			for (var i = 0; i < this.locations.length; i++) {
					this.locations[i].classname = "";
			};

			// highlight element
			this.$slider.find( '.item-'+targetId ).addClass('highlight');
			this.$slider.find( '.item-'+this.currentLocationSelected ).removeClass('highlight');
			this.locations[targetId-1].classname = "highlight";

			// Save current location selected
			this.currentLocationSelected = targetId;

			if (window.innerWidth < 960 && this.sliderMapSearch) {

				var currentIndex = ( this.$slider.find('.highlight').last().data('slick-index') ) ? this.$slider.find('.highlight').data('slick-index') : 0;
				console.log('index: ', currentIndex );
				this.$slider.slick('slickGoTo', currentIndex );

			}

		}

		// Animate scroll Pos to highlight elem
		var cont = this.$el.find( '.results').offset().top;
		var offset = this.$slider.find( '.item-'+targetId ).offset().top;
		this.$el.find('.content').animate({scrollTop: offset-cont },300);

}

site.components.MapComponent.prototype.checkMarkerVisibility = function() {

		this.visibleMarkersId = [];

		for (var i = 0; i < this.markers.length; i++) {

			if ( this.map.getBounds().contains(this.markers[i].getPosition()) )
	    {
	    		this.markers[i].setVisible(true);//to show
	    		this.visibleMarkersId.push(this.markers[i].id)
	    }
	    else
	    {
	    		this.markers[i].setVisible(false);//to hide
	    		this.markers[i].setIcon(this.markerImage.iddle);
	    		this.locations[i].classname = ""; // Remove highlight class from listItem
	    }

		};

		var currentMarkersVisibleNotChanged = this.compareArraysMarker(this.visibleMarkersId, this.currentVisibleMarkersId);

		this.currentVisibleMarkersId = this.visibleMarkersId;

		if ( !currentMarkersVisibleNotChanged ) this.updatelocationList();

}

site.components.MapComponent.prototype.destroySliderMapSearch = function() {

	if (this.sliderMapSearch) {
		// IF SLICK IS INIT
		this.$slider.slick('unslick');
		this.sliderMapSearch = false;
	}

}

site.components.MapComponent.prototype.initSliderMapSearch = function() {
	this.$slider.slick({
	  infinite: true,
	  slidesToShow: 1,
	  slidesToScroll: 1,
	  arrows: true,
	  autoplay: false,
	  speed: 100,
	  prevArrow: '<button type="button" data-role="none" class="slick-prev black" aria-label="Previous" tabindex="0" role="button"><span class="arrow icon-arrow-left"></span></button>',
    nextArrow: '<button type="button" data-role="none" class="slick-next black" aria-label="Next" tabindex="0" role="button"><span class="arrow icon-arrow-right"></span></button>',
    dots: false,
    waitForAnimate: false
	});
	this.sliderMapSearch = true;

	this.$slider.on('afterChange', $.proxy(
  	function(event, slick, currentSlide){

  		// Save current location selected
			this.currentLocationSelected = this.$slider.find('.slick-current').data('location') ;

			// console.log('new slide: ', this.currentLocationSelected, this.markers[this.currentLocationSelected] );

			for (var i = 0; i < this.markers.length; i++) {
					this.markers[i].setIcon(this.markerImage.iddle);
			};

			this.markers[this.currentLocationSelected-1].setIcon(this.markerImage.active);

	}, this));
}

site.components.MapComponent.prototype.compareArraysMarker = function(a1,a2) {

		// if the other array is a falsy value, return
    if (!a1 || !a2)
        return false;

    // compare lengths - can save a lot of time
    if (a1.length != a2.length)
        return false;

    for (var i = 0, l=a1.length; i < l; i++) {

        if (a1[i] != a2[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;

}

site.components.MapComponent.prototype.updatelocationList = function() {

		var that = this;
		var output = [];

		// RESET ITEM LIST
		this.destroySliderMapSearch();
		that.$slider.html("");

		for (var i = 0; i < that.visibleMarkersId.length; i++) {

			// CREATE ITEM LIST FOR EACH MARKER VISIBLE ON MAP
			var index = that.visibleMarkersId[i]-1;

			var location = '<div class="item item-'+that.locations[index].id+' '+that.locations[index].classname+' " data-location="'+that.locations[index].id+'">';
					location += '<p class="name main--subtitle">'+that.locations[index].name+'</p>';
					location += '<p class="adress highlight-text small">Address';
					location += '<span class="data-font">'+that.locations[index].address+'</span></p>';
					location += '<p class="telephone highlight-text small">telephone';
					location += '<span class="data-font">'+that.locations[index].telephone+'</span></p>';
					location += '<p class="timetable highlight-text small">timetable';
					location += '<span class="data-font">'+that.locations[index].timetable+'</span></p></div>';

			// output.push(location);
			that.$slider.append(location);

		}

		if (window.innerWidth < 960 && !this.sliderMapSearch && this.locations.length > 1) {

			this.initSliderMapSearch();

			var currentIndex = ( this.$slider.find('.highlight').last().data('slick-index') ) ? this.$slider.find('.highlight').data('slick-index') : 0;
			console.log('index: ', currentIndex );
			this.$slider.slick('slickGoTo', currentIndex );

		}

}

site.components.MapComponent.prototype.resize = function() {

	if (window.innerWidth < 960 && !this.sliderMapSearch && this.locations.length > 1) {

		this.initSliderMapSearch();

	} else if ( window.innerWidth >= 960 && this.sliderMapSearch ){

		this.destroySliderMapSearch();

	}

}

site.components.MapComponent.prototype.destroy = function() {

	this.parent.destroy.call(this);
	this.$slider.slick('unslick');

}
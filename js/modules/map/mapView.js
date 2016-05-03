'use strict';
this.Mapper = this.Mapper || {};

Mapper.mapView = Backbone.View.extend({
	initialize: function() {
		var self = this;

		$.get('templates/map-holder.html', function appendMapTempalateAndInit(data) {
			var template = _.template(data);

			Mapper.uiController.getMainContainer().append(template);
			
			self.initGoogleMap();
			self.initHandlers();
		}, 'html');
	},
	initGoogleMap: function() {
		var self = this;

		var opts = {
	        center: {
	        	lat: self.model.get("centerLat"),
	        	lng: self.model.get("centerLng")
	        },
	        zoom: Mapper.mapController.defaultZoom,
	        mapTypeId: google.maps.MapTypeId.ROADMAP,
	        mapMaker: true,
		    styles: [{featureType: "poi", stylers: [{visibility: "off"}]}],
		    mapTypeControlOptions: {
		    	style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
		  	},
			streetViewControl: false,
			rotateControl: true,
			fullscreenControl: false
	    };
		
		Mapper.mapController.setMapCanvas(new google.maps.Map(document.getElementById(Mapper.mapController.mapDomId), opts));
		this.model.trigger('mapCreated');

		$(window).trigger('resize'); // fix for fitting the google map after init
	},
	initHandlers: function() {
		var self = this;

		google.maps.event.addListener(Mapper.mapController.getMapCanvas(), 'click', function(event) {
			Mapper.mapController.setMapCenter(event.latLng);
			self.model.onMapClicked(event.latLng);
	    });
	}
});
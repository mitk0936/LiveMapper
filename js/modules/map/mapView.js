'use strict';
this.Mapper = this.Mapper || {};

Mapper.mapView = Backbone.View.extend({
	defaultZoom: 14,
	initialize: function() {
		var self = this;

		$.get('templates/map-holder.html', function appendMapTempalateAndInit(data) {
			var template = _.template(data);

			$("#main-container").append(template);
			
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
	        zoom: self.defaultZoom,
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
		
		this.mapCanvas = new google.maps.Map(document.getElementById("map"), opts);
		this.model.trigger('mapCreated');

		$(window).trigger('resize'); // fix for fitting the google map after init
	},
	initHandlers: function() {
		var self = this;

		google.maps.event.addListener(this.mapCanvas, 'click', function(event) {
			self.mapCanvas.panTo(event.latLng);

			self.model.set({
				centerLat: event.latLng.lat(),
				centerLng: event.latLng.lng()
			});

			self.model.addPoint(event.latLng);
	    });
	},
	appendToMap: function (mapObject) {
		mapObject.setMap(this.mapCanvas);
	},
	bindToMap: function (propName, mapObject) {
		mapObject.set(propName, this.mapCanvas);
	}
});
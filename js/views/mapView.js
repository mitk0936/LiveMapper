var mapView = Backbone.View.extend({
	initialize: function(){
		this.domEl = document.getElementById(this.domId);
		this.initGoogleMap();
		this.initHandlers();
	},
	initGoogleMap: function() {
		var self = this;

		var opts = {
	        center: {lat:self.model.get("centerLat"), lng: self.model.get("centerLng")},
	        zoom: mapper.defaultZoom,
	        mapTypeId: google.maps.MapTypeId.ROADMAP, 
		    styles: [{featureType: "poi", stylers: [{visibility: "off"}]}]
	    };
		
		map = new google.maps.Map(document.getElementById(mapper.mapDomId), opts);
	},
	initHandlers: function(){
		var self = this;
		google.maps.event.addListener(map, 'click', function(event) {
			map.panTo(event.latLng);
	        self.model.addPoint(new point({
	        	lat: event.latLng.lat(),
	        	lng: event.latLng.lng()
	        }));
	    });
	}
});
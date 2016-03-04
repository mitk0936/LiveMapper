var mapView = Backbone.View.extend({
	initialize: function() {
		var self = this;

		$.get('templates/map-holder.html', function (data) {
			template = _.template(data);

			mapper.uiController.getMainContainer().append(template);
			
			self.initGoogleMap();
			self.initHandlers();
		}, 'html');
	},
	initGoogleMap: function() {
		var self = this;

		var opts = {
	        center: {lat:self.model.get("centerLat"), lng: self.model.get("centerLng")},
	        zoom: mapper.defaultZoom,
	        mapTypeId: google.maps.MapTypeId.ROADMAP,
	        mapMaker: true,
		    styles: [{featureType: "poi", stylers: [{visibility: "off"}]}]
	    };
		
		mapper.mapCanvas = new google.maps.Map(document.getElementById(mapper.mapDomId), opts);
		this.model.trigger('mapCreated');
	},
	initHandlers: function() {
		var self = this;
		google.maps.event.addListener(mapper.mapCanvas, 'click', function(event) {
			mapper.mapCanvas.panTo(event.latLng);
	        self.model.addPoint(new point({
	        	lat: event.latLng.lat(),
	        	lng: event.latLng.lng()
	        }));
	    });
	}
});
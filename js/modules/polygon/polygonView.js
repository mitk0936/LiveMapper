this.Mapper = this.Mapper || {};

Mapper.polygonView = Mapper.polyView.extend({
	render: function() {
		var self = this;

		// destroy previous object, if it exists
		this.googleMapsObject && this.googleMapsObject.setMap(null);

		this.googleMapsObject = new google.maps.Polygon({
			path: self.model.get('pointsCollection').pluck("latLng"),
			geodesic: true,
			strokeOpacity: 0.2,
			fillOpacity: 0.8,
			strokeWeight: 1,
			fillColor: self.model.get("fillColor")
		});

		Mapper.mapController.appendToMap(this.googleMapsObject);
		this.initMapHandlers();
	},
	fillColorChanged: function (ev) {
		this.googleMapsObject.setOptions({fillColor: ev.changed.fillColor});
	}
});

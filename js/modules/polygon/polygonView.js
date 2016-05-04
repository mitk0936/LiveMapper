'use strict';
this.Mapper = this.Mapper || {};

Mapper.polygonView = Mapper.polyView.extend({
	render: function() {
		var self = this;

		// destroy previous object, if it exists
		this.mapObject && this.mapObject.setMap(null);

		this.mapObject = new google.maps.Polygon({
			path: self.model.get('pointsCollection').pluck("latLng"),
			geodesic: true,
			strokeOpacity: 0.2,
			fillOpacity: 0.8,
			strokeWeight: 1,
			fillColor: self.model.get("fillColor")
		});

		Mapper.mapController.appendToMap(this.mapObject);
		this.initMapHandlers();
	},
	setFillColor: function (ev) {
		this.mapObject.setOptions({
			fillColor: ev.changed.fillColor
		});
	}
});

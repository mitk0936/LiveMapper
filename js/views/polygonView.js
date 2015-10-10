var polygonView = polyView.extend({
	render: function(){
		var self = this;

		if(this.googleMapsObject){
			this.googleMapsObject.setMap(null);
		}

		this.googleMapsObject = new google.maps.Polygon({
			path: self.model.get('pointsCollection').pluck("latLng"),
			geodesic: true,
			strokeOpacity: 1.0,
			strokeWeight: 1,
			fillColor: self.model.get("fillColor")
		});

		this.googleMapsObject.setMap(map);
		this.initMapHandlers();
	},
	setStyleSelected: function(){
		this.model.set("fillColor", this.model.defaults.selectedFillColor);
		this.googleMapsObject.setOptions({fillColor: this.model.defaults.selectedFillColor});
	},
	setStyleDeselected: function(){
		this.model.set("fillColor", this.model.defaults.fillColor);
		this.googleMapsObject.setOptions({fillColor: this.model.defaults.fillColor});
	}
});
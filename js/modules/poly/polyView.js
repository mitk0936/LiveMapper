'use strict';
this.Mapper = this.Mapper || {};

Mapper.polyView = Backbone.View.extend({
	initialize: function() {
		this.initHandlers();

		// used to hide/show, the whole points layer at once
		this.pointsLayer = new google.maps.MVCObject();
	},
	render: function() {
		var self = this;
		
		this.googleMapsObject && this.googleMapsObject.setMap(null);

		this.googleMapsObject = new google.maps.Polyline({
			path: self.model.get('pointsCollection').pluck("latLng"),
			geodesic: true,
			strokeColor: self.model.get("fillColor"),
			strokeOpacity: 1,
			strokeWeight: 4
		});

		Mapper.mapController.appendToMap(this.googleMapsObject);
		this.initMapHandlers();
	},
	initHandlers: function() {
		var self = this;

		this.model.get("pointsCollection").on("add change:latLng remove", function(e) {
			self.render();
		});

		this.model.on("change:isSelected", function(e) {
	    	self.togglePoints(e.changed.isSelected);
		});

		this.model.on("change:fillColor", function (e) {
			self.fillColorChanged(e);
		});

		this.model.on('rerender', function () {
			self.render();
		});

		this.model.on("destroy", function() {
			self.destroy();
		});
	},
	initMapHandlers: function() {
		var self = this;

		this.googleMapsObject.addListener('mousedown', function(event) {
			self.model.select();
		});
	},
	togglePoints: function(stateVisible) {
		if (stateVisible) {
			this.model.get('pointsCollection').showAll();
		} else {
			this.model.get('pointsCollection').hideAll();
		}
	},
	fillColorChanged: function(ev) {
		this.googleMapsObject.setOptions({strokeColor: ev.changed.fillColor});
	},
	destroy: function() {
		this.model.get("pointsCollection").off("add change:latLng remove");
		
		// destroy everything in this polygon/polyline
		_.invoke(this.model.get("pointsCollection").toArray(), 'destroy');

		$.each(this.model.get("pointsCollection"), function() {
			this.model.get("pointsCollection").remove(this, {silent: true});
		});

		this.destroyGoogleObject();
	    this.undelegateEvents();
	    this.remove(); 
	    Backbone.View.prototype.remove.call(this);
	},
	destroyGoogleObject: function() {
		this.googleMapsObject.setMap(null);
	}
});
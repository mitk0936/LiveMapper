'use strict';
this.Mapper = this.Mapper || {};

Mapper.Map = Backbone.Model.extend({
	defaults:{
		centerLat : 42.644716,
		centerLng : 23.233456,
		currentSelection: null,
	},
	initialize: function() {
		var self = this;

		new Mapper.mapView({
			model: self
		});

		this.set("pointsLayer", new Mapper.pointsLayer());
		this.set("polylinesLayer", new Mapper.polyLayer());
		this.set("polygonsLayer", new Mapper.polyLayer());

		this.on('mapCreated', function () {
			// experimental
			Mapper.mapController.initLayers();
		});
	},
	addPoint: function(p) {
		if (this.get("currentSelection") && this.get("currentSelection").addPoint) {
			this.get("currentSelection").addPoint(p);
		} else {
			this.createSelection(p);
		}
	},
	createSelection: function(p) {
		if (Mapper.mapController.currentState === "point") {
			this.get("pointsLayer").add(p);
		} else {
			var newPoly,
				currentLayer;

			switch(Mapper.mapController.currentState) {
				case "polyline":
					newPoly = new Mapper.poly();
					currentLayer = this.get("polylinesLayer");
					break;
				case "polygon":
					newPoly = new Mapper.polygon();
					currentLayer = this.get("polygonsLayer");
					break;
				default:
					break;
			}

			newPoly.addPoint(p);
			currentLayer.add(newPoly);
		}
	},
	selectCurrent: function(current, isNew) {
		var map = this;
		this.deselectCurrent();
		this.set("currentSelection", current);
		current.set("isSelected", true);
		current.on("destroy", function() {
			map.clearSelection();
		});
	},
	deselectCurrent: function() {
		if (this.get("currentSelection")) {
			this.get("currentSelection").set("isSelected", false);
		}
	},
	deleteItem: function(item) {
		if (confirm("Are you sure you want to delete this " + item.get("type"))) {
    		item.get("isSelected") && this.deselectCurrent();
    		Mapper.actions.clearActionsForItem(item);
			item.destroy();
		}
	},
	clearSelection: function() {
		this.deselectCurrent();
		this.set("currentSelection", null);
	},
	destroy: function () {
		this.trigger('destroy');
	},
	toJSON: function() {
		var properties = _.clone(this.attributes);
		var self = this;

		return{
			centerLat: properties.centerLat,
			centerLng: properties.centerLng,
			pointsLayer: self.get("pointsLayer").toJSON(),
			polylinesLayer: self.get("polylinesLayer").toJSON(),
			polygonsLayer: self.get("polygonsLayer").toJSON()
			// maptyler layer
		};
	}
});
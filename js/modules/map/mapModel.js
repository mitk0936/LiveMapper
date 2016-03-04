var Map = Backbone.Model.extend({
	defaults:{
		centerLat : 42.644716,
		centerLng : 23.233456,
		currentSelection: null,
	},
	initialize: function() {
		var self = this;

		new mapView({
			model: self
		});

		this.on('mapCreated', function () {
			this.set("pointsLayer", new pointsLayer());
			this.set("polylinesLayer", new polylinesLayer());
			this.set("polygonsLayer", new polygonsLayer());

			mapper.initLayers(); // experimental
		})
	},
	addPoint: function(p) {
		if (this.get("currentSelection") && this.get("currentSelection").addPoint) {
			this.get("currentSelection").addPoint(p);
		} else {
			this.createSelection(p);
		}
	},
	createSelection: function(p) {
		if (mapper.currentState === "point") {
			this.get("pointsLayer").add(p);
		} else {
			var newPoly,
				currentLayer;

			switch(mapper.currentState) {
				case "polyline":
					newPoly = new poly();
					currentLayer = this.get("polylinesLayer");
					break;
				case "polygon":
					newPoly = new polygon();
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
		this.get("currentSelection") && this.get("currentSelection").set("isSelected", false);
	},
	deleteItem: function(item) {
		if (confirm("Are you sure you want to delete this " + item.get("type"))) {
    		item.get("isSelected") && this.deselectCurrent();
			item.destroy();
		}
	},
	clearSelection: function() {
		this.deselectCurrent();
		this.set("currentSelection", null);
	},
	toJSON: function() {
		var result = _.clone(this.attributes);
		var self = this;

		return{
			centerLat: result.centerLat,
			centerLng: result.centerLng,
			pointsLayer: self.get("pointsLayer").toJSON(),
			polylinesLayer: self.get("polylinesLayer").toJSON(),
			polygonsLayer: self.get("polygonsLayer").toJSON()
		};
	}
});
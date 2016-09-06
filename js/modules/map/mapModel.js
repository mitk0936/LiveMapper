'use strict';
this.Mapper = this.Mapper || {};

Mapper.Map = Backbone.Model.extend({
	defaults:{
		currentState: "point",
		centerLat : 42.644716,
		centerLng : 23.233456,
		currentSelection: null,
	},
	initialize: function() {
		this.set("mapView", new Mapper.mapView({ model: this }));
		
		this.set("pointsLayer", new Mapper.pointsLayer(null, { map: this }));
		this.set("polylinesLayer", new Mapper.polyLayer(null, { map: this }));
		this.set("polygonsLayer", new Mapper.polyLayer(null, { map: this }));

		this.on('mapCreated', function () {
			// experimental
			// Mapper.mapController.initLayers();
		});
	},
	addPoint: function(latLng) {
		var point = new Mapper.point({
			lat: latLng.lat(),
			lng: latLng.lng(),
			map: this
		});

		var currentSelection = this.get("currentSelection");

		if ( currentSelection && currentSelection.addPoint ) {
			currentSelection.addPoint(point);
		} else {
			this.createSelection(point);
		}
	},
	createSelection: function (newPoint) {
		if ( this.get("currentState") === "point" ) {
			this.get("pointsLayer").add(newPoint);

			Mapper.actions.addAction(new Mapper.addItemAction({
				'target': newPoint,
				'parentCollection': this.get("pointsLayer")
			}));

			this.selectItem(newPoint);
		} else {
			var newPoly,
				currentLayer;

			switch(this.get("currentState")) {
				case "polyline":
					newPoly = new Mapper.poly({
						map: this
					});
					currentLayer = this.get("polylinesLayer");
					break;
				case "polygon":
					newPoly = new Mapper.polygon({
						map: this
					});
					currentLayer = this.get("polygonsLayer");
					break;
				default:
					break;
			}

			newPoly.addPoint(newPoint);
			currentLayer.add(newPoly);

			Mapper.actions.addAction(new Mapper.addItemAction({
				'target': newPoly,
				'parentCollection': currentLayer
			}));

			this.selectItem(newPoly);
		}
	},
	selectItem: function (item) {
		if ( this.get('currentSelection') !== item ) {
			var map = this;
			this.deselectCurrentItem();
			this.set("currentSelection", item);
			item.set("isSelected", true);
			item.on("destroy deleted restored", function() {
				map.deselectCurrentItem();
			});
		}
	},
	deselectCurrentItem: function() {
		if (this.get("currentSelection")) {
			this.get("currentSelection").set("isSelected", false);
			this.set("currentSelection", null);
		}
	},
	deleteItem: function (item) {
		if ( confirm("Are you sure you want to delete this " + item.get("type")) ) {
			item.get("isSelected") && this.deselectCurrentItem();
			item.delete();
		}
	},
	destroy: function () {},
	toJSON: function() {
		var properties = _.clone(this.attributes);
		var self = this;

		return {
			centerLat: properties.centerLat,
			centerLng: properties.centerLng,
			pointsLayer: self.get("pointsLayer").toJSON(),
			polylinesLayer: self.get("polylinesLayer").toJSON(),
			polygonsLayer: self.get("polygonsLayer").toJSON()
			// maptyler layer
		};
	}
});
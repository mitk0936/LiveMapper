var Map = Backbone.Model.extend({
	defaults:{
		centerLat : 42.644716,
		centerLng : 23.233456,
		currentSelection: null,
	},
	initialize: function(){
		var self = this;

		this.set("pointsLayer", new pointsLayer());
		this.set("polylinesLayer", new polylinesLayer());
		this.set("polygonsLayer", new polygonsLayer());

		new mapView({
			model: self
		});

		new statesView({
			model: self
		});
	},
	addPoint: function(p){
		if(this.get("currentSelection") && this.get("currentSelection").addPoint){
			this.get("currentSelection").addPoint(p);
		}else{
			this.createSelection(p);
		}
	},
	createSelection: function(p){
		if(mapper.currentState === "point"){
			this.get("pointsLayer").add(p);
		}else{
			var newPoly,
				currentLayer;

			switch(mapper.currentState){
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
	selectCurrent: function(current, isNew){
		this.deselectCurrent();
		this.set("currentSelection", current);
		current.set("isSelected", true);
	},
	deselectCurrent: function(){
		this.get("currentSelection") && this.get("currentSelection").set("isSelected", false);
	},
	clearSelection: function(){
		this.deselectCurrent();
		this.set("currentSelection", null);
	},
	toJSON: function(){
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
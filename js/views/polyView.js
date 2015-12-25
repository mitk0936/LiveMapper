var polyView = Backbone.View.extend({
	initialize: function(){
		this.initHandlers();
	},
	render: function(){
		var self = this;
		
		this.googleMapsObject && this.googleMapsObject.setMap(null);

		this.googleMapsObject = new google.maps.Polyline({
			path: self.model.get('pointsCollection').pluck("latLng"),
			geodesic: true,
			strokeColor: self.model.get("fillColor"),
			strokeOpacity: 1.0,
			strokeWeight: 5
		});

		this.googleMapsObject.setMap(map);
		this.initMapHandlers();
	},
	initHandlers: function(){
		var self = this;

		this.model.get("pointsCollection").on("pointDragStop", function(ev){
			if(ev.changed){
				self.insertHelperPoints(ev.model, this);
			}
		});

		this.model.get("pointsCollection").on("add change:latLng remove", function(){
			self.render();
		});

		this.model.get("pointsCollection").on("add remove", function(){
			self.model.setStartEndPoints();
		});

		this.model.on("change:isSelected", function(e){
			var isSelected = self.model.get("isSelected");
			isSelected ? self.setStyleSelected() : self.setStyleDeselected();
	    	self.togglePoints(isSelected);
		});

		this.model.on("destroy", function(){
			/* when the model is destroyed
				destroy every contained object
			*/
			self.destroy();
		});
	},
	initMapHandlers: function(){
		var self = this;
		// this.googleMapsObject.addListener('click', function() {
			
		// });

		this.googleMapsObject.addListener('click', function(event) {
			if(self.model.get("isSelected")){
				if(confirm("Are you sure you want to delete this " + self.model.get("type") + "?")){
					// will call destroying the view and every point of the poly
					self.model.destroy();
				}
			}else{
				mapper.getCurrentMap().selectCurrent(self.model);
			}
			
		});
	},
	insertHelperPoints: function(pointModel, collection){
		var index = collection.indexOf(pointModel);

		var isFirst = (index === 0),
			isLast = (index === collection.length - 1);

		if(!isFirst){
			// insert before if the moved point wasnt the first one
			var prev = collection.at(index - 1);
			var pos = calcMiddlePoint(prev.get("latLng").lat(), prev.get("latLng").lng(), pointModel.get("latLng").lat(), pointModel.get("latLng").lng());
			
			this.model.addPoint(new point({
				lat: pos["lat"],
				lng: pos["lng"]
			}), index);

			index++;
		}

		if(!isLast){
			// insert after if the moved point wasnt the last one
			var next = collection.at(index + 1);
			var pos = calcMiddlePoint(pointModel.get("latLng").lat(), pointModel.get("latLng").lng(), next.get("latLng").lat(), next.get("latLng").lng());
			
			this.model.addPoint(new point({
				lat: pos["lat"],
				lng: pos["lng"]
			}),  index + 1);
		}		
	},
	setStyleSelected: function(){
		this.model.set("fillColor", this.model.defaults.selectedFillColor);
		this.googleMapsObject.setOptions({strokeColor: this.model.defaults.selectedFillColor});
	},
	setStyleDeselected: function(){
		this.model.set("fillColor", this.model.defaults.fillColor);
		this.googleMapsObject.setOptions({strokeColor: this.model.defaults.fillColor});
	},
	togglePoints: function(state){
		// change the visibility of the contained points
		_.each(this.model.get("pointsCollection").models, function(item){
			item.set("visible", state);
		});
	},
	destroy: function(){
		// destroy everything in this polygon/polyline
		_.invoke(this.model.get("pointsCollection").toArray(), 'destroy');

		$.each(this.model.get("pointsCollection"), function(){
			this.model.get("pointsCollection").remove(this, {silent: true});
		});

		this.destroyGoogleObject();
	    this.undelegateEvents();
	    this.remove(); 
	    Backbone.View.prototype.remove.call(this);
	},
	destroyGoogleObject: function(){
		this.googleMapsObject.setMap(null);
	}
});
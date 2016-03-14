var polyView = Backbone.View.extend({
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
			strokeWeight: 3
		});

		this.googleMapsObject.setMap(mapper.mapCanvas);
		this.initMapHandlers();
	},
	initHandlers: function() {
		var self = this;

		this.model.get("pointsCollection").on("pointDragStop", function(ev) {
			if (ev.changed) {
				self.insertHelperPoints(ev.model, this);
			}
		});

		this.model.get("pointsCollection").on("add change:latLng remove", function(e) {
			self.render();
		});

		this.model.get("pointsCollection").on("add remove", function() {
			self.model.setStartEndPoints();
		});

		this.model.on("change:isSelected", function(e) {
	    	self.togglePoints(e.changed.isSelected);
		});

		this.model.on("change:fillColor", function (e) {
			self.fillColorChanged(e);
		});

		this.model.on("destroy", function() {
			/*
				when the model is destroyed
				destroy every contained object
			*/
			self.destroy();
		});
	},
	initMapHandlers: function() {
		var self = this;

		this.googleMapsObject.addListener('mousedown', function(event) {
			if (!self.model.get("isSelected")) {
				mapper.getCurrentMap().selectCurrent(self.model);
			}
		});
	},
	insertHelperPoints: function(pointModel, collection) {
		var index = collection.indexOf(pointModel);

		var isFirst = (index === 0),
			isLast = (index === collection.length - 1);

		if (!isFirst) {
			// insert before if the moved point wasnt the first one
			var prev = collection.at(index - 1);
			var pos = calcMiddlePoint(prev.get("latLng").lat(), prev.get("latLng").lng(), pointModel.get("latLng").lat(), pointModel.get("latLng").lng());
			
			this.model.addPoint(new point({
				lat: pos["lat"],
				lng: pos["lng"]
			}), index);

			index++;
		}

		if (!isLast) {
			// insert after if the moved point wasnt the last one
			var next = collection.at(index + 1);
			var pos = calcMiddlePoint(pointModel.get("latLng").lat(), pointModel.get("latLng").lng(), next.get("latLng").lat(), next.get("latLng").lng());
			
			this.model.addPoint(new point({
				lat: pos["lat"],
				lng: pos["lng"]
			}),  index + 1);
		}		
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
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

		this.googleMapsObject.setMap(Mapper.mapController.mapCanvas);
		this.initMapHandlers();
	},
	initHandlers: function() {
		var self = this,
			polyJSONBefore = this.model.toJSON();

		this.model.get("pointsCollection").on("pointDragStart", function(ev) {
			polyJSONBefore = self.model.toJSON();
		});
		
		this.model.get("pointsCollection").on("pointDragStop", function(ev) {
			if (ev.changed && !(ev.model.get('isHelper'))) {

				ev.model.trigger('refresh');
				self.model.insertHelperPoints(ev.model, this);
			}

			Mapper.actions.addAction(new Mapper.changeItemStateAction({
	    		'target': self.model,
	    		'jsonStateBefore': polyJSONBefore,
	    		'jsonStateAfter': self.model.toJSON(),
	    		'refreshPosition': true
	    	}));
		});

		this.model.get("pointsCollection").on("add change:latLng remove", function(e) {
			self.render();
		});

		this.model.get("pointsCollection").on("add remove", function() {
			self.model.setStartEndPoints();
		});

		this.model.get("pointsCollection").on("remove", function() {

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
			if (!self.model.get("isSelected")) {
				Mapper.mapController.getCurrentMap().selectCurrent(self.model);
			}
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
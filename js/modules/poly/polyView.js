'use strict';
this.Mapper = this.Mapper || {};

Mapper.polyView = Backbone.View.extend({
	initialize: function() {
		this.initHandlers();
	},
	render: function() {
		var self = this;
		
		this.mapObject && this.mapObject.setMap(null);

		this.mapObject = new google.maps.Polyline({
			path: self.model.get('pointsCollection').pluck("latLng"),
			geodesic: true,
			strokeColor: self.model.get("fillColor"),
			strokeOpacity: 1,
			strokeWeight: 4
		});

		Mapper.mapController.appendToMap(this.mapObject);
		this.initMapHandlers();
	},
	initHandlers: function() {
		var self = this;

		this.model.get("pointsCollection").on("add pointDragStop refresh remove", function(e) {
			self.render();
		});

		this.model.on("restored", function () {
			self.render();
		});

		this.model.on("deleted", function () {
			self.mapObject.setMap(null);
		});

		this.model.on("change:isSelected", function(e) {
	    	self.togglePoints(e.changed.isSelected);
		});

		this.model.on("change:fillColor", function (e) {
			self.setFillColor(e);
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

		var timeout = window.setTimeout,
			fakeTimeout = function (cb, timer) {
				cb();
			};

		this.mapObject.addListener('mousedown', function(event) {
			// fake timeout, to avoid performance issue with selecting multiple markers in google maps lib
			window.setTimeout = fakeTimeout;
			self.model.select();
			// restore the setTimeout function
			window.setTimeout = timeout;
		});
	},
	togglePoints: function(stateVisible) {
		if (stateVisible) {
			this.model.get('pointsCollection').showAll();
		} else {
			this.model.get('pointsCollection').hideAll();
		}
	},
	setFillColor: function(ev) {
		this.mapObject.setOptions({
			strokeColor: ev.changed.fillColor
		});
	},
	destroy: function() {
		this.model.get("pointsCollection").off("add change:latLng remove");
		
		// destroy everything in this polygon/polyline
		_.invoke(this.model.get("pointsCollection").toArray(), 'destroy');

		$.each(this.model.get("pointsCollection"), function() {
			this.model.get("pointsCollection").remove(this, {silent: true});
		});

		this.destroyMapObject();
	    this.undelegateEvents();
	    this.remove(); 
	    Backbone.View.prototype.remove.call(this);
	},
	destroyMapObject: function() {
		this.mapObject.setMap(null);
	}
});
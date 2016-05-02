'use strict';
this.Mapper = this.Mapper || {};

Mapper.pointView = Backbone.View.extend({
	initialize: function() {
		this.render();
		this.initHandlers();
	},
	render: function() {
		var self = this;

		this.googleMarker && this.destroyGoogleMarker();

		this.model.set("latLng", new google.maps.LatLng(self.model.get("lat"), self.model.get("lng")));
		
		this.googleMarker = new google.maps.Marker({
	        position: self.model.get("latLng"),
            optimized : true,
	        draggable: self.model.get("draggable"),
            clickable: self.model.get("clickable"),
	        icon : self.model.get('icon') || Utils.configStyles.icons['defaultIcon']
	    });

	    Mapper.mapController.appendToMap(this.googleMarker);

		this.initMapHandlers();
	},
	initMapHandlers: function() {
		var self = this;

		this.model.get("draggable") && this.initDraggableEvents();

		google.maps.event.addListener(this.googleMarker, 'click', function(event) {
	    	self.model.onClicked();
	    });
	},
	initDraggableEvents: function() {
		var self = this;

		google.maps.event.addListener(this.googleMarker, 'dragstart', function(event) {
			self.model.onDragStart();
	    });

	    google.maps.event.addListener(this.googleMarker, 'drag', function(event) {
	    	self.model.set("latLng", event.latLng);
	    });

		google.maps.event.addListener(this.googleMarker, 'dragend', function(event) {
    		self.model.onDragEnd(event.latLng);
	    });
	},

	initHandlers: function() {
		var self = this;

		this.model.on("change:visible", function(ev) {
			self.googleMarker.setVisible(ev.changed.visible);
		});

		// Listeners for model states changes
		this.model.on("destroy", function() {
			self.destroy();
		});

		this.model.on("refresh", function() {
	    	self.render();
	    	self.bindToParentCollectionMap();
	    });

		this.model.once('change:_parentCollection', function () {
			self.bindToParentCollectionMap();
		});

		this.model.on('change:icon', function (ev) {
			self.googleMarker.setIcon(self.model.get('icon'));
		});
	},
	destroy: function() {
		this.destroyGoogleMarker();
	    this.undelegateEvents();
	    this.remove(); 
	    Backbone.View.prototype.remove.call(this);
	},
	bindToParentCollectionMap: function () {
		// bind to the collection layer for show/hide all points in it at once
		var parentCollection = this.model.get('_parentCollection');
		parentCollection && this.googleMarker.bindTo('map', parentCollection.pointsViewLayer, 'points');
	},
	setDefaultPointStyle: function() {
		this.googleMarker.setIcon(Utils.configStyles.icons['defaultIcon']);
	},
	setStartPointStyle: function() {
		this.googleMarker.setIcon(Utils.configStyles.icons['startIcon']);
	},
	setEndPointStyle: function() {
		this.googleMarker.setIcon(Utils.configStyles.icons['endIcon']);
	},
	setSelectedPointStyle: function() {
		this.googleMarker.setIcon(Utils.configStyles.icons['selectedIcon']);
	},
	destroyGoogleMarker: function() {
		// unbind map property, because it is binded to the pointsCollection layer
		if (this.googleMarker) {
			this.googleMarker.unbind('map');

			this.googleMarker.setMap(null);
			this.googleMarker = null;
		}
	}
});

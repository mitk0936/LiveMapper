'use strict';
this.Mapper = this.Mapper || {};

Mapper.pointView = Backbone.View.extend({
	initialize: function() {
		this.render();
		this.initHandlers();
	},
	render: function() {
		var self = this;

		this.mapMarker && this.destroyMapMarker();

		this.model.set("latLng", new google.maps.LatLng(self.model.get("lat"), self.model.get("lng")));
		
		this.mapMarker = new google.maps.Marker({
	        position: self.model.get("latLng"),
            optimized : true,
	        draggable: self.model.get("draggable"),
            clickable: self.model.get("clickable"),
	        icon : self.model.get('icon') || Utils.configStyles.icons['defaultIcon']
	    });

	    this.model.get('map').get('mapView').appendToMap(this.mapMarker);

		this.initMapHandlers();
	},
	initMapHandlers: function() {
		var self = this;

		this.model.get("draggable") && this.initDraggableEvents();

		google.maps.event.addListener(this.mapMarker, 'click', function(event) {
	    	self.model.select();
	    });
	},
	initDraggableEvents: function() {
		var self = this;

		google.maps.event.addListener(this.mapMarker, 'dragstart', function(event) {
			self.model.startDragging();
	    });

	    google.maps.event.addListener(this.mapMarker, 'drag', function(event) {
	    	self.model.set("latLng", event.latLng);
	    });

		google.maps.event.addListener(this.mapMarker, 'dragend', function(event) {
    		self.model.stopDragging(event.latLng);
	    });
	},

	initHandlers: function() {
		var self = this;

		// Listeners for model states changes
		this.model.on("destroy", function() {
			self.destroy();
		});

		this.model.on("restored", function () {
			// only for single points
			self.render();
		});

		this.model.on("deleted", function () {
			// only for single points
			self.mapMarker.setMap(null);
		});

		this.model.on("refresh", function() {
	    	self.render();
	    	self.bindToParentCollectionMap();
	    });

		this.model.once('change:_parentCollection', function () {
			self.bindToParentCollectionMap();
		});

		this.model.on('change:icon', function (ev) {
			self.mapMarker.setIcon(self.model.get('icon'));
		});
	},
	destroy: function() {
		this.destroyMapMarker();
	    this.undelegateEvents();
	    this.remove(); 
	    Backbone.View.prototype.remove.call(this);
	},
	bindToParentCollectionMap: function () {
		if ( !this.model.get('single') ) {
			// bind to the collection layer for show/hide all points in it at once
			this.model.get('_parentCollection').bindMarker(this.mapMarker);
		}
	},
	unbindFromParentCollectionMap: function () {
		if ( !this.model.get('single') ) {
			var parentCollection = this.model.get('_parentCollection');
			parentCollection && parentCollection.unbindMarker(this.mapMarker);
		}

		this.mapMarker.setMap(null);
	},
	destroyMapMarker: function() {
		// unbind map property, because it is binded to the pointsCollection layer
		if ( this.mapMarker ) {
			this.unbindFromParentCollectionMap();
			this.mapMarker = null;
		}
	}
});

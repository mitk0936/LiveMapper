var pointView = Backbone.View.extend({
	initialize: function() {
		this.render();
		this.initHandlers();
	},
	render: function() {
		var self = this;

		if (this.googleMarker) {
			var icon = this.googleMarker.icon;
			this.destroyGoogleMarker();
		}

		this.model.set("latLng", new google.maps.LatLng(self.model.get("lat"), self.model.get("lng")));
		
		this.googleMarker = new google.maps.Marker({
	        position: self.model.get("latLng"),
	        map : mapper.mapCanvas,
            optimized : true,
	        draggable: self.model.get("draggable"),
            clickable: self.model.get("clickable"),
	        icon : icon || configStyles.icons['defaultIcon']
	    });

		this.initMapHandlers();
	},
	initMapHandlers: function() {
		var self = this;

	    if (this.model.get("draggable")) {
	    	this.initDraggableEvents();
		}

		google.maps.event.addListener(this.googleMarker, 'click', function(event) {
	    	if (self.model.get("single")) {
	    		if (!self.model.get("isSelected")) {
					mapper.getCurrentMap().selectCurrent(self.model);
				}
			} else {
				if (confirm("Are you sure you want to delete this marker")) {
					self.model.destroy();
				}
			}
	    });
	},
	initDraggableEvents: function() {
		var self = this;

		google.maps.event.addListener(this.googleMarker, 'dragend', function(event) {
    		self.model.set("latLng", event.latLng);

	    	self.triggerEventParent("pointDragStop", {
	    		model: self.model,
	    		changed: true
	    	});
	    });

	    google.maps.event.addListener(this.googleMarker, 'dragstart', function(event) {
	    	
	    });

	    google.maps.event.addListener(this.googleMarker, 'drag', function(event) {
	    	self.model.set("latLng", event.latLng);
	    });
	},
	initHandlers: function() {
		var self = this;

		this.model.on("change:isSelected", function() {
	    	if (self.model.get("single")) {
	    		if (self.model.get("isSelected")) {
		    		self.googleMarker.setIcon(configStyles.icons['selectedIcon']);
		    	} else {
		    		self.setDefaultPointStyle();
		    	}
	    	}
		});

		// init events for points in polylines and polygons
		this.listenTo(this.model, "change:isStartPoint", function() {
			if (this.model.get("isStartPoint")) {
				self.setStartPointStyle();
			} else {
				self.setDefaultPointStyle();
			}
		});

		this.listenTo(this.model, "change:isEndPoint", function() {
			if (this.model.get("isEndPoint")) {
				self.setEndPointStyle();
			} else {
				self.setDefaultPointStyle();
			}
		});

		this.model.on("change:visible", function(ev) {
			self.googleMarker.setVisible(ev.changed.visible);
		});

		// Listen for model states changes
		this.model.on("destroy", function() {
			self.destroy();
		});

		this.model.on("refresh", function() {
	    	self.render();
	    });

		this.model.once('change:_parentCollection', function () {
			// bind to the collection layer for show/hide all points in it at once
			self.googleMarker.bindTo('map', self.model.get('_parentCollection').pointsViewLayer, 'points');
		});
	},
	destroy: function() {
		this.destroyGoogleMarker();
	    this.undelegateEvents();
	    this.remove(); 
	    Backbone.View.prototype.remove.call(this);
	},
	setDefaultPointStyle: function() {
		this.googleMarker.setIcon(configStyles.icons['defaultIcon']);
	},
	setStartPointStyle: function() {
		this.googleMarker.setIcon(configStyles.icons['startIcon']);
	},
	setEndPointStyle: function() {
		this.googleMarker.setIcon(configStyles.icons['endIcon']);
	},
	setSelectedPointStyle: function() {
		this.googleMarker.setIcon(configStyles.icons['selectedIcon']);
	},
	destroyGoogleMarker: function() {
		// unbind map property, because it is binded to the pointsCollection layer
		this.googleMarker.unbind('map');

		this.googleMarker.setMap(null);
		this.googleMarker = null;
	},
	triggerEventParent: function(eventName, param) {
		if (this.model.get("_parentCollection")) {
			this.model.get("_parentCollection").trigger(eventName, param);
		}
	}
});

this.Mapper = this.Mapper || {};

Mapper.pointView = Backbone.View.extend({
	initialize: function() {
		this.render();
		this.initHandlers();
	},
	render: function() {
		var self = this,
			icon;

		if (this.googleMarker) {
			this.destroyGoogleMarker();
		}

		if (this.model.get('isHelper')) {
			icon = Utils.configStyles.icons['helperIcon'];
		}

		this.model.set("latLng", new google.maps.LatLng(self.model.get("lat"), self.model.get("lng")));
		
		this.googleMarker = new google.maps.Marker({
	        position: self.model.get("latLng"),
	        map : Mapper.mapController.mapCanvas,
            optimized : true,
	        draggable: self.model.get("draggable"),
            clickable: self.model.get("clickable"),
	        icon : icon || Utils.configStyles.icons['defaultIcon']
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
					Mapper.mapController.getCurrentMap().selectCurrent(self.model);
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

		var jsonStateBefore = self.model.toJSON();

		google.maps.event.addListener(this.googleMarker, 'dragstart', function(event) {
			// prepare the jsonStateBefore, when point is started dragging
			if (self.model.get('single')) {
	    		jsonStateBefore = self.model.toJSON();
	    	} else {
	    		self.triggerParentPointDragStart();
	    	}
	    });

		google.maps.event.addListener(this.googleMarker, 'dragend', function(event) {
    		self.model.set("latLng", event.latLng);

	    	if (self.model.get('single')) {
	    		
	    		Mapper.actions.addAction(new Mapper.changeItemStateAction({
		    		'target': self.model,
		    		'jsonStateBefore': jsonStateBefore,
		    		'jsonStateAfter': self.model.toJSON(),
		    		'refreshPosition': true
		    	}));

	    	} else {
	    		self.triggerParentPointDragFinish();
	    	}
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
		    		self.googleMarker.setIcon(Utils.configStyles.icons['selectedIcon']);
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
	},
	triggerParentPointDragStart: function () {
		this.triggerEventParent("pointDragStart", {
    		model: this.model,
    		changed: true
    	});
	},
	triggerParentPointDragFinish: function () {
		this.triggerEventParent("pointDragStop", {
    		model: this.model,
    		changed: true
    	});
	},
	triggerEventParent: function(eventName, param) {
		if (this.model.get("_parentCollection")) {
			this.model.get("_parentCollection").trigger(eventName, param);
		}
	}
});

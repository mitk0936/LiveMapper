'use strict';
this.Mapper = this.Mapper || {};

Mapper.point = Mapper.baseMapObject.extend({
	defaults:{
		type: Utils.CONFIG.pointType,
		lat: 42.5555555,
		lng: 23.34343434,
		single: false,
		isHelper: false,
		label: "",

		latLng: null, // google maps object
		
		// visual/interaction properties
		icon: Utils.configStyles.icons['defaultIcon'],
		draggable: true,
		clickable: true,
		isSelected: false,
	    isStartPoint: false,
	    isEndPoint: false,
	    
	    stylePanelConfiguration: {
			'label': {
				controlType: 'labelControl',
				getter: 'getLabel',
				setter: 'setLabel'
			}
		},

	    _parentCollection: null,
	},
	initialize: function() {
		var self = this;

		this.refreshPointType();

		this.on("change:latLng", function(ev) {
			self.set({
				"lat" : ev.changed.latLng.lat(),
				"lng" : ev.changed.latLng.lng(),
			});
		});

		this.on("change:isHelper change:isStartPoint change:isEndPoint change:isSelected", function (ev) {
			self.refreshPointType();
		});

		new Mapper.pointView({model: this});
	},
	setIcon: function (newIcon) {
		this.set('icon', newIcon);
	},
	refreshPointType: function () {
		if ( this.get('isEndPoint') || this.get('isStartPoint') ) {
			this.set('isHelper', false, {
				silent: true
			});
		}

		if ( this.get('isStartPoint') ) {
			this.setIcon(Utils.configStyles.icons['startIcon']);
			return;
		}

		if ( this.get('isEndPoint') ) {
			this.setIcon(Utils.configStyles.icons['endIcon']);
			return;
		}

		if ( this.get('isHelper') ) {
			this.setIcon(Utils.configStyles.icons['helperIcon']);
			return;
		}

		if ( this.get("isSelected") ) {
    		this.setIcon(Utils.configStyles.icons['selectedIcon']);
    		return;
    	}

		this.setIcon(Utils.configStyles.icons['defaultIcon']);
	},
	select: function () {
		if ( this.get("single") ) {
    		Mapper.mapController.selectCurrent(this);
			return;
		}

		this.confirmDestroy();
	},
	confirmDestroy: function () {
		if ( confirm("Are you sure you want to delete this marker") ) {
			this.destroy();
		}
	},
	startDragging: function () {
		if (this.get('single')) {
    		this.set('jsonStateBefore', this.toJSON());
    	} else {
    		this.triggerParentPointDragStart();
    	}
	},
	stopDragging: function (latLng) {
		this.set("latLng", latLng);

    	if (this.get('single')) {
    		Mapper.actions.addAction(new Mapper.changeItemStateAction({
	    		'target': this,
	    		'jsonStateBefore': this.get('jsonStateBefore'),
	    		'jsonStateAfter': this.toJSON(),
	    		'refreshPosition': true
	    	}));
    	} else {
    		this.triggerParentPointDragFinish();
    	}
	},
	triggerParentPointDragStart: function () {
		this.triggerEventParent("pointDragStart", {
    		model: this,
    		changed: true
    	});
	},
	triggerParentPointDragFinish: function () {
		this.triggerEventParent("pointDragStop", {
    		model: this,
    		changed: true
    	});
	},
	triggerEventParent: function(eventName, param) {
		if (this.get("_parentCollection")) {
			this.get("_parentCollection").trigger(eventName, param);
		}
	},
	toJSON: function() {
		var properties = _.clone(this.attributes);

		return {
			type: properties.type,
			lat: properties.lat,
			lng: properties.lng,
			single: properties.single,
			isHelper: properties.isHelper,
			label: properties.label,
		};
	}
});
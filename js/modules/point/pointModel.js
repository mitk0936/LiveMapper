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
	    visible: true,
	    
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

		this.on("change:latLng", function() {
			self.updatePositionData();
		});

		this.on("change:isHelper change:isStartPoint change:isEndPoint", function (ev) {
			self.refreshPointType();
		});

		new Mapper.pointView({model: this});
	},
	setIcon: function (newIcon) {
		this.set('icon', newIcon)
	},
	refreshPointType: function () {

		if ( this.get('isEndPoint') || this.get('isStartPoint') ) {
			this.get('isHelper', false, {
				silent: true
			});
		}

		if ( this.get('isEndPoint') ) {
			this.setIcon(Utils.configStyles.icons['endIcon']);
			return;
		}

		if ( this.get('isStartPoint') ) {
			this.setIcon(Utils.configStyles.icons['startIcon']);
			return;
		}

		if ( this.get('isHelper') ) {
			this.setIcon(Utils.configStyles.icons['helperIcon']);
			return;
		}

		this.setIcon(Utils.configStyles.icons['defaultIcon']);
	},
	updatePositionData: function(refresh) {
		var latLng = this.get("latLng");

		this.set({
			"lat" : latLng.lat(),
			"lng" : latLng.lng(),
		});

		refresh && this.trigger("refresh");
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
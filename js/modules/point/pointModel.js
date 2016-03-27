this.Mapper = this.Mapper || {};

Mapper.point = Mapper.baseMapObject.extend({
	defaults:{
		type: "point",
		lat: 42.5555555,
		lng: 23.34343434,
		single: false,
		isNew: true,

		latLng: null, // google maps object
		
		// styles/interaction properties
		draggable: true,
		clickable: true,
		isSelected: false,
	    isStartPoint: false,
	    isEndPoint: false,
	    visible: true,
	    label: "",
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

		this.on("change:latLng", function() {
			self.updatePositionData();
		});

		new Mapper.pointView({model: this});
	},
	updatePositionData: function(refresh) {
		var latLng = this.get("latLng");

		this.set({
			"lat" : latLng.lat(),
			"lng" : latLng.lng(),
		});

		refresh && this.trigger("refresh");
	},
	remove: function() {
		var retrieveData = this.toJSON();

		if (this._parentCollection) {
			retrieveData._parentCollection = this._parentCollection;
		}

		return retrieveData;
	},
	toJSON: function() {
		var result = _.clone(this.attributes);

		return {
			type: result.type,
			lat: result.lat,
			lng: result.lng
		};
	}
});
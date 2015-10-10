var point = Backbone.Model.extend({
	defaults:{
		type: "point",
		lat: 42.5555555,
		lng: 23.34343434,
		single: false,

		latLng: null, // google maps object
		
		// styles/interaction properties
		draggable: true,
		clickable: true,
		isSelected: false,
	    isStartPoint: false,
	    isEndPoint: false,
	    visible: true,

	    _parentCollection: null,
	},
	initialize: function(){
		var self = this;
		
		this.setPosition(this.get("latLng"));

		new pointView({model: this});

		if(this.get("single")){
			this.set("isSelected", true);
		}
	},
	setPosition: function(latLng, refresh){
		if(!latLng){
			throw "Wrong latLng object";
			return;
		}

		this.set({
			"lat" : latLng.lat(),
			"lng" : latLng.lng(),
			"latLng" : latLng
		});

		refresh && this.trigger("refresh");
	},
	toJSON: function(){
		var result = _.clone(this.attributes);

		return{
			type: result.type,
			lat: result.lat,
			lng: result.lng
		};
	}
});
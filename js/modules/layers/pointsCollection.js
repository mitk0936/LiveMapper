this.Mapper = this.Mapper || {};

Mapper.pointsCollection = Backbone.Collection.extend({
	initialize: function(){
		this.pointsViewLayer = new google.maps.MVCObject();
		this.initHandlers();
	},
	initHandlers: function () {
		var self = this;
		this.on('add', function (point) {
			point.set("_parentCollection", self);
		})
	},
	showAll: function () {
		Mapper.mapController.bindToMap('points', this.pointsViewLayer);
	},
	hideAll: function () {
		this.pointsViewLayer.set('points', null);
	},
	destroy: function () {
		var model;

		while (model = this.first()) {
			model.destroy();
		}
	},
	toJSON: function () {
		var result = [];

		_.each(this.models, function (pointModel, key) {
			result[key] = pointModel.toJSON();
		});
		
		return result;
	}
});
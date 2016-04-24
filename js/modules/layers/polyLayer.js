'use strict';
this.Mapper = this.Mapper || {};

Mapper.polyLayer = Backbone.Collection.extend({
	initialize: function(){
		this.on("add", function selectAsCurrentItem(item) {
			Mapper.mapController.getCurrentMap().selectCurrent(item, true);
		});
	},
	destroy: function () {
		_.each(this.models, function (polyModel, key) {
			polyModel.destroy();
		});
	},
	toJSON: function () {
		var result = [];

		_.each(this.models, function (polyModel, key) {
			result[key] = polyModel.toJSON();
		});
		
		return result;
	}
});
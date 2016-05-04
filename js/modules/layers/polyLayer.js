'use strict';
this.Mapper = this.Mapper || {};

Mapper.polyLayer = Backbone.Collection.extend({
	initialize: function(){
		this.on("add", function selectAsCurrentItem (item) {
			Mapper.mapController.selectCurrent(item);
		});
	},
	destroy: function () {
		var model;

		while (model = this.first()) {
			model.destroy();
		}
	},
	toJSON: function () {
		var result = [];

		_.each(this.models, function (polyModel, key) {
			if ( polyModel.get('pointsCollection').length > 0 ) {
				// do not add empty polys
				result[key] = polyModel.toJSON();
			}
		});
		
		return result;
	}
});
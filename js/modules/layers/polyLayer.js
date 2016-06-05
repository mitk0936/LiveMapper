'use strict';
this.Mapper = this.Mapper || {};

Mapper.polyLayer = Mapper.baseCollection.extend({
	initialize: function() {
		var self = this;

		this.on("add", function selectAsCurrentItem (item) {
			item.set("_parentCollection", self);
			Mapper.mapController.selectCurrent(item);
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
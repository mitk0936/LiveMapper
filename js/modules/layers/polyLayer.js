'use strict';
this.Mapper = this.Mapper || {};

Mapper.polyLayer = Mapper.baseCollection.extend({
	initialize: function(models, args) {
		this.map = args.map;
		var self = this;
		
		this.on("add", function selectAsCurrentItem (item) {
			item.set("_parentCollection", self);
			self.map.selectItem(item);
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
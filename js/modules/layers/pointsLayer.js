'use strict';
this.Mapper = this.Mapper || {};

Mapper.pointsLayer = Mapper.pointsCollection.extend({
	initialize: function () {
		Mapper.pointsLayer.__super__.initialize.apply(this, arguments);
	},
	initHandlers: function () {
		var self = this;

		this.on("add", function (item) {
			item.set("single", true);
			item.set("_parentCollection", self);
			self.map.selectItem(item);
		});

		this.on("remove", function () {

		});
	}
});
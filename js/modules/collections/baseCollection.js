'use strict';
this.Mapper = this.Mapper || {};

Mapper.baseCollection = Backbone.Collection.extend({
	destroy: function () {
		var model;

		while (model = this.first()) {
			model.destroy();
		}
	}
});
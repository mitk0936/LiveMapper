'use strict';
this.Mapper = this.Mapper || {};

Mapper.deletedItemsCollection = Mapper.baseCollection.extend({
	initialize: function () {
		this.on('add', function (item) {
			item.trigger('deleted');
		});

		this.on('remove', function (item) {
			item.trigger('restored');
		});
	},
	destroy: function () {
		this.off();
		Mapper.baseCollection.__super__.destroy.apply(this);
	}
});
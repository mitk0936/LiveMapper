this.Mapper = this.Mapper || {};

Mapper.pointsLayer = Mapper.pointsCollection.extend({
	initialize: function(){
		Mapper.pointsLayer.__super__.initialize.apply(this);
	},
	initHandlers: function () {
		var self = this;

		this.on("add", function (item) {
			item.set("single", true);
			item.set("_parentCollection", self);
			Mapper.mapController.selectCurrent(item);
		});

		this.on("remove", function () {

		});
	}
});
this.Mapper = this.Mapper || {};

Mapper.pointsLayer = Mapper.pointsCollection.extend({
	initialize: function(){
		Mapper.pointsLayer.__super__.initialize.apply(this);
	},
	initHandlers: function () {
		this.on("add", function(item){
			item.set("single", true);
			Mapper.mapController.selectCurrent(item);
		});
	}
});
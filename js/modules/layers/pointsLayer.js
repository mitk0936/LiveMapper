var pointsLayer = pointsCollection.extend({
	initialize: function(){
		pointsLayer.__super__.initialize.apply(this);
	},
	initHandlers: function () {
		this.on("add", function(item){
			item.set("single", true);
			mapper.getCurrentMap().selectCurrent(item, true);
		});
	}
});
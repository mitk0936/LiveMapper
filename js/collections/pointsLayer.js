var pointsLayer = Backbone.Collection.extend({
	initialize: function(){
		this.on("add", function(item){
			item.set("single", true);
			mapper.getCurrentMap().selectCurrent(item, true);
		})
	}
});
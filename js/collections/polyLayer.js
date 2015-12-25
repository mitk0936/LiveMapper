var polyLayer = Backbone.Collection.extend({
	initialize: function(){
		this.on("add", function(item){
			mapper.getCurrentMap().selectCurrent(item , true);
		})
	}
});
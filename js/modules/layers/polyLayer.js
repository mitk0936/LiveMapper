this.Mapper = this.Mapper || {};

Mapper.polyLayer = Backbone.Collection.extend({
	initialize: function(){
		this.on("add", function selectAsCurrentItem(item) {
			Mapper.mapController.getCurrentMap().selectCurrent(item, true);
		});
	}
});
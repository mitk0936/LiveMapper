this.Mapper = this.Mapper || {};

Mapper.pointsCollection = Backbone.Collection.extend({
	initialize: function(){
		this.pointsViewLayer = new google.maps.MVCObject();
		this.initHandlers();
	},
	initHandlers: function () {

	},
	showAll: function () {
		this.pointsViewLayer.set('points', Mapper.mapController.mapCanvas);
	},
	hideAll: function () {
		this.pointsViewLayer.set('points', null);
	}
});
var pointsCollection = Backbone.Collection.extend({
	initialize: function(){
		this.pointsViewLayer = new google.maps.MVCObject();
		this.initHandlers();
	},
	initHandlers: function () {

	},
	showAll: function () {
		this.pointsViewLayer.set('points', mapper.mapCanvas);
	},
	hideAll: function () {
		this.pointsViewLayer.set('points', null);
	}
});
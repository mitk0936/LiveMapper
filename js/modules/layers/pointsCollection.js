'use strict';
this.Mapper = this.Mapper || {};

Mapper.pointsCollection = Backbone.Collection.extend({
	initialize: function() {
		// used to hide/show, the whole points layer at once
		this.pointsViewLayer = new google.maps.MVCObject();
		this.initHandlers();
	},
	initHandlers: function () {
		var self = this;
		this.on('add', function (point) {
			point.set("_parentCollection", self);
		})
	},
	bindMarker: function (marker) {
		marker.bindTo('map', this.pointsViewLayer, 'points');
	},
	unbindMarker: function (marker) {
		marker.unbind('map');
	},
	showAll: function () {
		Mapper.mapController.bindToMap('points', this.pointsViewLayer);
	},
	hideAll: function () {
		this.pointsViewLayer.set('points', null);
	},
	destroy: function () {
		var model;

		while (model = this.first()) {
			model.destroy();
		}
	},
	toJSON: function () {
		var result = [];

		_.each(this.models, function (pointModel, key) {
			result[key] = pointModel.toJSON();
		});
		
		return result;
	}
});
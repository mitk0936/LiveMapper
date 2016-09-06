'use strict';
this.Mapper = this.Mapper || {};

Mapper.pointsCollection = Mapper.baseCollection.extend({
	initialize: function (models, args) {
	
		if ( !args || !(args.map instanceof Mapper.Map) ) {
			throw "Point layers must receive a reference to the parent map";
		}

		this.map = args.map;

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
		this.map.get('mapView').bindToMap('points', this.pointsViewLayer);
	},
	hideAll: function () {
		this.pointsViewLayer.set('points', null);
	},
	toJSON: function () {
		var result = [];

		_.each(this.models, function (pointModel, key) {
			result[key] = pointModel.toJSON();
		});
		
		return result;
	}
});
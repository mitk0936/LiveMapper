'use strict';
this.Mapper = this.Mapper || {};

Mapper.poly = Mapper.baseMapObject.extend({
	defaults:{
		pointsCollectionJSON: [],
		pointsCollection: null,
		type: Utils.CONFIG.polyType['polyline'],

		// styles/interaction properties
		isSelected: false,
		fillColor: Utils.configStyles.mapColors['black-20'],
		label: "",
		stylePanelConfiguration: {
			'fillColor': {
				controlType: 'colorControl',
				getter: 'getFillColor',
				setter: 'setFillColor'
			},
			'label': {
				controlType: 'labelControl',
				getter: 'getLabel',
				setter: 'setLabel'
			}
		}
	},
	initialize: function() {
		Mapper.poly.__super__.initialize.apply(this);
		
		this.set("pointsCollection", new Mapper.pointsCollection (null, {
			map: this.get('map')
		}));

		this.createView();
		this.initiallyCreatePointsCollection();
		this.initHandlers();
	},
	initHandlers: function () {
		var self = this;

		this.on('refresh', function () {
			self.refreshPointsCollection();
		});

		this.get("pointsCollection").on("add remove", function() {
			self.setStartEndPoints();
		});

		this.get("pointsCollection").on("pointDelete", function(ev) {
			self.pointDelete(ev);
		});

		this.get("pointsCollection").on("pointDragStart", function(ev) {
			self.pointDragStart();
		});
		
		this.get("pointsCollection").on("pointDragStop", function(ev) {
			self.pointDragStop(ev);
		});
	},
	createView: function() {
		new Mapper.polyView({
			model: this
		});
	},
	initiallyCreatePointsCollection: function () {

		var pointsCollectionJSON = this.get('pointsCollectionJSON'),
			pointsArr = [];

		for (var i = 0; i < pointsCollectionJSON.length; i++ ) {
			pointsArr.push(new Mapper.point(Object.assign({}, pointsCollectionJSON[i], {
				map: this.get("map")
			})));
		}

		this.get("pointsCollection").add(pointsArr);
		this.setStartEndPoints();
	},
	refreshPointsCollection: function () {
		// called on refresh after some actions executed
		var models = this.get('pointsCollection').models,
			pointsCollectionJSON = this.get('pointsCollectionJSON'),
			modelsIndexesToDestroy = [];

		if ( pointsCollectionJSON.length < models.length ) {
			// destroy last points if points array decreased
			var lastNModels = this.get('pointsCollection').last(models.length - pointsCollectionJSON.length);

			for ( var i = 0; i < lastNModels.length; i++ ) {
				lastNModels[i].destroy();
			}
		}

		// refresh all points
		for (var i = 0; i < models.length; i++) {
			if ( JSON.stringify(pointsCollectionJSON[i]) != JSON.stringify(models[i].toJSON()) ) {
				this.get('pointsCollection').models[i].set(pointsCollectionJSON[i]);
				this.get('pointsCollection').models[i].trigger('refresh');
			}
		}

		// add some points to the array, if the new collection is bigger
		var newPointsToAdd = [];

		for (var j = this.get('pointsCollection').length; j < pointsCollectionJSON.length; j++) {
			newPointsToAdd.push(new Mapper.point(Object.assign({}, pointsCollectionJSON[j], {
				map: this.get("map")
			})));
		}

		newPointsToAdd.length && this.get("pointsCollection").add(newPointsToAdd);

		this.setStartEndPoints();
	},
	addPoint: function(point, index) {
		var jsonStateBefore;

		index = parseInt(index);

		if ( !isNaN(index) ) {
			var pos = {
				at: index
			}
		}

		if ( !point.get('isHelper') ) {
			jsonStateBefore = this.toJSON();
		}
		
		this.get('pointsCollection').add(point, pos);

		if ( !point.get('isHelper') ) {
			// add action for newly added point, only if it is not a helper point		
			Mapper.actions.addAction(new Mapper.changeItemStateAction({
				'target': this,
				'jsonStateBefore': jsonStateBefore,
				'jsonStateAfter': this.toJSON(),
				'refreshPosition': true
			}));
		}
	},
	setStartEndPoints: function() {
		var pointsCollection = this.get("pointsCollection");

		if (pointsCollection.length) {
			for ( var i = 0; i < pointsCollection.models.length; i++ ) {
				// set as first point, only the first one
				if ( i == 0 ) {
					pointsCollection.models[i].set("isStartPoint", true);
					continue;
				}

				// set as last point, only the last one
				if ( i == pointsCollection.models.length - 1 ) {
					pointsCollection.models[i].set("isEndPoint", true);
					break;
				}

				pointsCollection.models[i].set("isStartPoint", false);
				pointsCollection.models[i].set("isEndPoint", false);
			}
		}
	},
	select: function () {
		this.get("map").selectItem(this);
	},
	pointDragStart: function () {
		this.set('polyJSONBefore', this.toJSON());
	},
	pointDragStop: function (ev) {
		if ( ev.changed && !(ev.model.get('isHelper')) ) {
			ev.model.trigger('refresh');
			this.insertHelperPoints(ev.model);
		}

		Mapper.actions.addAction(new Mapper.changeItemStateAction({
			'target': this,
			'jsonStateBefore': this.get('polyJSONBefore'),
			'jsonStateAfter': this.toJSON(),
			'refreshPosition': true
		}));
	},
	pointDelete: function (ev) {
		this.set('polyJSONBefore', this.toJSON());
		
		ev.model.destroy();

		Mapper.actions.addAction(new Mapper.changeItemStateAction({
			'target': this,
			'jsonStateBefore': this.get('polyJSONBefore'),
			'jsonStateAfter': this.toJSON(),
			'refreshPosition': true
		}));
	},
	insertHelperPoints: function(pointModel) {
		var collection = this.get("pointsCollection"),
			index = collection.indexOf(pointModel);

		var isFirst = (index === 0),
			isLast = (index === collection.length - 1);

		if (!isFirst) {
			// insert before if the moved point wasnt the first one
			var prev = collection.at(index - 1);
			var position = Utils.calcMiddlePoint(prev.get("latLng").lat(), prev.get("latLng").lng(), pointModel.get("latLng").lat(), pointModel.get("latLng").lng());
			
			this.createHelperPoint(position, index);

			index++;
		}

		if (!isLast) {
			// insert after if the moved point wasnt the last one
			index++;
			var next = collection.at(index);
			var position = Utils.calcMiddlePoint(pointModel.get("latLng").lat(), pointModel.get("latLng").lng(), next.get("latLng").lat(), next.get("latLng").lng());

			this.createHelperPoint(position, index);
		}
	},
	createHelperPoint: function (position, index) {
		var self = this;
		this.addPoint(new Mapper.point({
			lat: position["lat"],
			lng: position["lng"],
			isHelper: true,
			map: self.get("map")
		}), index);
	},
	getFillColor: function () {
		return {
			'colorHex': this.get('fillColor')
		}
	},
	setFillColor: function (controlData) {
		var jsonStateBefore = this.toJSON();
		
		this.set('fillColor', controlData.colorHex);

		Mapper.actions.addAction(new Mapper.changeItemStateAction({
			'target': this,
			'jsonStateBefore': jsonStateBefore,
			'jsonStateAfter': this.toJSON(),
			'refreshPosition': false
		}));
	},
	delete: function () {
		Mapper.actions.addAction(new Mapper.deleteItemAction({
			'target': this,
			'parentCollection': this.get('_parentCollection')
		}));
	},
	toJSON: function() {
		return {
			type: this.get('type'),
			pointsCollectionJSON: this.get('pointsCollection').toJSON(),
			fillColor: this.get('fillColor'),
			label: this.get('label')
		}	
	}
});
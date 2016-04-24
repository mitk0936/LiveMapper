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
		this.set("pointsCollection", new Mapper.pointsCollection());
		
		this.createView();

		this.initiallyCreatePointsCollection();

		this.on('refresh', this.refreshPointsCollection);
	},
	createView: function() {
		new Mapper.polyView({
			model: this
		});
	},
	initiallyCreatePointsCollection: function () {

		var pointsCollectionJSON = this.get('pointsCollectionJSON');

		var pointsArr = [];

		for (var i = 0; i < pointsCollectionJSON.length; i++ ) {
			pointsArr.push(new Mapper.point(pointsCollectionJSON[i]));
		}

		this.get("pointsCollection").add(pointsArr);
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
			this.get('pointsCollection').models[i].set(pointsCollectionJSON[i]);
			this.get('pointsCollection').models[i].trigger('refresh');
		}

		// add some points to the array, if the new collection is bigger
		var newPointsToAdd = [];

		for (var j = this.get('pointsCollection').length; j < pointsCollectionJSON.length; j++) {
			newPointsToAdd.push(new Mapper.point(pointsCollectionJSON[j]));
		}

		newPointsToAdd.length && this.get("pointsCollection").add(newPointsToAdd);

		this.setStartEndPoints();
	},
	addPoint: function(point, index) {
		index = parseInt(index);

		if ( !isNaN(index) ) {
			var pos = {
				at: index
			}
		}

		var jsonStateBefore = this.toJSON();

		this.get('pointsCollection').add(point, pos);

		if (!point.get('isHelper')) {
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
		if (this.get("pointsCollection").length) {
			this.get("pointsCollection").first().set("isStartPoint", true);

			if (this.get("pointsCollection").length > 1) {
				// there is an end point
				var markedAsLastPoint = this.get("pointsCollection").where({"isEndPoint": true});

				$.each(markedAsLastPoint, function() {
					// unset previous last point
					this.set("isEndPoint", false);
				});
				
				// set the last added point, to be an end point
				this.get("pointsCollection").last().set("isEndPoint", true);
			}
		}
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
	toJSON: function() {
		return {
			type: this.get('type'),
			pointsCollectionJSON: this.get('pointsCollection').toJSON(),
			fillColor: this.get('fillColor'),
			label: this.get('label')
		}	
	}
});
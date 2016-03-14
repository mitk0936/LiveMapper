var poly = Backbone.Model.extend({
	defaults:{
		pointsCollection: null,
		type: "polyline",

		// styles/interaction properties
		isSelected: false,
		fillColor: configStyles.mapColors['black-20'],
		stylePanelConfiguration: {
			'fillColor': {
				controlType: 'colorControl',
				getter: 'getFillColor',
				setter: 'setFillColor'
			}
		}
	},
	initialize: function() {
		var self = this;
		
		this.set("pointsCollection", new pointsCollection());
		this.createView();
	},
	createView: function() {
		new polyView({
			model: this
		});
	},
	addPoint: function(point, index) {
		if (!isNaN(parseInt(index))) {
			var at = {
				at: parseInt(index)
			}
		}
		
		// used to hide/show the whole points layer at once
		var pointsCollection = this.get('pointsCollection');
		
		point.set("_parentCollection", pointsCollection);
		pointsCollection.add(point, at);
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
		this.set('fillColor', controlData.colorHex);
	},
	getContent: function() {
		var poly = {};

		poly.type = this.type,
		poly.points = new Array();

		$.each(this.get("pointsCollection").models, function() {
			var p = {
				"lat" : this.get("lat"),
				"lng" : this.get("lng")
			};

			poly.points.push(p);
		});

		return poly;
	},
	toJSON: function() {
		
	}
});
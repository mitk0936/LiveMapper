'use strict';
this.Mapper = this.Mapper || {};

Mapper.polygon = Mapper.poly.extend({
	defaults: {
		pointsCollectionJSON: [],
		pointsCollection: null,
		type: Utils.CONFIG.polyType['polygon'],

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
	createView: function(){
		new Mapper.polygonView({
			model: this
		});
	}
});

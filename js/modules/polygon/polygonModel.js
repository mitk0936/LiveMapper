var polygon = poly.extend({
	defaults: {
		pointsCollection: null,
		type: "polygon",

		isSelected: false,
		fillColor: configStyles.mapColors['black-20'],
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
		new polygonView({
			model: this
		});
	}
});
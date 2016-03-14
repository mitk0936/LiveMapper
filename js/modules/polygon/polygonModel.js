var polygon = poly.extend({
	defaults: {
		pointsCollection: null,
		type: "polygon",

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
	createView: function(){
		new polygonView({
			model: this
		});
	}
});
var polygon = poly.extend({
	defaults: {
		pointsCollection: null,
		type: "polygon",

		isSelected: false,
		fillColor: "#333",
		selectedFillColor: "#ff4444"
	},
	createView: function(){
		new polygonView({
			model: this
		});
	}
});
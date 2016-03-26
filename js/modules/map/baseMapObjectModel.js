var baseMapObject = Backbone.Model.extend({
	getLabel: function () {
		return {
			'label': this.get('label')
		}
	},
	setLabel: function (controlData) {
		this.set('label', controlData.label);
	}
});
var stylePanel = panel.extend({
	defaults: {
		id: 'style-panel',
		templateName: 'panel.html',
		position: 'left',
		display: 'reveal',
		title: 'Edit Selection'
	},
	initialize: function () {
		stylePanel.__super__.initialize.apply(this);
	},
	createView: function () {
		new stylePanelView({
			model: this
		});
	}
});
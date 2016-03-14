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
	open: function (targetItem) {
		
		if (!targetItem) {
			throw "No selected item";
		}

		this.set('targetItem', targetItem);
		stylePanel.__super__.open.apply(this);
	},
	close: function () {
		this.set('targetItem', null);
		stylePanel.__super__.close.apply(this);
	},
	createView: function () {
		new stylePanelView({
			model: this
		});
	}
});
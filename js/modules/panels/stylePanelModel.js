this.Mapper = this.Mapper || {};

Mapper.stylePanel = Mapper.panel.extend({
	defaults: {
		id: 'style-panel',
		templateName: 'panel.html',
		position: 'left',
		display: 'reveal',
		title: 'Edit Selection'
	},
	initialize: function () {
		Mapper.stylePanel.__super__.initialize.apply(this);
	},
	open: function (targetItem) {
		
		if (!targetItem) {
			throw "No selected item";
		}

		this.set('targetItem', targetItem);
		Mapper.stylePanel.__super__.open.apply(this);
	},
	close: function () {
		this.set('targetItem', null);
		Mapper.stylePanel.__super__.close.apply(this);
	},
	createView: function () {
		new Mapper.stylePanelView({
			model: this
		});
	}
});
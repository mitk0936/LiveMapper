var panel = Backbone.Model.extend({
	defaults: {
		id: 'default-panel',
		templateName: 'panel.html',
		position: 'right',
		display: 'push',
		title: 'Default Panel',
		state: null
	},
	initialize: function() {

		this.set('states', {
			"0": "closed",
			"1": "openned"
		})

		this.set('state', this.get('states')['0']);
		this.createView();
	},
	createView: function () {
		new panelView({
			model: this
		});
	},
	open: function() {
		this.set('state', this.get('states')['1']);
	},
	close: function() {
		this.set('state', this.get('states')['0']);
	},
	toggle: function() {
		switch(this.get('state')) {
			case this.get('states')['1']:
				this.close();
				break;
			case this.get('states')['0']:
				this.open();
				break;
		}
	}
});
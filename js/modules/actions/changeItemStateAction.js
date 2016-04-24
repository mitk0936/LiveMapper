this.Mapper = this.Mapper || {};

Mapper.changeItemStateAction = Mapper.action.extend({
	defaults: {
		requiredArgs: ['target', 'jsonStateBefore', 'jsonStateAfter', 'refreshPosition']
	},
	initialize: function (args) {
		this.args = args;
		this.validateArgs();
	},
	undo: function () {
		this.args.target.set(this.args.jsonStateBefore);
		this.triggerRefresh();
	},
	exec: function () {
		this.args.target.set(this.args.jsonStateAfter);
		this.triggerRefresh();
	},
	triggerRefresh: function () {
		if (this.args.refreshPosition) {
			// only when the action requires a change of point/poly position on the map
			this.args.target.trigger('refresh');
		}
	}
});
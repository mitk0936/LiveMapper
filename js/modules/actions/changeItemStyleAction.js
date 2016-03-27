this.Mapper = this.Mapper || {};

Mapper.changeItemStyleAction = Mapper.action.extend({
	defaults: {
		requiredArgs: ['target', 'setter', 'resultObjBefore', 'resultObjAfter']
	},
	initialize: function (args) {
		this.args = args;
		this.validateArgs();
	},
	undo: function () {
		this.args.target[this.args.setter](this.args['resultObjBefore']);
	},
	exec: function () {
		this.args.target[this.args.setter](this.args['resultObjAfter']);
	}
});
this.Mapper = this.Mapper || {};

Mapper.pointMoveAction = Mapper.action.extend({
	defaults: {
		requiredArgs: ['target', 'propName', 'valueBefore', 'valueAfter']
	},
	initialize: function (args) {
		this.args = args;
		this.validateArgs();
	},
	undo: function () {
		this.args.target.set(this.args['propName'], this.args['valueBefore']);
		this.args.target.updatePositionData(true);
	},
	exec: function () {
		this.args.target.set(this.args['propName'], this.args['valueAfter']);
		this.args.target.updatePositionData(true);
	}
});
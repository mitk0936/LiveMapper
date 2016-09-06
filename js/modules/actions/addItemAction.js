'use strict';
this.Mapper = this.Mapper || {};

Mapper.addItemAction = Mapper.action.extend({
	defaults: {
		requiredArgs: ['target', 'parentCollection']
	},
	initialize: function (args) {
		this.args = args;
		this.validateArgs();
		this._indexInParent = this.args.parentCollection.indexOf(this.args.target);
		this.exec();
	},
	undo: function () {
		this.args.parentCollection.remove(this.args.target);
		Mapper.actions.get('deletedItems').add(this.args.target);
	},
	exec: function () {
		this.args.parentCollection.add(this.args.target, {
			at: this._indexInParent
		});

		Mapper.actions.get('deletedItems').remove(this.args.target);
	}

});
'use strict';
var actions = Backbone.Model.extend({
	initialize: function () {
		var self = this;

		this.set('stackDone', new Backbone.Collection());
		this.set('stackUndone', new Backbone.Collection());

		new Mapper.actionsView({
			model: this
		});
	},
	undo: function () {
		var action = this.get('stackDone').pop();
		
		if (action) {
			action.undo();
			this.get('stackUndone').push(action);
		}	
	},
	redo: function () {
		var action = this.get('stackUndone').pop();
		
		action && action.redo();
	},
	addAction: function (action) {
		this.get('stackDone').add(action);
	},
	clearActions: function () {
		this.get('stackDone').reset();
		this.get('stackUndone').reset();
	},
	clearActionsForItem: function (item) {
		var self = this,
			deleteAction = function (actionsArr) {
				for (var i = actionsArr.models.length - 1; i >= 0; i--) {
					if (actionsArr.models[i].args.target === item) {
						actionsArr.remove(actionsArr.models[i]);
					}
				};
			};

		deleteAction(this.get('stackDone'));
		deleteAction(this.get('stackUndone'));
	}
});
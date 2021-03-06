'use strict';

var actionsModel = Backbone.Model.extend({
	initialize: function () {
		var self = this;

		this.set('deletedItems', new Mapper.deletedItemsCollection());
		this.set('stackDone', new Backbone.Collection());
		this.set('stackUndone', new Backbone.Collection());

		new Mapper.actionsView({
			model: this
		});
	},
	undo: function () {
		var action = this.get('stackDone').pop();
		
		if ( action ) {
			action.undo();
			this.get('stackUndone').push(action);
		}	
	},
	redo: function () {
		var action = this.get('stackUndone').pop();

		if ( action ) {
			action.redo();
			this.get('stackDone').push(action);
		}
	},
	addAction: function (action) {
		this.get('stackDone').add(action);
	},
	clearActions: function () {
		this.get('stackDone').reset();
		this.get('stackUndone').reset();
		this.get('deletedItems').destroy();
	}
});
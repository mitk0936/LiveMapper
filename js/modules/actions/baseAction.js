var action = Backbone.Model.extend({
	defaults: {
		receiver: null,
	},
	undo: function(){}
	redo: function(){
		this.exec();
	},
	exec: function(){}
});
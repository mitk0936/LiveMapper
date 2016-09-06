'use strict';
this.Mapper = this.Mapper || {};

Mapper.action = Backbone.Model.extend({
	initialize: function () {},
	undo: function(){},
	redo: function(){
		this.exec();
	},
	exec: function(){},
	validateArgs: function () {
		var requiredArgs = this.get('requiredArgs');

		for (var i = requiredArgs.length - 1; i >= 0; i--) {
			if ( this.args[requiredArgs[i]] === undefined ) {
				throw "Missing arguement: " + requiredArgs[i];
			}
		};
	}
});
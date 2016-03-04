var actionsController = function() {

	stackDone = null,
	stackUndone = null;

	var init = function () {
		stackDone = new Backbone.Collection();
		stackUndone = new Backbone.Collection(); // actions stack

		// new actionsView({
		// 	model: this
		// });

		clearActions();

		return this;
	};

	var undo =  function(){
		// var action = stackDone.pop();
		// action.undo();
		// stackUndone.push(action);
		console.log("undo");
	};

	var redo = function(){
		console.log("redo");
	};


	var addAction = function(action){

	};

	var clearActions = function(){
		stackDone.reset();
		stackUndone.reset();
	}

	return {
		init: init,
		undo: undo,
		redo: redo,
		addAction: addAction,
		clearActions: clearActions
	}
};
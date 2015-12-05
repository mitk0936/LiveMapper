var Actions = (function(){
	var stackDone = new Backbone.Collection(),
		stackUndone new Backbone.Collection(); // actions stack

	function init(){
		clearActions();
		return this;
	}

	function undo(){
		var action = stackDone.pop();
		action.undo();
		stackUndone.push(action);
	}

	function redo(){
		// stackDone.p
	}

	function addAction(action){

	}

	function clearActions(){
		stackDone.reset();
		stackUndone.reset();
	}

	return{
		init: init
	};
}(window));
var actionsView = Backbone.View.extend({
	initialize: function(){
		var self = this;

		$.get('templates/actions-tabs.html', function (template) {
            var html = $(template);

            debugger;

            mapper.uiController.getMainContainer().append(html); 

           	self.el = $("#actions");
			self.initHandlers();
        }, 'html');	
	},
	initHandlers: function(){
		var self = this;

		this.el.on("click", "li:not(.disabled) a", function(e){
    		var action = $(this).attr("data-val");
    		
    		mapper.getCurrentMap().clearSelection();

    		switch(action){
    			case "undo":
    				self.model.undo();
    				break;
				case "redo":
					self.model.redo();
					break;
    		}

    		e.preventDefault();
    	});

    	this.model.on("change:stackDone", function(){

		});

		this.model.on("change:stackUndone", function(){

		});
	}
});
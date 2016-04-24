this.Mapper = this.Mapper || {};

Mapper.actionsView = Backbone.View.extend({
	initialize: function(){
		var self = this;

		this.config = {
			'undo': 'undo',
			'redo': 'redo',
			'disabled' : 'disabled'
		};

		$.get('templates/actions-tabs.html', function onTemplateLoaded(template) {
            var compileTemplate = _.template(template);
			var html = $(compileTemplate(self.config));

            Mapper.uiController.getMainContainer().append(html); 

           	self.el = $("#actions");
			self.initHandlers();
        }, 'html');	
	},
	initHandlers: function(){
		var self = this;

		this.el.on("click", "li:not(.disabled) a", function(e){
    		var action = $(this).attr("data-val");

    		switch(action){
    			case self.config["undo"]:
    				self.model.undo();
    				break;
				case self.config["redo"]:
					self.model.redo();
					break;
    		}

    		e.preventDefault();
    	});

    	this.model.get('stackDone').on("add remove", function() {
    		self.updateButton(self.config['undo'], self.model.get('stackDone'));
		});

		this.model.get('stackUndone').on("add remove", function() {
			self.updateButton(self.config['redo'], self.model.get('stackUndone'));
		});
	},
	updateButton: function(buttonType, stack) {

		var button = this.el.find("li a[data-val='" + buttonType + "']").closest('li');

		if ( stack.length === 0 ) {
			button.addClass('disabled');
		} else {
			button.removeClass('disabled');
		}
	}
});
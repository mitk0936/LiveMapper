var editDeleteView = Backbone.View.extend({
	initialize: function() {
		var self = this;
        
        $.get('templates/edit-tabs.html', function (template) {
            var html = $(template);

            mapper.uiController.getMainContainer().append(html); 

            self.container = $("#edit-options");
            self.editBtn = self.container.find("a#edit-btn");
           	self.deleteBtn = self.container.find("a#delete-btn");

           	self.buttons = self.container.find("a");
			
			self.initHandlers();
			self.updateVisibility();
        }, 'html');	
	},
	initHandlers: function() {
		var self = this;

		mapper.getCurrentMap().on("change:currentSelection", function() {
			self.updateVisibility();
		});
	},
	reInitHandlers: function () {
        // re init handlers when map changes
    },
	updateVisibility: function() {
		var map = mapper.getCurrentMap();

		if (map.get("currentSelection")) {
			this.container.show();

			this.buttons.off("click").on("click", function(e) {
				
				var action = $(e.target).attr('data-action');

				switch (action) {
					case "confirm":
						mapper.getCurrentMap().clearSelection();
						// save to local storage
						break;
					case "edit":
						mapper.uiController.panels['stylePanel'].open(map.get("currentSelection"));
						break;
					case "delete":
						map.deleteItem(map.get("currentSelection"));
						break;
				}

			});
		} else {
			this.container.hide();
		}
	}
});
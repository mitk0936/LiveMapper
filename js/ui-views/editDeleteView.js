'use strict';
this.Mapper = this.Mapper || {};

Mapper.editDeleteView = Backbone.View.extend({
	initialize: function() {
		var self = this;
        
        $.get('templates/edit-tabs.html', function onTemplateLoaded(template) {
            var html = $(template);

            Mapper.uiController.getMainContainer().append(html);

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

		Mapper.mapController.getCurrentMap().on("change:currentSelection", function() {
			self.updateVisibility();
		});

		Mapper.mapController.getCurrentMap().on("destroy", function () {
			self.destroy();
		});
	},
	updateVisibility: function() {
		var map = Mapper.mapController.getCurrentMap();

		if (map.get("currentSelection")) {
			this.container.show();

			this.buttons.off("click").on("click", function(e) {
				
				var action = $(e.target).attr('data-action');

				switch (action) {
					case "confirm":
						Mapper.mapController.getCurrentMap().clearSelection();
						// save to local storage
						break;
					case "edit":
						Mapper.uiController.panels['stylePanel'].open(map.get("currentSelection"));
						break;
					case "delete":
						map.deleteItem(map.get("currentSelection"));
						break;
				}
			});
		} else {
			this.container.hide();
		}
	},
	destroy: function () {

	}
});
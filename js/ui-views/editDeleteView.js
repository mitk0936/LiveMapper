'use strict'
this.Mapper = this.Mapper || {};

Mapper.editDeleteView = Backbone.View.extend({
	initialize: function(options) {
		var self = this;

		this.stylePanel = options.stylePanel;

		$.get('templates/edit-tabs.html', function onTemplateLoaded (template) {
			var html = $(template);

			$("body").append(html);

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

		this.model.on("change:currentSelection", function() {
			self.updateVisibility();
		});

		this.model.on("destroy", function () {
			self.destroy();
		});
	},
	updateVisibility: function() {
		if ( this.model.get("currentSelection") ) {
			this.container.show();

			var self = this;
			this.buttons.off("click").on("click", function(e) {

				var action = $(e.target).attr('data-action');

				switch (action) {
					case "confirm":
						self.model.deselectCurrentItem();
						// save to local storage
						break;
					case "edit":
						self.stylePanel.open(self.model.get("currentSelection"));
						break;
					case "delete":
						self.model.deleteItem(self.model.get("currentSelection"));
						break;
				}
			});
		} else {
			this.container.hide();
		}
	},
	destroy: function () {
		this.container.remove();
	}
});

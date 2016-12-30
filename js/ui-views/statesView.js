'use strict'
this.Mapper = this.Mapper || {};

Mapper.statesView = Backbone.View.extend({
	initialize: function () {
		var self = this;

		$.get('templates/states-tabs.html', function onTemplateLoaded (template) {
			var html = $(template);

			$("#main-container").append(html);

			self.el = $("#states");
			self.initHandlers();
		}, 'html');
	},
	initHandlers: function() {
		var self = this;

		this.el.on("click", "li:not(.current)", function(e) {
			$(self.el).find(".current").removeClass("current");
			$(this).addClass("current");

			// set the current state
			self.model.set("currentState", $(this).find("a").attr("data-val"));
			self.model.deselectCurrentItem();
			e.preventDefault();
		});

		this.model.on("destroy", function () {
			self.destroy();
		})

		this.model.on("change:currentSelection", function() {
			self.setCurrent(self.model.get("currentState"));
		});
	},
	setCurrent: function(state) {
		if ($(this.el).find("[data-val='" + state + "']")) {
			$(this.el).find("[data-val='" + state + "']").closest("li").addClass("current").siblings().removeClass("current");
		}
	},
	destroy: function () {
		this.el.remove();
	}
});

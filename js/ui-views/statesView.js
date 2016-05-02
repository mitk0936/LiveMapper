this.Mapper = this.Mapper || {};

Mapper.statesView = Backbone.View.extend({
    initialize: function () {
        var self = this;

        $.get('templates/states-tabs.html', function onTemplateLoaded(template) {
            var html = $(template);

            Mapper.uiController.getMainContainer().append(html);

            self.el = $("#states");
            self.initHandlers();
        }, 'html');
    },
    initHandlers: function() {
    	var self = this,
            map = Mapper.mapController.getCurrentMap();

    	this.el.on("click", "li:not(.current)", function(e) {
    		$(self.el).find(".current").removeClass("current");
    		$(this).addClass("current");

    		// set the current state
    		Mapper.mapController.currentState = $(this).find("a").attr("data-val");
    		map.clearSelection();
    		e.preventDefault();
    	});

    	map.on("change:currentSelection", function() {
            if (map.get("currentSelection")) {
                Mapper.mapController.currentState = map.get("currentSelection").get("type");
            }
            
			self.setCurrent(Mapper.mapController.currentState);
		});
    },
    setCurrent: function(state) {
        if ($(this.el).find("[data-val='" + state + "']")) {
            $(this.el).find("[data-val='" + state + "']").closest("li").addClass("current").siblings().removeClass("current");
        }
    }
});
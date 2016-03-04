var statesView = Backbone.View.extend({
    initialize: function () {
        var self = this;

        $.get('templates/states-tabs.html', function (template) {
            var html = $(template);

            mapper.uiController.getMainContainer().append(html);

            self.el = $("#states");
            self.initHandlers();
        }, 'html');
    },
    initHandlers: function() {
    	var self = this,
            map = mapper.getCurrentMap();

    	this.el.on("click", "li:not(.current)", function(e) {
    		$(self.el).find(".current").removeClass("current");
    		$(this).addClass("current");

    		// set the current state
    		mapper.currentState = $(this).find("a").attr("data-val");
    		map.clearSelection();
    		e.preventDefault();
    	});

    	map.on("change:currentSelection", function() {
            if (map.get("currentSelection")) {
                mapper.currentState = map.get("currentSelection").get("type");
            }
            
			self.setCurrent(mapper.currentState);
		});
    },
    reInitHandlers: function () {
        // re init handlers when map changes
    },
    setCurrent: function(state) {
        if ($(this.el).find("[data-val='" + state + "']")) {
            $(this.el).find("[data-val='" + state + "']").closest("li").addClass("current").siblings().removeClass("current");
        }
    }
});
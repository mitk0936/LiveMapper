var statesView = Backbone.View.extend({
    initialize: function () {
    	this.el = $("#states");
        this.initHandlers();
    },
    initHandlers: function(){
    	var self = this;
    	this.el.on("click", "li:not(.current)", function(e){
    		$(self.el).find(".current").removeClass("current");
    		$(this).addClass("current");
    		// set the current state
    		mapper.currentState = $(this).find("a").attr("data-val");
    		self.model.clearSelection();
    		e.preventDefault();
    	});

    	this.model.on("change:currentSelection", function(){
            if(self.model.get("currentSelection")){
                mapper.currentState = self.model.get("currentSelection").get("type");
            }
            
			self.setCurrent(mapper.currentState);
		});
    },
    setCurrent: function(state){
        if($(this.el).find("[data-val='" + state + "']")){
            $(this.el).find("[data-val='" + state + "']").closest("li").addClass("current").siblings().removeClass("current");
        }
    }
});
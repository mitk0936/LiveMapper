var panelView = Backbone.View.extend({
	initialize: function (options) {
		this.initHandlers();
	},
	initHandlers: function () {
		var self = this;

		this.model.on('change:state', function(ev) {
			switch(ev.changed.state) {
				case self.model.get('states')['1']: 
					self.open();
					break;
				case self.model.get('states')['0']:
					self.close();
					break;
			}
		});
	},
	render: function(onRender) {
		var self = this;

		$.get('templates/panels/' + this.model.get('templateName'), function (template) {
        	var html = $(template);

        	var compiledTemplate = _.template(template),
				html = compiledTemplate(self.model.defaults);

            mapper.uiController.getPageContainer().append($(html));
            self.domEl = $("#" + self.model.get('id')).panel({
            	close: function( event, ui ) {
            		self.model.set('state', self.model.get('states')['0']);
            		self.domEl = self.domEl.detach();
            	}
            });

            onRender();
        }, 'html');
	},
	open: function() {
		var self = this;

		if( !self.domEl ) {
			this.render(function () {
				self.domEl.panel("open");
			});
		} else {
			mapper.uiController.getPageContainer().append(self.domEl);
			self.domEl.panel("open");
		}
	},
	close: function() {
		this.domEl && this.domEl.panel('close');
	}
});

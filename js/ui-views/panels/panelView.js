'use strict'
this.Mapper = this.Mapper || {};

Mapper.panelView = Backbone.View.extend({
	initialize: function (options) {
		this.initHandlers();
	},
	initHandlers: function () {
		var self = this;

		this.model.on('change:state', function (ev) {
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

		$.get('templates/panels/' + this.model.get('templateName'), function onLoadedPanelTemplate(template) {
        	var html = $(template);

        	var compiledTemplate = _.template(template),
				html = compiledTemplate(self.model.defaults);

            $("#page-container").append($(html));
            self.domEl = $("#" + self.model.get('id')).panel({
            	close: function( event, ui ) {
            		self.model.set('state', self.model.get('states')['0']);
            		self.removePanelContent();
            		self.domEl = self.domEl.detach();
            	}
            });

            onRender();
        }, 'html');
	},
	open: function() {
		var self = this;

		if (!self.domEl) {
			this.render( function () {
				self.renderPanelContent();
				self.domEl.panel("open");
			});
		} else {
			$("#page-container").append(self.domEl);
			self.renderPanelContent();
			self.domEl.panel("open");
		}
	},
	renderPanelContent: function () { },
	removePanelContent: function () { },
	close: function() {
		this.domEl && this.domEl.panel('close');
	}
});

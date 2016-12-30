'use strict'
this.Mapper = this.Mapper || {};

Mapper.controlView = Backbone.View.extend({
	initialize: function () {
		this.options = _.extend({
			wrapperTemplateName: "control-wrapper.html"
		}, this.defaults, this.options);

		this.validateOptionsObject();
		this.afterInit();
	},
	afterInit: function () {
		this.loadTemplate(function () { }); // preload template
	},
	appendTo: function (containerDomEl) {
		var self = this;

		this.loadTemplate( function render() {
			containerDomEl.append($(self.wrapper)); // wrap in control wrapper
			self.domEl = $("#" + self.options.id);
			self.domEl.find('.control-content').append($(self.template));

			self.initHandlers();
		});
	},
	initHandlers: function () {},
	loadTemplate: function (onLoadedTemplate) {
		if (!this.template) {
			var self = this;

			$.get('templates/controls/control-wrapper.html', function onTemplateLoaded (template) {
				var compileTemplate = _.template(template);
				self.wrapper = compileTemplate(self.options);

				$.get('templates/controls/' + self.options.templateName, function (template) {
					compileTemplate = _.template(template);
					self.template = compileTemplate(self.options);

					onLoadedTemplate();
				}, 'html');
			}, 'html');

		} else {
			onLoadedTemplate(); // template already loaded
		}
	},
	setObject: function (object, getter, setter) { },
	validateOptionsObject: function () {
		var requiredProperties = ['id', 'templateName', 'title'],
			self = this;

		requiredProperties.map(function (option) {
			if (!self.options[option]) {
				throw 'Bad configured control. Please set: ' + option + '.';
			}
		})
	},
	detach: function () {
		this.domEl.remove();
	}
});

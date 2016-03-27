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
		// preload template
		this.loadTemplate(function (){});
	},
	appendTo: function (containerDomEl) {
		var self = this;

		this.loadTemplate(function render() {
			// wrap in control wrapper
			containerDomEl.append($(self.wrapper));
			self.domEl = $("#" + self.options.id);
			self.domEl.find('.control-content').append($(self.template));

			self.initHandlers();
		});
	},
	initHandlers: function () {},
	loadTemplate: function (onLoadedTemplate) {

		if( !this.template ) {
			var self = this;

			Mapper.uiController.loadControlWrapper(function onWrapperLoaded(wrapperTemplate) {

				var compileTemplate = _.template(wrapperTemplate);

				self.wrapper = compileTemplate(self.options);

				$.get('templates/controls/' + self.options.templateName, function (template) {
		        	compileTemplate = _.template(template);
					self.template = compileTemplate(self.options);

		        	onLoadedTemplate();
		        }, 'html');
			});
		} else {
			// template already loaded
			onLoadedTemplate();
		}
	},
	setObject: function (object, getter, setter) {

	},
	validateOptionsObject: function () {
		var requiredProperties = ['id', 'templateName', 'title'];

		for (var i = 0; i < requiredProperties.length; i++ ) {
			var option = requiredProperties[i];

			if ( !this.options[option]) {
				throw 'Bad configured control. Please set: ' + option + '.';
			}
		}
	},
	detach: function () {
		this.domEl.remove();
	}
});
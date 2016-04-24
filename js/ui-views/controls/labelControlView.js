this.Mapper = this.Mapper || {};

Mapper.labelControl = Mapper.controlView.extend({
	defaults: {
		id: "label-control",
		templateName: "label-control.html",
		title: "Label control"
	},
	afterInit: function () {
		Mapper.labelControl.__super__.afterInit.apply(this);

		this.resultObj = {
			'label': ""
		};
	},
	initHandlers: function () {
		var self = this;

		this.resultObj = this.target[this.getter]();

		var inputText = this.domEl.find('input').val(this.resultObj.label);

		this.domEl.find('.control-content').on('openned', function onControlOpenned() {
			inputText.focus();
		});
		
		inputText.on('change', function onInputText(e) {
			self.resultObj.label = $(this).val();
			self.updateLabel();
		});
	},
	updateLabel: function () {
		this.target[this.setter](this.resultObj);
	}
});
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

		var resultObjBefore = _.clone(self.resultObj);
		
		inputText.on('change', function onInputText(e) {
			self.resultObj.label = $(this).val();
			self.updateLabel();

			var resultObjAfter = _.clone(self.resultObj);

			Mapper.actions.addAction(new Mapper.changeItemStyleAction({
				'target': self.target,
				'setter': self.setter,
				'resultObjBefore': resultObjBefore,
				'resultObjAfter': resultObjAfter
			}));

			resultObjBefore = _.clone(self.resultObj);
		});
	},
	updateLabel: function () {
		this.target[this.setter](this.resultObj);
	}
});
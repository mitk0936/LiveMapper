'use strict';
this.Mapper = this.Mapper || {};

Mapper.colorControl = Mapper.controlView.extend({
	defaults: {
		id: "color-control",
		templateName: "color-control.html",
		title: "Color control",
		colors: Utils.configStyles.mapColors
	},
	afterInit: function () {
		Mapper.colorControl.__super__.afterInit.apply(this);

		this.resultObj = {
			'colorHex': null
		};
	},
	initHandlers: function () {
		var self = this;

		this.resultObj = this.target[this.getter]();

		// select the current target color
		this.domEl.find(".color-item[data-color=" + this.resultObj.colorHex + "]").addClass('selected');

		this.domEl.on('click', '.color-item:not(.selected)', function (e) {
			$(this).addClass('selected');
			$(this).siblings().removeClass('selected');

			var selectedColorHex = $(this).attr('data-color');
			self.resultObj.colorHex = selectedColorHex;
			self.updateColor();

			e.preventDefault();
		});
	},
	updateColor: function () {
		this.target[this.setter](this.resultObj);
	}
});
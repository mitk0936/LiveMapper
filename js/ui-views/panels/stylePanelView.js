'use strict'
this.Mapper = this.Mapper || {};

Mapper.stylePanelView = Mapper.panelView.extend({
	initialize: function () {
		Mapper.stylePanelView.__super__.initialize.apply(this);
		this.renderedControls = {};
	},
	renderPanelContent: function () {
		var targetItem = this.model.get('targetItem');
		var stylePanelConfiguration = targetItem.get('stylePanelConfiguration');

		this.controlsContainer = this.domEl.find('.container');

		for (var key in stylePanelConfiguration) {
			var controlType = stylePanelConfiguration[key].controlType;
			this.renderedControls[controlType] = Mapper.uiController.controls[controlType];

			this.renderedControls[controlType].target = targetItem;
			this.renderedControls[controlType].getter = stylePanelConfiguration[key]['getter'],
			this.renderedControls[controlType].setter = stylePanelConfiguration[key]['setter'];

			this.renderedControls[controlType].appendTo(this.controlsContainer);
		}
	},
	removePanelContent: function () {
		this.controlsContainer.html("");
	}
});

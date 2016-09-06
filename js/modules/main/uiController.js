'use strict';

var uiController = function () {
	var uiComponents = {
			'panels': {
				'stylePanel': null
			},
			'controls': {
				'colorControl': null,
				'labelControl': null
			}
		}

	var init = function () {

		for (var key in uiComponents) {
			createComponentsFromObjectNamesArray(uiComponents[key]);
		}

		initGlobalDomEventHandlers();

		return this;
	};

	var createComponentsFromObjectNamesArray = function (components) {
		for ( var key in components ) {
			components[key] = new Mapper[key]();
		}
	};

	var initGlobalDomEventHandlers = function () {

		var self = this;

		// controlls open/close
		$("body").on('click', '.control-head', function onClickControlHead() {
			var controlContent = $(this).parent().find('.control-content');
			controlContent.toggle();

			var isVisible = controlContent.is(":visible");
			isVisible && controlContent.trigger('openned');
		});

		// close panels on window orientationchange
		$(window).on('orientationchange', function onWindowResize() {
			$.each(uiComponents['panels'], function forEachPanel(name, panel) {
				panel && panel.close();
			});
		});
	};

	return {
		init: init,
		panels: uiComponents['panels'],
		controls: uiComponents['controls']
	}
};
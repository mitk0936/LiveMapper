var uiController = function () {
	var mainContainer,
		pageContainer,
		controlWrapper,
		uiComponents = {
			'panels': {
				'stylePanel': null
			},
			'controls': {
				'colorControl': null,
				'labelControl': null
			},
			'views': {
				'editDeleteView': null,
				'statesView': null
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
			components[key] = new window[key]();
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


		// close panels on window resize/orientationchange
		$(window).on('resize orientationchange', function () {
			$.each(uiComponents['panels'], function (name, panel) {
				panel && panel.close();
			});
		});
	};

	var loadControlWrapper = function (onLoaded) {
		if (!controlWrapper) {

			$.get('templates/controls/control-wrapper.html', function (template) {
	        	controlWrapper = template;
	        	onLoaded(controlWrapper);
	        }, 'html');

		} else {
			onLoaded(controlWrapper);
		}
	};

	var togglePanel = function(panelName) {
		uiComponents['panels'][panelName] && uiComponents['panels'][panelName].toggle();
	};

	return {
		init: init,
		togglePanel: togglePanel,
		panels: uiComponents['panels'],
		controls: uiComponents['controls'],
		loadControlWrapper: loadControlWrapper,
		getMainContainer: function() {
			mainContainer = mainContainer || $("#main-container")
			return mainContainer;
		},
		getPageContainer: function() {
			pageContainer = pageContainer || $("#page-container")
			return pageContainer;
		},
	}
};
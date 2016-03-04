var uiController = function () {
	var mainContainer,
		pageContainer,
		panels = {
			'stylePanel': null
		};

	var init = function () {
		createPanels();

		new editDeleteView();
		new statesView();

		return this;
	}

	var createPanels = function() {
		panels['stylePanel'] = new stylePanel();
	}

	var togglePanel = function(panelName) {
		panels[panelName] && panels[panelName].toggle();
	}

	return {
		init: init,
		togglePanel: togglePanel,
		panels: panels,
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
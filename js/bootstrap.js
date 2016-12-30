'use strict'
this.Mapper = this.Mapper || {};

(function () {
	var devicereadyFired = false;

	if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
		document.addEventListener("deviceready", onDeviceReady, false);

		setTimeout(function () {
			// device ready for running app in mobile browser
			!devicereadyFired && $(document).ready(onDeviceReady);
		}, 5000);

	} else {
		$(document).ready(onDeviceReady);
	}

	function onDeviceReady() {
		devicereadyFired = true;

		Mapper.actions = new actionsModel();
		Mapper.mapController = new mapController();
		Mapper.uiController = new uiController();

		Mapper.mapController.init();
	};

})();

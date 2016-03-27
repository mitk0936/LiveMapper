this.Mapper = this.Mapper || {};

(function () {
	"use strict";

    if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
        document.addEventListener("deviceready", onDeviceReady, false);
    } else {
        $(document).ready(onDeviceReady);
    }

    function onDeviceReady() {

        Mapper.actions = new actions();
        Mapper.mapController = new mapController();
        Mapper.uiController = new uiController();

        Mapper.mapController.init();
    };
})();
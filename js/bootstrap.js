(function () {
	"use strict";

    if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
        document.addEventListener("deviceready", onDeviceReady, false);
    } else {
        $(document).ready(onDeviceReady);
    }

    function onDeviceReady() {
        mapper = new mapper();
        mapper.init();
    };
})();
'use strict';
this.Utils = this.Utils || {};

Utils.calcMiddlePoint = function(lat1, lon1, lat2, lon2) {
 	return {
 		"lat": (lat1 + lat2)/2,
 		"lng": (lon1 + lon2)/2
 	};
}

Utils.loadScript = function (src, callback) {
	var script = document.createElement('script');
	script.type = 'text/javascript';
	//the url of the needed jquery
	script.src = src;
	script.onload = script.onreadystatechange = function() { 
		var rs = this.readyState; 
		if (rs) {
			if ((rs != 'complete') && (rs != 'loaded')) {
				throw 'Some error with loading: ' + src;
				return;
			}
		}

		callback();
	}
	//append the script into the document head
	document.getElementsByTagName('head')[0].appendChild(script);
}

Utils.originalSetTimeout = window.setTimeout;

Utils.fakeTimeout = function (cb, timer) {
	cb();
};
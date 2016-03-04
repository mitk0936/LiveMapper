function calcMiddlePoint(lat1, lon1, lat2, lon2){
 	return {
 		"lat": (lat1 + lat2)/2,
 		"lng": (lon1 + lon2)/2
 	};
}

function loadScript(src, callback){
	var script = document.createElement('script');
	script.type = 'text/javascript';
	//the url of the needed jquery
	script.src = src;
	script.onload = script.onreadystatechange = function() { 
	  var rs = this.readyState; 
	  if (rs) {
	    if ((rs != 'complete') && (rs != 'loaded')) {
	    	alert("error here");
	      return;
	    }


	  }

	  callback();
	}
	//append the script into the document head
	document.getElementsByTagName('head')[0].appendChild(script);
}
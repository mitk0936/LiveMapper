function calcMiddlePoint(lat1, lon1, lat2, lon2){
 	return {
 		"lat": (lat1 + lat2)/2,
 		"lon": (lon1 + lon2)/2
 	};
}
var stubSimulateDragging = function (point) {
	var latLng;

	// simulate dragging, by changing the latLng
	for ( var i = 0; i < 1; i += 0.01 ) {
		latLng = new google.maps.LatLng(parseFloat(point.get("lat")) + i, parseFloat(point.get("lng")) + i);
		point.set('latLng', latLng);
	}

	return latLng;
};

var stubCreatePointsCollection = function (pointsCount) {
	var pointsCollectionJSON = [],
		point,
		pointsCollection = new Mapper.pointsCollection();

	for ( var i = 0; i < pointsCount; i++ ) {
		point = stubCreatePoint();

		pointsCollection.add(point);
	}

	return pointsCollection;
};

var stubCreatePoint = function () {
	var p = new Mapper.point({
				lat: 42.5555555 + ( 3 - Math.random() * 3 ),
				lng: 23.34343434 + ( 3 - Math.random() * 3 ),
				single: false
			});
	return p;
};
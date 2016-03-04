var mapper = function() {
	var currentMap,
		actionsCtrl = new actionsController(),
		uiCtrl = new uiController(),
		currentState =  "point",
		mapDomId = "map",
		defaultZoom = 14,
		mainContainer = null,
		mapCanvas;

	function init() {
		
		currentMap = new Map();
		actionsCtrl.init();
		uiCtrl.init();

		return this;
	}

	function initLayers() {
		var mapBounds = new google.maps.LatLngBounds(

		    new google.maps.LatLng(42.70058493, 23.25934443),
		    new google.maps.LatLng(42.71415885, 23.28596245));
		var mapMinZoom = 13;
		var mapMaxZoom = 19;
		var maptiler = new google.maps.ImageMapType({
		    getTileUrl: function(coord, zoom) { 
		        var proj = mapper.mapCanvas.getProjection();
		        var z2 = Math.pow(2, zoom);
		        var tileXSize = 256 / z2;
		        var tileYSize = 256 / z2;
		        var tileBounds = new google.maps.LatLngBounds(
		            proj.fromPointToLatLng(new google.maps.Point(coord.x * tileXSize, (coord.y + 1) * tileYSize)),
		            proj.fromPointToLatLng(new google.maps.Point((coord.x + 1) * tileXSize, coord.y * tileYSize))
		        );
		        var y = coord.y;
		        var x = coord.x >= 0 ? coord.x : z2 + coord.x
		        if (mapBounds.intersects(tileBounds) && (mapMinZoom <= zoom) && (zoom <= mapMaxZoom))
		            return "http://dmwebs.org/maps/zapaden_park/" + zoom + "/" + x + "/" + y + ".png";
		        else
		            return "http://www.maptiler.org/img/none.png";
		    },
		    tileSize: new google.maps.Size(256, 256),
		    isPng: true,

		    opacity: 1.0
		});
		

		var opts = {
	        streetViewControl: false,
	        center: new google.maps.LatLng(42.651377, 23.239742),
	        zoom: 14
	    };

		mapper.mapCanvas.setZoom(14);
		mapper.mapCanvas.setMapTypeId('satellite');
		mapper.mapCanvas.overlayMapTypes.insertAt(0, maptiler);
	}

	return {
		// public methods
		init: init,
		actionsController: actionsCtrl,
		uiController: uiCtrl,
		currentState: currentState,
		mapDomId: mapDomId,
		defaultZoom: defaultZoom,
		initLayers: initLayers,
		mapCanvas: mapCanvas,
		getCurrentMap: function() {
			return currentMap;
		}
	}
};
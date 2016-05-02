'use strict';

var mapController = function() {

	var currentMap,
		currentState =  "point",
		mapDomId = "map",
		defaultZoom = 14,
		mainContainer = null,
		mapCanvas;

	function init() {
		currentMap = new Mapper.Map();
		Mapper.uiController.init();

		return this;
	}

	function selectCurrent (selection) {
		if (currentMap.get('currentSelection') !== selection) {
			currentMap.selectCurrent(selection);
		}
	}

	function appendToMap (object) {
		object.setMap(mapCanvas);
	}

	function clearMap(map) {
		Mapper.actions.clearActions();
		currentMap.clearSelection();

		map.get("pointsLayer").destroy();
		map.get("polylinesLayer").destroy();
		map.get("polygonsLayer").destroy();
	}

	function createMapFromJSON(mapData) {
		// TODO -> add validations for json
		clearMap(currentMap);

		currentMap.set({
			centerLat: mapData.centerLat,
			centerLng: mapData.centerLng
		});

		createPointsLayerFromJSON(mapData.pointsLayer);
		
		createPolyLayerFromJSON(mapData.polylinesLayer);
		createPolyLayerFromJSON(mapData.polygonsLayer);

		currentMap.clearSelection();
	}

	function createPolyLayerFromJSON (polyLayer) {
		_.each(polyLayer, function (polyData) {
			createPolyFromJSON(polyData)
		});
	}

	function createPolyFromJSON(polyData) {
		// TODO -> add validations for json
		var poly;

		switch ( polyData.type ) {
			case Utils.CONFIG.polyType['polygon']:
				poly = new Mapper.polygon(polyData);

				currentMap.get('polygonsLayer').add(poly);
				break;
			default:
				poly = new Mapper.poly(polyData);
				currentMap.get('polylinesLayer').add(poly);
				break;
		}

		return poly;
	}

	function createPointsLayerFromJSON (pointsLayer) {
		// TODO -> add validations for json
		var layer = new Mapper.pointsLayer();

		_.each(pointsLayer, function (pointData) {
			createPointFromJSON(pointData);
		});

		return layer;
	}

	function createPointFromJSON (point) {
		// TODO -> add validations for json
		var p = new Mapper.point(point);
		currentMap.get("pointsLayer").add(p);
		return p;
	}

	function createMapObjectFromJSON (objectJSON) {
		// TODO -> add validations for json
		var object = {};

		switch (objectJSON.type) {
			case Utils.CONFIG.pointType:
				object = createPointFromJSON(objectJSON);
				break;
			case Utils.CONFIG.polyType.polyline:
				object = createPolyFromJSON(objectJSON);
				break;
			case Utils.CONFIG.polyType.polygon:
				object = createPolyFromJSON(objectJSON);
				break;
			default:
				throw 'Object with unknown type';
		}

		return object;
	}

	function initLayers() {
		var mapBounds = new google.maps.LatLngBounds(
			new google.maps.LatLng(42.70058493, 23.25934443),
		    new google.maps.LatLng(42.71415885, 23.28596245));
		
		var mapMinZoom = 13;
		var mapMaxZoom = 19;
		var maptiler = new google.maps.ImageMapType({
		    getTileUrl: function(coord, zoom) { 
		        var proj = mapCanvas.getProjection();
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

		mapCanvas.setZoom(14);
		mapCanvas.setMapTypeId('satellite');
		mapCanvas.overlayMapTypes.insertAt(0, maptiler);
	}

	function setMapCanvas (map) {
		mapCanvas = map;
	}

	function getMapCanvas() {
		return mapCanvas;
	}

	function bindToMap (propName, object) {
		object.set(propName, mapCanvas);
	}

	function setMapCenter (latLng) {
		mapCanvas.panTo(latLng);
	}


	return {
		// public methods
		init: init,
		currentState: currentState,
		mapDomId: mapDomId,
		defaultZoom: defaultZoom,
		initLayers: initLayers,
		createPointsLayerFromJSON: createPointsLayerFromJSON,
		createPointFromJSON: createPointFromJSON,
		createPolyLayerFromJSON: createPolyLayerFromJSON,
		createPolyFromJSON: createPolyFromJSON,
		createMapFromJSON: createMapFromJSON,
		createMapObjectFromJSON: createMapObjectFromJSON,
		clearMap: clearMap,
		selectCurrent: selectCurrent,
		appendToMap: appendToMap,
		bindToMap: bindToMap,
		setMapCenter: setMapCenter,
		setMapCanvas: setMapCanvas,
		getMapCanvas: getMapCanvas,
		getCurrentMap: function() {
			return currentMap;
		}
	}
};
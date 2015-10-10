var mapper = (function(){
	var currentMap,
		currentState =  "point",
		mapDomId = "map",
		defaultZoom = 14;

	function init(){
		currentMap = new Map();
	}

	function loadMap(map, formatType){
		
	}

	return{
		// public methods
		init: init,
		currentState: currentState,
		mapDomId: mapDomId,
		defaultZoom: defaultZoom,
		getCurrentMap: function(){
			return currentMap;
		}
	}
}(window));
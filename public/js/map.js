var Map = function(onLoad) {
  var latitude   = 40.72;
  var longitude  = -74.0;
  var zoom_level = 10;
  mapboxgl.accessToken = 'pk.eyJ1IjoiZ3JlZW50IiwiYSI6ImNpazBqdWFsOTM5Nnh2M2x6dWZ2dnB3aHkifQ.97-pFPD8lQf02B6edag1rA';
  
  this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/dark-v9',
      center: [longitude, latitude],
      zoom: zoom_level
  });
  
  this.map.addControl(new mapboxgl.Navigation({
    'position': 'top-left'
  }));
    
  this.map.on('load', function(){
    onLoad();
  });
  this.visitedEdges = {
    type: 'FeatureCollection',
    features: []
  };
  this.leftEdges = {
    type: 'FeatureCollection',
    features: []
  };
};

Map.prototype.addStops = function(stops) {
  this.map.addSource('stops', {
    "type": "geojson",
    "data": stops
  });
  
  this.map.addLayer({
    "id": 'stops',
    "type": "symbol",
    "source": 'stops',
    "layout": {
      "icon-image": "marker-11"
    }
  });
};

Map.prototype.addEdges = function(edges) {
  this.map.addSource('edges', {
    type: 'geojson',
    data: edges
  });
  this.map.addLayer({
    id: 'edges',
    type: 'line',
    source: 'edges',
    paint: {
      'line-width': 2,
      'line-color': '#ffffff',
      'line-opacity': 0.7
    }
  });
  
  // Create source and layer for visited edges to be populated later
  this.map.addSource('visited edges', {
    type: 'geojson',
    data: this.visitedEdges,
  });
  this.map.addLayer({
    id: 'visited edges',
    type: 'line',
    source: 'visited edges',
    paint: {
      'line-width': 3,
      'line-color': '#ff0000'
    }
  });
  
  // Create source and layer for visited edges to be populated later
  this.map.addSource('left edges', {
    type: 'geojson',
    data: this.leftEdges,
  });
  this.map.addLayer({
    id: 'left edges',
    type: 'line',
    source: 'left edges',
    paint: {
      'line-width': 3,
      'line-color': '#ffffff'
    }
  });
};

Map.prototype.visitEdge = function(edge) {
  this.visitedEdges.features.push({
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: [
          [ edge[0].stop_lon, edge[0].stop_lat ],
          [ edge[1].stop_lon, edge[1].stop_lat ]
        ]
    }
  });
  this.map.getSource('visited edges').setData(this.visitedEdges);
};

Map.prototype.leaveEdge = function(edge) {
  this.leftEdges.features.push({
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: [
          [ edge[0].stop_lon, edge[0].stop_lat ],
          [ edge[1].stop_lon, edge[1].stop_lat ]
        ]
    }
  });
  this.map.getSource('left edges').setData(this.leftEdges);
};

module.exports = Map;
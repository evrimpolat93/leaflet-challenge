function createMap(earthquakesLayer) {

  // Create the tile layer that will be the background of our map
  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> 4tributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> 4tributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "satellite-v9",
    accessToken: API_KEY
  });

  // Create a baseMaps object to hold the lightmap layer
  var baseMaps = {
    "Light Map": lightmap, 
    "Dark Map": darkmap
  };

  // Create an overlayMaps object to hold the earthquakesLayer layer
  var overlayMaps = {
    "Earthquakes": earthquakesLayer
  };

  // Create the map object with options
  var map = L.map("map-id", {
    center: [40.73, -74.0059],
    zoom: 3,
    layers: [lightmap, earthquakesLayer]
  });

  // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);
}

function generateColor(depth){
  
  if (depth < 10){
    return "#00ff80";
  }
  if (depth < 25){
    return "#00ffbf";
  }
  if (depth < 40){
    return "#00ffff";
  }
  if (depth < 55){
    return "#00bfff";
  }
  if (depth < 70){
    return "#0080ff";
  }
  if (depth < 85){
    return "#0040ff";
  }
}

function createMarkers(response) {
  
  // Pull the "earthquakes" property off of response.data
  var earthquakes = response.features;

  // Initialize an array to hold markers
  var earthquakeMarkers = [];

  // Loop through the earthquakes array
  for (var index = 0; index < earthquakes.length; index++) {
    var earthquake = earthquakes[index];
    
    var lon = earthquake.geometry.coordinates[0]
    var lat = earthquake.geometry.coordinates[1]
    var depth = earthquake.geometry.coordinates[2]
    var mag = earthquake.properties.mag
    // For each earthquake, create a marker and bind a popup with the earthquake's name
    var earthquakeMarker = L.circleMarker([lat, lon], {
      radius: mag*3,
      fillColor: generateColor(depth),
      color: generateColor(depth),
      weight: 2,
      opacity: 1,
      fillOpacity: 0.4,
    })
    // .bindPopup("<h3>" + earthquake.name + "<h3><h3>Capacity: " + earthquake.capacity + "</h3>");

    // Add the marker to the earthquakeMarkers array
    earthquakeMarkers.push(earthquakeMarker);
  }

  // Create a layer group made from the markers array, pass it into the createMap function
  createMap(L.layerGroup(earthquakeMarkers));
}


d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson").then(createMarkers);

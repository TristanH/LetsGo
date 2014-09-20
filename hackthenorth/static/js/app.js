var map;

function initialize() {
  var mapOptions = {
    center: new google.maps.LatLng(0,0),
    zoom: 2
  };
  map = new google.maps.Map(document.getElementById("map-canvas"),
      mapOptions);
}

window.onload = initialize;
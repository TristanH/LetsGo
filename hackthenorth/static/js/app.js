var map;
var markers = [];
var infoLabels = [];
var fetchingBusinesses = false;
var numFetched = 0;
var businessLimit = 100;
var userLocation = new google.maps.LatLng(0,0);
var searchTerm = 'food';


function initialize() {

  var mapOptions = {
    center: new google.maps.LatLng(37.900000,-122.500000),
    zoom: 15
  };
  map = new google.maps.Map(document.getElementById("map-canvas"),
      mapOptions);

  var noPoi = [
    {
        featureType: "poi",
        stylers: [
          { visibility: "off" }
        ]   
    }
  ];
  map.setOptions({styles: noPoi});

  if(true){
    //check here for this sessions default location
    startGetBusinesses(new google.maps.LatLng(43.7, -79.4)); //use django-supplied location
  }
  else if(!!navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var userLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      var userMarker = new google.maps.Marker({
          map: map,
          position: userLocation,
          icon: new google.maps.MarkerImage('//maps.gstatic.com/mapfiles/mobile/mobileimgs2.png',
                                              new google.maps.Size(22,22),
                                              new google.maps.Point(0,18),
                                              new google.maps.Point(11,11)),
          shadow: null,
      });

      var locationInfo = new google.maps.InfoWindow({
          content: "Your Location"
      });
      google.maps.event.addListener(userMarker, 'mouseover', function() {
        locationInfo.open(map,userMarker);
      });
      google.maps.event.addListener(userMarker, 'mouseout', function() {
        locationInfo.close(map,userMarker);
      });

      startGetBusinesses(userLocation);
    });
  }
  else{
    startGetBusinesses(new google.maps.LatLng(0,0));
  }

}

function startGetBusinesses(location){
  map.setCenter(location);
  userLocation = location;
  getBusinesses(location, 0, searchTerm);
}

function getBusinesses(location, offset, term){
  fetchingBusinesses = true;

  $.get('/get_info/', 
    {
      'll': location.toUrlValue(15),
      'term': term,
      'offset': offset
    },
    function(data, status){
      addBusinessMarkers(data);
      numFetched += 20;
      if(offset < businessLimit && offset < data.total)
        getBusinesses(location, offset + 20, 'food');
      else
        fetchingBusinesses = false;
  });
}

function showMoreBusinesses(){
  if(!fetchingBusinesses && typeof userLocation != "undefined"){
    businessLimit += 100;
    getBusinesses(userLocation, numFetched, 'food');
  }
}

function setTerm(term){
  //make sure not already fetching....
  searchTerm = term;
  clearMarkers();
  getBusinesses(userLocation, 0, searchTerm);
}

function clearMarkers(){
  businessLimit = 100;
  numFetched = 0;
  while(markers.length !=0){
    markers[markers.length -1].setMap(null);
    markers.pop();
    infoLabels[infoLabels.length -1].setMap(null);
    infoLabels.pop();
  }
}

function addBusinessMarkers(data){
  var clicked = [];

  for(var i=0; i<data.businesses.length; i++){
    var location;
    if('coordinate' in data.businesses[i].location)
      location = new google.maps.LatLng(data.businesses[i].location.coordinate.latitude, data.businesses[i].location.coordinate.longitude);
    else
      continue;
    var marker = new google.maps.Marker({
        position: location,
        map: map
    });
    markers.push(marker);
    var info = new google.maps.InfoWindow({
        content: generateInfoWindowHtml(data.businesses[i])
    });
    infoLabels.push(info);
    clicked.push(false);

    bundle = {'marker': marker, 'info': info, 'index': markers.length - 1};

    google.maps.event.addListener(marker, 'mouseover', function() {
      if(!clicked[this.index]) 
        this.info.open(map, this.marker);
    }.bind(bundle));
    google.maps.event.addListener(marker, 'mouseout', function() {
      if(!clicked[this.index])
        this.info.close(map, this.marker);
    }.bind(bundle));
    
    google.maps.event.addListener(marker, 'click', function() {
      if(!clicked[this.index])
        this.info.open(map, this.marker);
      else
        this.info.close(map, this.marker);

      clicked[this.index] = !clicked[this.index];
    }.bind(bundle));

    }
}

function generateInfoWindowHtml(biz) {
    var text = '<div class="marker">';

    // image and rating
    if(typeof biz.image_url != 'undefined')
      text += '<img class="businessimage" src="'+biz.image_url+'"/>';

    // div start
    text += '<div class="businessinfo">';
    // name/url
    text += '<a href="'+biz.url+'" target="_blank">'+biz.name+'</a><br/>';
    // stars
    text += '<img class="ratingsimage" src="'+biz.rating_img_url_small+'"/>&nbsp;based&nbsp;on&nbsp;';
    // reviews
    text += biz.review_count + '&nbsp;reviews<br/><br />';
    // categories
    text += formatCategories(biz.categories);
    // neighborhoods
    if(biz.neighborhoods)
        text += formatNeighborhoods(biz.neighborhoods);
    // address
    text += biz.location.address[0] + '<br/>';
    // address2
    if(biz.location.address.length > 1) 
        text += biz.location.address[1] + '<br/>';
    // city, state and zip
    text += biz.location.city + ',&nbsp;' + biz.location.country_code + '<br/>';
    // phone number
    if(biz.phone)
        text += formatPhoneNumber(biz.phone);
    // Read the reviews
    text += '<br/><a href="'+biz.url+'" target="_blank">Read Yelp reviews »</a><br/>';
    // div end
    text += '</div></div>'
    return text;
}

function formatCategories(cats) {
    if(typeof cats == 'undefined')
      return '';

    var s = 'Categories: ';
    for(var i=0; i<cats.length; i++) {
        s+= cats[i][0];
        if(i != cats.length-1) s += ', ';
    }
    s += '<br/>';
    return s;
}

function formatPhoneNumber(num) {
    if(num.length != 10) return '';
    return '(' + num.slice(0,3) + ') ' + num.slice(3,6) + '-' + num.slice(6,10) + '<br/>';
}

window.onload = initialize;
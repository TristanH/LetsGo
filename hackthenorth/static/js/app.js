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
    zoom: 14
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

  if(false){
    //check here for this sessions default location
    startGetBusinesses(new google.maps.LatLng(43.65, -79.4)); //use django-supplied location
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

    if(data.businesses[i].numvotes)
      addUI(data.businesses[i], markers.length);
    // var goldStar = {
    //   path: 'M 125,5 155,90 245,90 175,145 200,230 125,180 50,230 75,145 5,90 95,90 z',
    //   fillColor: 'yellow',
    //   fillOpacity: 0.8,
    //   scale: 1,
    //   strokeColor: 'gold',
    //   strokeWeight: 14
    // };
    var redCircle = {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 7,
      fillColor: 'red',
      fillOpacity: .8,
      strokeColor: 'rgb(60, 60, 60)',
      strokeWeight: 3
    };
    var greenCircle = {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 7,
      fillColor: 'green',
      fillOpacity: .8,
      strokeColor: 'rgb(60, 60, 60)',
      strokeWeight: 3
    };
    var marker = new google.maps.Marker({
        position: location,
        map: map,
        icon: redCircle
    });
    
    markers.push(marker);
    var info = new google.maps.InfoWindow({
        content: generateInfoWindowHtml(data.businesses[i])
    });
    infoLabels.push(info);
    clicked.push(false);

    bundle = {'marker': marker, 'info': info, 'index': markers.length - 1};

    google.maps.event.addListener(marker, 'mouseover', function() {
      $("#bp" + this.index).css('background-color', 'rgb(236,236,236)');
 //     if(!clicked[this.index]) 
        this.info.open(map, this.marker);
    }.bind(bundle));
    google.maps.event.addListener(marker, 'mouseout', function() {
      $("#bp" + this.index).css('background-color', 'white');
  //    if(!clicked[this.index])
        this.info.close(map, this.marker);
    }.bind(bundle));
    
    google.maps.event.addListener(marker, 'click', function() {
      debugger;
      if(!clicked[this.index]) {
        //this.info.open(map, this.marker);
        markers[this.index] = new google.maps.Marker({
          position: markers[this.index].position,
          map: map,
          icon: greenCircle
        });
      } else {
        //this.info.close(map, this.marker);
        markers[this.index] = new google.maps.Marker({
          position: markers[this.index].position,
          map: map,
          icon: redCircle
        });
      }

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
    text += '<a class="businessname" href="'+biz.url+'" target="_blank">'+biz.name+'</a><br/>';
    // stars
    text += '<img class="ratingsimage" src="'+biz.rating_img_url_small+'"/>&nbsp;based&nbsp;on&nbsp;';
    // reviews
    text += '<a href="' + biz.url + ' target="_blank">' + biz.review_count + '&nbsp;reviews</a><br/>';
    // categories
    text += formatCategories(biz.categories);

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
    // div end
    text += '</div></div>'
    return text;
}

function formatCategories(cats) {
    if(typeof cats == 'undefined')
      return '';

    var s = '<div class="categories">';
    for(var i=0; i<cats.length; i++) {
        s+= cats[i][0];
        if(i != cats.length-1) s += ', ';
    }
    s += '<br/></div>';
    return s;
}

function formatPhoneNumber(num) {
    if(num.length != 10) return '';
    return '(' + num.slice(0,3) + ') ' + num.slice(3,6) + '-' + num.slice(6,10) + '<br/>';
}

function addUI(business, id){

  var votes = business.numvotes;
  var inserted = false;
  $("#sidebar .panel").each(function(){
    var votesAt =  parseInt($("#" + this.id + " " + ".numvotes").text());
    if(business.numvotes > votesAt && !inserted){
       $( this ).before(
        "<div class='panel panel-default' id='bp" + id + "'>" +
          "<div class='panel-body' id='body " + id + "'>" +
            "<div class='main' id='main=" + id + "'>" + 
              "<div class='businesscontents' id='bc" + id + "'><b>" + business.name + "</b>" +
              "</div>" +
              "<div class='vote-div' id='vd" + id + "'>" + //btn-primary
                "<button type='button' class='btn btn-default btn-lg btn-primary' id='vb" + id + "'>" +
                  "<span class='glyphicon glyphicon-thumbs-up'></span>" +"<div class='numvotes'>" + votes + "</div>" +
                "</button>" +
              "</div>" +
            "</div>" +
          "</div>" +
        "</div>"
       );  
      inserted = true;
    }
  });
  if(!inserted)
    $("#sidebar").append(
      "<div class='panel panel-default' id='bp" + id + "'>" +
        "<div class='panel-body' id='body " + id + "'>" +
          "<div class='main' id='main=" + id + "'>" + 
            "<div class='businesscontents' id='bc" + id + "'><b>" + business.name + "</b>" +
            "</div>" +
            "<div class='vote-div' id='vd" + id + "'>" +
              "<button type='button' class='btn btn-default btn-lg btn-primary' id='vb" + id + "'>" +
                "<span class='glyphicon glyphicon-thumbs-up'></span>" +"<div class='numvotes'>" + business.numvotes + "</div>" +
              "</button>" +
            "</div>" +
          "</div>" +
        "</div>" +
      "</div>"
  ); 
  
  $("#bp" + id + " .businesscontents").html(generateInfoWindowHtml(business))
  
  $("#bp" + id).hover(
    function(){
      $("#bp" + id).css('background-color', 'rgb(236,236,236)');
      infoLabels[id].open(map, markers[id]);
    },
    function(){
      $("#bp" + id).css('background-color', 'white');
      infoLabels[id].close(map, markers[id]);
    }
  );

  $( '#vb' + id ).click(function(e) {
      if (e.currentTarget.classList[e.currentTarget.classList.length - 1] == 'active') {
        $(e.currentTarget).removeClass('active');
        $('#' + e.currentTarget.id).html("<span class='glyphicon glyphicon-thumbs-up'></span> " +"<div class='numvotes'>"+ votes + "</div>" );
      } else {
        $(e.currentTarget).addClass('active');
        $('#' + e.currentTarget.id).html("<span class='glyphicon glyphicon-thumbs-up'></span> " + "<div class='numvotes'>"+ (votes+1) + "</div>" );
      }
  }); 
}


window.onload = initialize;
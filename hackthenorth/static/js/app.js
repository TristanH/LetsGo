var map;
var markers = [];
var searchCategories =[];
var infoLabels = [];
var fetchingBusinesses = false;
var numFetched = 0;
var businessLimit = 100;
var userLocation = new google.maps.LatLng(0,0);
var searchTerm = 'food';
var sessionSlug = '';
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

  sessionSlug = window.location.pathname.substring(1);
  if(sessionSlug[sessionSlug.length-1]=="/")
    sessionSlug=sessionSlug.substring(0,sessionSlug.length-1);

  //popup homepage modal here
  if(sessionSlug=="/" || sessionSlug=="")
    return;

  $("#pagename").text("#"+sessionSlug);



  if(true){
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
  addSearchCat("hipster");
  addSearchCat("bar");
  addSearchCat("booze");
  addSearchCat("sex");
  $('#gsbutton').click(function() {
    $('#helpModal').html(
      "<div class='modal-dialog modal-sm'>"+
          "<div class='modal-content'>"+
            "<div class='modal-header' id='helpModal-header'>"+
              "<h4 class='modal-title' id='myModalLabel'>Almost There!</h4>"+
            "</div>"+
            "<div class='modal-body' id='helpModal-body'>"+
              "<div class='input-group'>" + 
                "<input type='text' class='form-control' placeholder='List Name' required>" +
                "<span class='input-group-addon'>" +
                  "<span class='glyphicon glyphicon-tag'></span>" +
                "</span>" +
              "</div>" +
              "<br>" + 
              "<div class='input-group'>" + 
                "<input type='text' class='form-control' placeholder='Location' required>" +
                "<span class='input-group-btn'>" + 
                  "<button class='btn btn-default' type='button'>" +
                    "<span class='glyphicon glyphicon-map-marker'></span>" +
                  "</button>" +
                "</span>" +
              "</div>" +
              "<br>" + 
              "<div class='input-group'>" + 
                "<textarea rows='3' maxlength='100' class='form-control' placeholder='Description' required></textarea>" +
                "<span class='input-group-addon'>" +
                  "<span class='glyphicon glyphicon-tag'></span>" +
                "</span>" +
              "</div>" +
            "</div>"+
            "<div class='modal-footer'>"+
              "<div class='form-group'>" +
                "<button type='submit' id='donebutton' class='btn btn-default btn-primary' data-dismiss='modal'>Done</button>"+
              "</div>" +
            "</div>"+
        "</div>"+
      "</div>")
  });
  $('#helpModal').modal('show')
}

function addSearchCat(catName) {
  searchCategories.push(catName);
  $('#categoriesMenu').append("<li id='cat" + (searchCategories.length - 1) +"'><a href='#''>#" + catName + "</a></li>");
  var index = searchCategories.length - 1;
  $('#cat' + (searchCategories.length - 1)).click(function() {
    debugger;
    if ($('#cat' + index).hasClass('active')) {
      $('#cat' + index).removeClass('active')
    } else {
      for (var l = searchCategories.length - 1; l >= 0; l--) {
        if (index != l) {
          $('#cat' + l).removeClass('active')
        }else {
          $('#cat' + l).addClass('active')
          setTerm(searchCategories[index]);
        }
      };
      
      }
    });
}
function startGetBusinesses(location){
  $('#loading').show();
  map.setCenter(location);
  userLocation = location;
 // getBusinesses(location, 0, searchTerm);
  getVotedBusinesses(location);
}

function getVotedBusinesses(location){
  $.get('/'+sessionSlug+'/get_voted/',
    function(data, status){
      addBusinessMarkers(data);
      getBusinesses(location, 0, searchTerm);
      //call the standard business search once the important ones are found
    });
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
      addBusinessMarkers(data.businesses);
      numFetched += 20;
      if(offset < businessLimit && offset < data.total)
        getBusinesses(location, offset + 20, 'food');
      else {
        fetchingBusinesses = false;
        $('#loading').hide();
      }
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

function addBusinessMarkers(businesses){
  var clicked = [];

  for(var i=0; i<businesses.length; i++){
    var location;
    if('coordinate' in businesses[i].location)
      location = new google.maps.LatLng(businesses[i].location.coordinate.latitude, businesses[i].location.coordinate.longitude);
    else
      continue;

    var marker = new google.maps.Marker({
        position: location,
        map: map,
        icon: redCircle
    });
    markers.push(marker);

    if(businesses[i].numvotes){
      marker.numvotes = businesses[i].numvotes;  
      addUI(businesses[i], markers.length - 1);
    }

    var info = new google.maps.InfoWindow({
        content: generateInfoWindowHtml(businesses[i])
    });
    infoLabels.push(info);
    clicked.push(false);

    bundle = {'marker': marker, 'info': info, 'index': markers.length - 1, 'i': i};

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
      if(!clicked[this.index]) {
        //this.info.open(map, this.marker);
        debugger;
        voteEvent.call(businesses[this.i], this.index)

      } else {
        //this.info.close(map, this.marker);
        voteEvent.call(businesses[this.i], this.index)
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
  var newPanel = 
    $("<div class='panel panel-default' id='bp" + id + "'>" +
        "<div class='panel-body' id='body " + id + "'>" +
          "<div class='main' id='main=" + id + "'>" + 
            "<div class='businesscontents' id='bc" + id + "'><b>" + business.name + "</b>" +
            "</div>" +
            "<div class='vote-div' id='vd" + id + "'>" + //btn-primary
              "<button type='button' class='btn btn-default btn-lg' id='vb" + id + "'>" +
                "<span class='glyphicon glyphicon-thumbs-up'></span>" +"<div class='numvotes'>" + votes + "</div>" +
              "</button>" +
            "</div>" +
          "</div>" +
        "</div>" +
      "</div>").hide();

  $("#sidebar .panel").each(function(){
    var votesAt =  parseInt($("#" + this.id + " " + ".numvotes").text());

    if(business.numvotes > votesAt && !inserted){
       $( this ).before(newPanel);  
      inserted = true;
    }
  });

  if(!inserted)
    $("#sidebar").append(newPanel);
  
  $("#bp" + id + " .businesscontents").html(generateInfoWindowHtml(business))

  newPanel.slideDown('slow');
  
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
  $( '#vb' + id ).click(voteEvent.bind(business, id)); 
}

function voteEvent(id){
  debugger;
  //handle case of newly voted business
  if(!this.hasOwnProperty('numvotes')){
    this.numvotes=0;
    addUI(this, id);
  }
  if ( $( '#vb' + id ).hasClass('active')) {
    markers[id].setOptions({icon: redCircle});
    $('#vb' + id ).removeClass('active');
    $('#vb' + id ).html("<span class='glyphicon glyphicon-thumbs-up'></span> " +"<div class='numvotes'>"+ this.numvotes + "</div>" );
    $.get('/'+sessionSlug+'/vote_for/',
      {'downVote': true, 'yelp_id': this.id},
      function(data, status){
        if(status != 'success')
          console.log("Failed to vote: " + status);
      }
    );
  } else {
    $.get('/'+sessionSlug+'/vote_for/',
      {'yelp_id': this.id},
      function(data, status){
        if(status != 'success')
          console.log("Failed to vote: " + status);
      }
    );
    markers[id].setOptions({icon: greenCircle});
    $('#vb' + id ).addClass('active');
    $('#vb' + id ).html("<span class='glyphicon glyphicon-thumbs-up'></span> " + "<div class='numvotes'>"+ (this.numvotes+1) + "</div>" );
  }
}


window.onload = initialize;
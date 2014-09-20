var map;

function initialize() {
  var mapOptions = {
    center: new google.maps.LatLng(0,0),
    zoom: 2
  };
  map = new google.maps.Map(document.getElementById("map-canvas"),
      mapOptions);
  var sampleData = 
  	{
	  "numvotes": 15,  		
	  "businesses": [
	    {
	      "categories": [
	        [
	          "Local Flavor",
	          "localflavor"
	        ],
	        [
	          "Mass Media",
	          "massmedia"
	        ]
	      ],
	      "display_phone": "+1-415-908-3801",
	      "id": "yelp-san-francisco",
	      "is_claimed": true,
	      "is_closed": false,
	      "image_url": "http://s3-media2.ak.yelpcdn.com/bphoto/7DIHu8a0AHhw-BffrDIxPA/ms.jpg",
	      "location": {
	        "address": [
	          "140 New Montgomery St"
	        ],
	        "city": "San Francisco",
	        "country_code": "US",
	        "cross_streets": "3rd St & Opera Aly",
	        "display_address": [
	          "140 New Montgomery St",
	          "(b/t Natoma St & Minna St)",
	          "SOMA",
	          "San Francisco, CA 94105"
	        ],
	        "neighborhoods": [
	          "SOMA"
	        ],
	        "postal_code": "94105",
	        "state_code": "CA"
	      },
	      "mobile_url": "http://m.yelp.com/biz/4kMBvIEWPxWkWKFN__8SxQ",
	      "name": "Yelp",
	      "phone": "4159083801",
	      "rating_img_url": "http://media1.ak.yelpcdn.com/static/201012161694360749/img/ico/stars/stars_3.png",
	      "rating_img_url_large": "http://media3.ak.yelpcdn.com/static/201012161053250406/img/ico/stars/stars_large_3.png",
	      "rating_img_url_small": "http://media1.ak.yelpcdn.com/static/201012162337205794/img/ico/stars/stars_small_3.png",
	      "review_count": 3347,
	      "snippet_image_url": "http://s3-media2.ak.yelpcdn.com/photo/LjzacUeK_71tm2zPALcj1Q/ms.jpg",
	      "snippet_text": "Sometimes we ask questions without reading an email thoroughly as many of us did for the last event.  In honor of Yelp, the many questions they kindly...",
	      "url": "http://www.yelp.com/biz/yelp-san-francisco",
	      "menu_provider": "yelp",
	      "menu_date_updated": 1317414369
	    }
	  ],
	  "region": {
	    "center": {
	      "latitude": 37.786138600000001,
	      "longitude": -122.40262130000001
	    },
	    "span": {
	      "latitude_delta": 0.0,
	      "longitude_delta": 0.0
	    }
	  },
	  "total": 10651
	}
	//debugger;
	// sampleData.businesses[0].name
	$( '#t1.panel-body' ).append(
		"<div class='main'>" + 
		"<div class='businesscontents'><b>" + /*Insert Store Data Here*/ + "</b></div>" +
			"<div class='rightbutton'>" +
				"<button type='button' class='btn btn-default btn-lg' data-toggle='button'>" +
					"<span class='glyphicon glyphicon-thumbs-up'></span> " + sampleData.numvotes + 
				"</button>" +
			"</div>" +
		"</div>");
	$( '#t1 .businesscontents').css('height', $( '#t1.panel-body' ).height() + 'px');
	//$( '#t1 .businesscontents').css('background-image', 'url(' +  + ')');
}

window.onload = initialize;


function updateUI() {
  var businessList = [
  	{
	  	"numvotes": 15,
	  	"businessInfo": {
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
	},
	{
	  	"numvotes": 10,
	  	"businessInfo": {
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
			  "name": "Yelp2",
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
	},]
	businessList.sort(function(a, b){return a.numvotes-b.numvotes});
	//debugger;
	// sampleData.businesses[0].name
	for (var i = businessList.length - 1; i >= 0; i--) {
		$( '#sidebar' ).append(
			"<div class='panel panel-default' id='bp" + i + "'>" +
				"<div class='panel-body' id='body " + i + "'>" +
					"<div class='main' id='main=" + i + "'>" + 
						"<div class='businesscontents' id='bc" + i + "'><b>" + businessList[i].businessInfo.businesses[0].name + "</b>" +
						"</div>" +
						"<div class='vote-div' id='vd" + i + "'>" +
							"<button type='button' class='btn btn-default btn-lg' id='vb" + i + "'>" +
								"<span class='glyphicon glyphicon-thumbs-up'></span> " + businessList[i].numvotes + 
							"</button>" +
						"</div>" +
					"</div>" +
				"</div>" +
		  "</div>"
		);
		$( '#vb' + i ).click(function(e) {
			debugger;
			if (e.currentTarget.classList[e.currentTarget.classList.length - 1] == 'active') {
				businessList[parseInt(e.currentTarget.id.slice(2))].numvotes--;
				$(e.currentTarget).removeClass('active');
				$('#' + e.currentTarget.id).html("<span class='glyphicon glyphicon-thumbs-up'></span> " + businessList[parseInt(e.currentTarget.id.slice(2))].numvotes)
			} else {
				businessList[parseInt(e.currentTarget.id.slice(2))].numvotes++;
				$(e.currentTarget).addClass('active');
				$('#' + e.currentTarget.id).html("<span class='glyphicon glyphicon-thumbs-up'></span> " + businessList[parseInt(e.currentTarget.id.slice(2))].numvotes)
			}
		});	
	};
	$( '#t1 .businesscontents').css('height', $( '#t1.panel-body' ).height() + 'px');
	
	//$( '#t1 .businesscontents').css('background-image', 'url(' +  + ')');
	$( '#helpModal' ).modal()

}

$(document).ready(updateUI);
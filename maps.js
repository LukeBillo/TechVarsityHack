$(document).ready(function() {
    var map;
    var infoWindow;
    var service;

    var infoWindow = new google.maps.InfoWindow({
        content: null
    });

    function initialize(lat,lng)
    {
        var origin = new google.maps.LatLng(lat,lng);

        console.log(origin);

        map = new google.maps.Map(document.getElementById('map'), {
            center: origin,
            zoom: 15,
            mapTypeId: "OSM",
            mapTypeControl: false,
            streetViewControl: false
        });

        map.mapTypes.set("OSM", new google.maps.ImageMapType({
                getTileUrl: function(coord, zoom) {
                    // "Wrap" x (logitude) at 180th meridian properly
                    // NB: Don't touch coord.x because coord param is by reference, and changing its x property breakes something in Google's lib
                    var tilesPerGlobe = 1 << zoom;
                    var x = coord.x % tilesPerGlobe;
                    if (x < 0) {
                        x = tilesPerGlobe+x;
                    }
                    // Wrap y (latitude) in a like manner if you want to enable vertical infinite scroll

                    return "http://tile.openstreetmap.org/" + zoom + "/" + x + "/" + coord.y + ".png";
                },
                tileSize: new google.maps.Size(256, 256),
                name: "OpenStreetMap",
                maxZoom: 18
            }));
    }

    function createMarker(place) {
        coords = place.latlong.coordinates;
        LATITUDE = 1;
        LONGITUDE = 0;

        var marker = new google.maps.Marker({
          map: map,
          position: new google.maps.LatLng(coords[LATITUDE], coords[LONGITUDE])
        });

        var content='<strong style="font-size:1.2em">' + place.stationname + '</strong>'+
                    '<br/><strong>Latitude:</strong>' + coords[LATITUDE] +
                    '<br/><strong>Longitude:</strong>' + coords[LONGITUDE] +
                    '<br/><strong>Distance:</strong>' + place.distance;

        marker.addListener('click', function() {
            infoWindow.setContent(content);
            infoWindow.open(map, marker);

            var iframe = $('#trains-frame');
            console.log(iframe);
            console.log(place);
            getDepartures(iframe, place.tiploccode);
        });
    }

    function findStationLongLat(longLat) {
        console.log("longLat: " + longLat);
      lat = longLat.lat;
      long = longLat.lng;

      var topLeftLong = long+0.05;
      var topLeftLat = lat -0.05;
      var bottomRightLong = long -0.05 ;
      var bottomRightLat = lat +0.05;

      url = '//data.gov.uk/data/api/service/transport/naptan_railway_stations/extent?top-left-lat='
      +topLeftLat+'&top-left-lon='+topLeftLong+'&bottom-right-lat='+bottomRightLat+'&bottom-right-lon='+bottomRightLong;


      var stationName;
      var longLatOut;
      var distance;

      $.getJSON(url, function(json, status)
      {
          console.log(json);
        for (train_station of json.result)
        {
          createMarker(train_station);
        }
      });
    }

    function findStationPostCode(postcode){
      var distance = 3;
      url = '//data.gov.uk/data/api/service/transport/naptan_railway_stations/postcode?postcode=' +postcode + '&distance='+distance;

      var stationName;
      var longLatOut;
      var distance;
      $.getJSON(url, function(json, status)
      {
        for (train_station of json.result)
        {
          createMarker(train_station);
        }

      });

    }

    function getLocation() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };

            initialize(pos.lat, pos.lng);

        }, console.log("Geolocation service failed."));
        } else {
          // Browser doesn't support Geolocation
          console.log("Your browser doesn't support geolocation.");
        }
    }

    function getDepartures(iframe, tiploc) {
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            showResult(this, iframe, tiploc );
        }
        };
        xhttp.open("GET", "sites.xml", true);
        xhttp.send();
    }

    function showResult(xml, iframe, tiploc) {
        var txt = "";
        //console.log(xml);
        path = "/TigerStations/LICC/Station[@TIPLOC"+"='"+tiploc+"']/@XMLURN";

        var nodes = xml.responseXML.evaluate(path, xml.responseXML, null, XPathResult.ANY_TYPE, null);
        var result = nodes.iterateNext();
        console.log(result);
        departureboard = "http://iris2.rail.co.uk/tiger/rendermobile.asp?file="+result.value;
        console.log(departureboard);

        iframe[0].src = departureboard.toString();
    }

    getLocation();

    $('#findLocationBtn').click(function(event) {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            findStationLongLat(pos);

        }, console.log("Geolocation service failed."));
        } else {
          // Browser doesn't support Geolocation
          console.log("Your browser doesn't support geolocation.");
        }

    });

    $('#findPostcodeBtn').click(function(event) {
        var postcode = $('#postcodeField');
        findStationPostCode(postcode[0].value);
    });
});

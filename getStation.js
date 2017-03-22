//findStationPostCode("BR3 3BA");
nottingham = [52.954783, -1.158109]
var stationName;
var longLatOut;
var distance;

var findPromise = new Promise(function(resolve, reject)
{
  findStationLongLat(nottingham);
});
console.log(findPromise);
findPromise.then(function(result) {
  console.log(stationName);
});


/*$.getJSON('//data.gov.uk/data/api/service/transport/naptan_railway_stations/postcode?postcode=NG3 1DJ&distance=3', function(json, status)
{
  console.log(json);
  console.log(json.result[0].stationname);
  console.log(json.result[0].latlong.coordinates);
  console.log(json.result[0].distance);
  //console.log(json.stationname);
})*/

function findStationLongLat(longLat){
  lat = longLat[0];
  long = longLat[1];

  var topLeftLong = long+0.05;
  var topLeftLat = lat -0.05;
  var bottomRightLong = long -0.05 ;
  var bottomRightLat = lat +0.05;

  url = '//data.gov.uk/data/api/service/transport/naptan_railway_stations/extent?top-left-lat='
  +topLeftLat+'&top-left-lon='+topLeftLong+'&bottom-right-lat='+bottomRightLat+'&bottom-right-lon='+bottomRightLong;


  var stationName;
  var longLatOut;
  var distance;

  console.log("Entering GET call");

  $.getJSON(url, function(json, status)
  {
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
//objddd = JSON.parse(returned);
//console.log(obj);

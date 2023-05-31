const stateList = [""]; //pass into select options
function handleLocationSearch(event) {
  event.preventDefault();
  var city = $("#city").val();
  var state = $("#state").val();
  //RENAME
  geoCodeLocationForWeather("Denver", "Colorado");
  //retrieveWeatherFromLocation(null, null);
}
/*research async await

*/
function geoCodeLocationForWeather(city, state) {
  fetch(
    "https://api.openweathermap.org/geo/1.0/direct?q=" +
      city +
      "," +
      state +
      ",US&limit=10&appid=5a5f2543215b0ae09a5dc07887c20551"
  )
    .then(function (response) {
      console.log(response);
      return response.json();
    })
    .then(function (data) {
      var coordinateResults = new Coordinates();
      if (data.length > 1) {
        //build modal and have user select
        for (var i = 0; i < data.length; i++) {
          if (
            data[i].state == state &&
            !Number.isNaN(data[i].lat) &&
            !Number.isNaN(data[i].lon)
          ) {
            coordinateResults = new Coordinates(data[i].lat, data[i].lon);
          }
        }
      } else if (
        data.length == 1 &&
        !Number.isNaN(data[0].lat) &&
        !Number.isNaN(data[0].lon)
      ) {
        coordinateResults = new Coordinates(data[0].lat, data[0].lon);
      } else {
        alert(
          "CLEAN UP THE MESSAGE; NO CITY STATE FOUND BASED ON WHAT YOU ENTERED. CITY: " +
            city +
            " and STATE: " +
            state
        );
      }
      if (coordinateResults.lat && coordinateResults.lon) {
        retrieveWeatherFromLocation(
          coordinateResults.lat,
          coordinateResults.lon
        );
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}
function retrieveWeatherFromLocation(lat, lon) {
  fetch(
    "https://api.openweathermap.org/data/2.5/forecast?lat=" +
      lat +
      "&lon=" +
      lon +
      "&appid=5a5f2543215b0ae09a5dc07887c20551&units=imperial&cnt=5"
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log("weather data!");
      console.log(data);
      displayWeather(data.list);
    })
    .catch(function (error) {
      console.log(error);
    });
}
function displayWeather(dailyWeather) {
  var weatherContainer = $("#weather-container");
  for (var i = 0; i < dailyWeather.length; i++) {
    console.log(dailyWeather[i]);
    /*
        .dt_txt = 2023-06-01 00:00:00
            .main.temp
            .weather.main (rain, snow, clouds)

            extra: wind (direction would be arrow rotated dynamically!)
    */
  }
}
$("#search").on("click", handleLocationSearch);

function Coordinates(lat, lon) {
  this.lat = lat;
  this.lon = lon;
}

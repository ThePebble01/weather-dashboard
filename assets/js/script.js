function handleLocationSearch(event) {
  event.preventDefault();
  var city = $("#city").val();
  var state = $("#state").val();
  //RENAME
  geoCodeLocationForWeather(city, state);
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
      return response.json();
    })
    .then(function (data) {
      var latitude;
      var longitude;
      if (
        data.length == 1 &&
        !Number.isNaN(data[0].lat) &&
        !Number.isNaN(data[0].lon)
      ) {
        latitude = data[0].lat;
        longitude = data[0].lon;
      } else if (data.length > 1) {
        for (var i = 0; i < data.length; i++) {
          if (
            data[i].state == state &&
            !Number.isNaN(data[i].lat) &&
            !Number.isNaN(data[i].lon)
          ) {
            latitude = data[i].lat;
            longitude = data[i].lon;
          }
        }
      } else {
        alert(
          "Geolocation failed for the following city: " +
            city +
            " and state: " +
            state +
            "\n\nPlease check your spelling and try again."
        );
      }
      if (latitude && longitude) {
        retrieveWeatherFromLocation(latitude, longitude);
      }
    })
    .catch(function (error) {
      console.log(error);
      alert("The geolocation servie has failed.  Please try again later.");
    });
}
function retrieveWeatherFromLocation(lat, lon) {
  fetch(
    "https://api.openweathermap.org/data/2.5/forecast?lat=" +
      lat +
      "&lon=" +
      lon +
      "&appid=5a5f2543215b0ae09a5dc07887c20551&units=imperial&cnt=6"
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

  var weatherContainer = $(".weather-today");
  for (var i = 0; i < dailyWeather.length; i++) {
    console.log(dailyWeather[i]);
    var divCardEl = $("<div>");
    divCardEl.addClass("card");
    var divCardBodyEl = $("<div>");
    divCardBodyEl.addClass("card-body");

    dailyWeather[i].dt_txt;
    dailyWeather[i].main.humidity,
      dailyWeather[i].main.temp,
      dailyWeather[i].wind.gust;
    /*
    <div class="card">
              <div class="card-body">
                <h5 class="card-title">TODAY, 6/1/2023</h5>
                <p class="card-text">
                  <span>Temp: 100 F</span>
                  <span>Humidity: X %</span>
                  <span>Wind: X MPH</span>
                </p>
              </div>
            </div>

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
$(function () {
  setStateOptions();
});
function setStateOptions() {
  var stateSelectEl = $("#state");
  for (var i = 0; i < stateList.length; i++) {
    var optionEl = $("<option>");
    optionEl.attr("value", stateList[i]);
    optionEl.text(stateList[i]);
    stateSelectEl.append(optionEl);
  }
}
//Placed at bottom contrary to best practices since this is only used for select option
const stateList = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "District Of Columbia",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];

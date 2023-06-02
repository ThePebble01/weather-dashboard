$(function () {
  setStateOptions();
  //load history
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
function handleLocationSearch(event) {
  event.preventDefault();
  var city = $("#city").val();
  var state = $("#state").val();
  geoCodeLocationForWeather(city, state);
  //retrieveWeatherFromLocation(null, null);
}
/*
  API Documentation: https://openweathermap.org/api/geocoding-api
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
/*
  API Documentation: https://openweathermap.org/forecast5
*/
function retrieveWeatherFromLocation(lat, lon) {
  fetch(
    "https://api.openweathermap.org/data/2.5/forecast?lat=" +
      lat +
      "&lon=" +
      lon +
      "&appid=5a5f2543215b0ae09a5dc07887c20551&units=imperial"
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      displayWeather(data.list);
    })
    .catch(function (error) {
      console.log(error);
    });
}
function displayWeather(dailyWeather) {
  var todayWeatherContainer = $(".weather-today");
  var nextWeatherContainer = $(".weather-next");
  var priorWeatherDate;
  var numDays = 0;
  for (var i = 0; i < dailyWeather.length; i++) {
    var weatherDate = new Date(dailyWeather[i].dt_txt.split(" ")[0]);
    if (!priorWeatherDate || priorWeatherDate < weatherDate) {
      var divCardEl = $("<div>");
      divCardEl.addClass("card");
      divCardEl.addClass("border-secondary");
      var divCardBodyEl = $("<div>");
      divCardBodyEl.addClass("card-body");
      divCardEl.append(divCardBodyEl);

      var h5CardTitleEl = $("<h5>");
      var title = weatherDate.toDateString();
      h5CardTitleEl.text(title);
      divCardBodyEl.append(h5CardTitleEl);

      var pCardBodyEl = $("<p>");
      // ADD IMAGE LATER, BASE OFF OF dailyWeather[i].weather[0].main
      // RAin,
      var spanTempEl = $("<span>");
      spanTempEl.text("Temperature: " + dailyWeather[i].main.temp + " °F");
      pCardBodyEl.append(spanTempEl);
      pCardBodyEl.append($("<br>"));
      var spanHumEl = $("<span>");
      spanHumEl.text("Humidity: " + dailyWeather[i].main.temp + " %");
      pCardBodyEl.append(spanHumEl);
      pCardBodyEl.append($("<br>"));
      var spanWindEl = $("<span>");
      spanWindEl.text("Wind: " + dailyWeather[i].wind.gust + " MPH");
      pCardBodyEl.append(spanWindEl);

      divCardBodyEl.append(pCardBodyEl);
      if (numDays == 0) {
        h5CardTitleEl.text(
          "Today in " + $("#city").val() + ": " + weatherDate.toDateString()
        );
        divCardEl.css("width", "100%");
        todayWeatherContainer.append(divCardEl);
      } else if (numDays == 1) {
        // var h3El = $("<h3>");
        // h3El.text("5-Day Forecast:");
        // nextWeatherContainer.append(h3El);
        nextWeatherContainer.append(divCardEl);
      } else {
        nextWeatherContainer.append(divCardEl);
      }
      numDays++;
    }
    priorWeatherDate = weatherDate;
  }
}
$("#search").on("click", handleLocationSearch);

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

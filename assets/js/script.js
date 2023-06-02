const localStorageKey = "weatherDashboardSearchHistory";
const cityStateSeparator = ", ";
$(function () {
  setStateOptions();
  displaySearchHistory();
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
function displaySearchHistory() {
  var priorSearches = JSON.parse(localStorage.getItem(localStorageKey));
  if (priorSearches) {
    var divCardEl = $("<div>");
    divCardEl.addClass("card");

    var divCardHeaderEl = $("<div>");
    divCardHeaderEl.addClass("card-header");
    divCardHeaderEl.text("Search History");
    divCardEl.append(divCardHeaderEl);

    var listGroupEl = $("<ul>");
    listGroupEl.addClass("list-group list-group-flush");
    divCardEl.append(listGroupEl);
    $(".search-history-container").append(divCardEl);
    for (var i = 0; i < priorSearches.length; i++) {
      var listItemEl = $("<li>");
      listItemEl.addClass("list-group-item");
      listItemEl.text(priorSearches[i]);
      listGroupEl.append(listItemEl);
    }
    $("li").on("click", handleSearchEntryClick);
  }
}
function handleLocationSearch(event) {
  event.preventDefault();
  resetPage();
  geoCodeLocationForWeather($("#city").val(), $("#state").val());
}
function resetPage() {
  $(".weather-today").empty();
  $("h3").text("");
  $(".weather-next").empty();
}
function handleSearchEntryClick(event) {
  event.preventDefault();
  var cityStateArray = event.target.textContent.split(cityStateSeparator);
  $("#city").val(cityStateArray[0]);
  $("#state").val(cityStateArray[1]);
  handleLocationSearch(event);
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
        saveSearch(city, state);
        retrieveWeatherFromLocation(latitude, longitude);
      }
    })
    .catch(function (error) {
      console.log(error);
      alert(
        "The geolocation service has failed so we are unable to provide you with weather data.  Please try again later."
      );
    });
}
function saveSearch(city, state) {
  var cityState = city + cityStateSeparator + state;
  var priorSearches = JSON.parse(localStorage.getItem(localStorageKey));
  if (Array.isArray(priorSearches)) {
    priorSearches.push(cityState);
    console.log(priorSearches.length);
    if (priorSearches.length >= 9) {
      priorSearches = priorSearches.slice(1);
    }
  } else {
    priorSearches = [];
    priorSearches.push(cityState);
  }
  localStorage.setItem(localStorageKey, JSON.stringify(priorSearches));
  $(".search-history-container").empty(); //Resets the search history
  displaySearchHistory();
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
  displayWeatherForToday(dailyWeather[0]);
  $("h3").text("5 DAY FORECAST:");
  var priorWeatherDate;
  for (var i = 1; i < dailyWeather.length; i++) {
    var weatherDate = new Date(dailyWeather[i].dt_txt.split(" ")[0]);
    if (!priorWeatherDate || priorWeatherDate < weatherDate) {
      var weatherIcon = dailyWeather[i].weather[0].icon.replace("n", "d");
      var weatherDescription = dailyWeather[i].weather[0].description;
      var divCardEl = $("<div>");
      divCardEl.addClass("card");
      divCardEl.addClass("border-secondary");
      var divCardBodyEl = $("<div>");
      divCardBodyEl.addClass("card-body");
      divCardEl.append(divCardBodyEl);
      var h5CardTitleEl = $("<h5>");
      h5CardTitleEl.text(weatherDate.toDateString());
      divCardBodyEl.append(h5CardTitleEl);
      var imgEl = $("<img>");
      imgEl.attr(
        "src",
        "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png"
      );
      imgEl.attr("alt", weatherDescription);
      divCardBodyEl.append(imgEl);
      var pCardBodyEl = $("<p>");
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
      $(".weather-next").append(divCardEl);
    }
    priorWeatherDate = weatherDate;
  }
}
function displayWeatherForToday(weatherToday) {
  var weatherIcon = weatherToday.weather[0].icon.replace("n", "d");
  var weatherDescription = weatherToday.weather[0].description;
  var weatherDate = new Date(weatherToday.dt_txt.split(" ")[0]);
  var divCardEl = $("<div>");
  divCardEl.addClass("card");
  divCardEl.addClass("border-primary");
  var divCardBodyEl = $("<div>");
  divCardBodyEl.addClass("card-body");
  divCardEl.append(divCardBodyEl);
  var h5CardTitleEl = $("<h5>");
  h5CardTitleEl.text(
    "Today in " + $("#city").val() + ": " + weatherDate.toDateString()
  );
  divCardBodyEl.append(h5CardTitleEl);
  var imgEl = $("<img>");
  imgEl.attr(
    "src",
    "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png"
  );
  imgEl.attr("alt", weatherDescription);
  divCardBodyEl.append(imgEl);
  var pCardBodyEl = $("<p>");
  var spanTempEl = $("<span>");
  spanTempEl.text("Temperature: " + weatherToday.main.temp + " °F");
  pCardBodyEl.append(spanTempEl);
  pCardBodyEl.append($("<br>"));
  var spanHumEl = $("<span>");
  spanHumEl.text("Humidity: " + weatherToday.main.temp + " %");
  pCardBodyEl.append(spanHumEl);
  pCardBodyEl.append($("<br>"));
  var spanWindEl = $("<span>");
  spanWindEl.text("Wind: " + weatherToday.wind.gust + " MPH");
  pCardBodyEl.append(spanWindEl);
  divCardBodyEl.append(pCardBodyEl);
  divCardEl.css("width", "100%");
  $(".weather-today").append(divCardEl);
}

$("#search").on("click", handleLocationSearch);

//Placed at bottom contrary to best practices since this constant is only used for select option
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

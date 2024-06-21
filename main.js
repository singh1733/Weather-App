function getUserInput(location, degree) {
  getWeather(location) // Fetch weather data for the given location
    .then((weatherData) => {
      let weatherArray = [];
      if (weatherData !== "Invalid Location") {
        dialog.close(); // Close the dialog if location is valid
        degreeButton.style.visibility = "visible"; // Show the degree button
        console.log(weatherData); // Log the fetched weather data
        weatherArray = parseWeatherData(weatherData, degree); // Parse the weather data
      } else {
        document.getElementById("error").style.visibility = "visible"; // Show error if location is invalid
        askForInput(); // Prompt user for input again
      }
      return { weatherArray, weatherData }; // Return parsed weather data and original weather data
    })
    .then((weather) => {
      if (weather.weatherArray.length != 0) {
        displayWeather(weather, degree); // Display the weather if data is available
      }
    });
}

async function getWeather(location) {
  const response = await fetch(
    "https://api.weatherapi.com/v1/forecast.json?key=3c559f8d37c146e887a191047241906&q=" +
      location +
      "&days=5",
    { mode: "cors" }
  );

  const weatherData = await response.json();

  if (weatherData.error || !response.ok) {
    return "Invalid Location"; // Return error if the location is invalid
  }

  return weatherData; // Return fetched weather data
}

function parseWeatherData(weatherData, degree) {
  const days = [];
  const tempKey = degree === "f" ? "avgtemp_f" : "avgtemp_c"; // Key for average temperature
  const minTempKey = degree === "f" ? "mintemp_f" : "mintemp_c"; // Key for minimum temperature
  const maxTempKey = degree === "f" ? "maxtemp_f" : "maxtemp_c"; // Key for maximum temperature
  const currTempKey = degree === "f" ? "temp_f" : "temp_c"; // Key for current temperature
  const feelsLikeTempKey = degree === "f" ? "feelslike_f" : "feelslike_c"; // Key for feels like temperature
  for (let i = 0; i < 6; i++) {
    if (i > 0) {
      const date = weatherData.forecast.forecastday[i - 1].date;
      const temp = weatherData.forecast.forecastday[i - 1].day[tempKey];
      const condition = weatherData.forecast.forecastday[i - 1].day.condition;
      const minTemp = weatherData.forecast.forecastday[i - 1].day[minTempKey];
      const maxTemp = weatherData.forecast.forecastday[i - 1].day[maxTempKey];
      days[i] = {
        date,
        temp,
        condition,
        minTemp,
        maxTemp,
      };
    } else {
      const temp = weatherData.current[currTempKey];
      const condition = weatherData.current.condition;
      const feelsLike = weatherData.current[feelsLikeTempKey];
      const windMPH = weatherData.current.wind_mph;
      const uv = weatherData.current.uv;
      const humidity = weatherData.current.humidity;

      days[0] = { temp, condition, feelsLike, windMPH, uv, humidity };
    }
  }
  return days; // Return parsed weather data for each day
}

function displayWeather(weather, degree) {
  const locationButton = document.getElementById("location-set");
  locationButton.style.visibility = "visible"; // Show location button
  locationButton.addEventListener("click", askForInput); // Add event listener to location button
  document
    .getElementById("weather-container")
    .setAttribute("style", "visibility: visible"); // Show weather container

  document.getElementById("location-title").textContent =
    weather.weatherData.location.name; // Display location name
  displayCurrentWeather(weather.weatherArray[0], degree); // Display current weather
  displayForecast(weather.weatherArray, degree); // Display weather forecast
}

function displayCurrentWeather(currentObject, degree) {
  const obTemp = currentObject.temp;
  const obCondition = currentObject.condition;
  const obFeelsLike = currentObject.feelsLike;
  const obWindMPH = currentObject.windMPH;
  const obUV = currentObject.uv;
  const obHumidity = currentObject.humidity;
  document.getElementById("curr-temp-num").textContent =
    obTemp + "°" + degree.toUpperCase(); // Display current temperature
  document.getElementById("cur-img").src = obCondition.icon; // Display condition icon
  document.getElementById("feels-like").textContent =
    "feels like: " + obFeelsLike + "°" + degree.toUpperCase(); // Display feels like temperature
  document.getElementById("condition").textContent =
    "condition: " + obCondition.text.toLowerCase(); // Display condition
  document.getElementById("wind").textContent = "wind: " + obWindMPH + " mph"; // Display wind speed
  document.getElementById("humidity").textContent =
    "humidity: " + obHumidity + "%"; // Display humidity
  document.getElementById("uv").textContent = "uv: " + obUV; // Display UV index
}

function displayForecast(weatherArray, degree) {
  for (let i = 1; i < weatherArray.length; i++) {
    const obDate = weatherArray[i].date;
    const obTemp = weatherArray[i].temp;
    const obCondition = weatherArray[i].condition;
    const obMinTemp = weatherArray[i].minTemp;
    const obMaxTemp = weatherArray[i].maxTemp;
    document.getElementById("date" + i).textContent = getDayName(obDate); // Display date
    document.getElementById("temp" + i).textContent =
      obTemp + "°" + degree.toUpperCase(); // Display temperature
    document.getElementById(i).querySelector("img").src = obCondition.icon; // Display condition icon
    document.getElementById("min" + i).innerHTML =
      "low: <b>" + obMinTemp + "<b>" + "°" + degree.toUpperCase(); // Display minimum temperature
    document.getElementById("condition" + i).textContent =
      obCondition.text.toLowerCase(); // Display condition
    document.getElementById("max" + i).innerHTML =
      "high: <b>" + obMaxTemp + "<b>" + "°" + degree.toUpperCase(); // Display maximum temperature
  }
}

function getDayName(dateString) {
  const date = new Date(dateString);
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const dayName = daysOfWeek[date.getDay()]; // Get day name from date
  return dayName;
}

function askForInput() {
  dialog.show(); // Show the input dialog
}

const degreeButton = document.getElementById("degree");
degreeButton.addEventListener("click", () => {
  const location = document.getElementById("location-title").textContent;
  if (degreeButton.textContent === "°C") {
    degreeButton.textContent = "°F"; // Toggle degree button text to °F
    getUserInput(location, "c"); // Fetch weather data in Celsius
  } else {
    degreeButton.textContent = "°C"; // Toggle degree button text to °C
    getUserInput(location, "f"); // Fetch weather data in Fahrenheit
  }
});

const dialog = document.querySelector("dialog");
const enterButton = document.querySelector("button");
enterButton.addEventListener("click", () => {
  getUserInput(document.getElementById("location").value, "f"); // Fetch weather data for entered location
});

askForInput(); // Prompt user for location input

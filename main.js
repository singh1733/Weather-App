function getUserInput(location) {
  getWeather(location)
    .then((weatherData) => {
      let weatherArray = [];
      if (weatherData !== "Invalid Location") {
        dialog.close();
        console.log(weatherData);
        weatherArray = parseWeatherData(weatherData);
      } else {
        console.log("Invalid Location");
        askForInput();
      }
      return weatherArray;
    })
    .then((weatherArray) => {
      if (weatherArray.length != 0) {
        displayWeather(weatherArray);
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
    return "Invalid Location";
  }

  return weatherData;
}

function parseWeatherData(weatherData) {
  const days = [];
  for (let i = 0; i < 6; i++) {
    if (i > 0) {
      const temp = weatherData.forecast.forecastday[i - 1].day.avgtemp_f;
      const condition = weatherData.forecast.forecastday[i - 1].day.condition;
      const minTemp = weatherData.forecast.forecastday[i - 1].day.mintemp_f;
      const maxTemp = weatherData.forecast.forecastday[i - 1].day.maxtemp_f;
      days[i] = {
        temp,
        condition,
        minTemp,
        maxTemp,
      };
    } else {
      const temp = weatherData.current.temp_f;
      const condition = weatherData.current.condition;
      const feelsLike = weatherData.current.feelslike_f;
      const windMPH = weatherData.current.wind_mph;
      const uv = weatherData.current.uv;
      const humidity = weatherData.current.humidity;

      days[0] = { temp, condition, feelsLike, windMPH, uv, humidity };
    }
  }
  return days;
}

function askForInput() {
  dialog.show();
}

const dialog = document.querySelector("dialog");
const enterButton = document.querySelector("button");
enterButton.addEventListener("click", () => {
  getUserInput(document.getElementById("location").value);
});

function displayWeather(weatherArray) {
  displayCurrentWeather(weatherArray[0]);
  displayForecast(weatherArray);
}

function displayCurrentWeather(currentObject) {
  const obTemp = currentObject.temp;
  const obCondition = currentObject.condition;
  const obFeelsLike = currentObject.feelsLike;
  const obWindMPH = currentObject.windMPH;
  const obUV = currentObject.uv;
  const obHumidity = currentObject.humidity;
  document.getElementById("curr-temp").textContent = obTemp + "°F";
  document.getElementById("feels-like").textContent =
    "feels like: " + obFeelsLike + "°F";
  document.getElementById("condition").textContent = obCondition.text;
  document.getElementById("wind").textContent = "wind: " + obWindMPH + " mph";
  document.getElementById("humidity").textContent =
    "humidity: " + obHumidity + "%";
  document.getElementById("uv").textContent = "uv: " + obUV;
}

function displayForecast(weatherArray) {
  for (let i = 1; i < weatherArray.length; i++) {
    const obTemp = weatherArray[i].temp;
    const obCondition = weatherArray[i].condition;
    const obMinTemp = weatherArray[i].minTemp;
    const obMaxTemp = weatherArray[i].maxTemp;
    document.getElementById("temp"+i).textContent = obTemp;
    document.getElementById("min"+i).textContent = obMinTemp;
    document.getElementById("condition"+i).textContent = obCondition.text;
    document.getElementById("max"+i).textContent = obMaxTemp;
  }
}

askForInput();

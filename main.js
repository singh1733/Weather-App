function getUserInput(location) {
  getWeather(location).then((weatherData) => {
    console.log(weatherData);
    parseWeatherData( weatherData);
  });
}

async function getWeather(location) {
  const response = await fetch(
    "https://api.weatherapi.com/v1/forecast.json?key=3c559f8d37c146e887a191047241906&q=" +
      location +
      "&days=7",
    { mode: "cors" }
  );
  const weatherData = await response.json();
  return weatherData;
}

function parseWeatherData(weatherData) {
  const days = [];
  for (let i = 0; i < 8; i++) {
    if (i > 0) {
      const temp = weatherData.forecast.forecastday[i].day.avgtemp_f;
      const condition = weatherData.forecast.forecastday[i].day.condition;
      const minTemp = weatherData.forecast.forecastday[i].day.mintemp_f;
      const maxTemp = weatherData.forecast.forecastday[i].day.maxtemp_f;
      const windMPH = weatherData.forecast.forecastday[i].day.wind_mph;
      const chanceOfRain =
        weatherData.forecast.forecastday[i].daily_chance_of_rain;
      const humidity = weatherData.forecast.forecastday[i].day.avghumidity;
      days[i] = {
        temp,
        condition,
        minTemp,
        maxTemp,
        windMPH,
        chanceOfRain,
        humidity,
      };
    } else {
      const temp = weatherData.current.temp_f;
      const condition = weatherData.current.condition;
      const feelsLike = weatherData.current.feelslike_f;
      const windMPH = weatherData.current.wind_mph;
      const uv = weatherData.current.uv;
      const humidity = weatherData.current.avghumidity;

      days[0] = { temp, condition, feelsLike, windMPH, uv, humidity };
    }
  }
  return days;
}

const enterButton=document.querySelector("button");
enterButton.addEventListener("click",()=>getUserInput(document.getElementById("location").value))
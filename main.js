function getUserInput() {
  const location = "44087";
  getWeather(location).then((weatherData) => {
    console.log(weatherData);
    parseWeatherData("forecast", weatherData, 0);
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

function parseWeatherData(type, weatherData, dayNumber) {
  if (type === "forecast") {
    const temp = weatherData.forecast.forecastday[dayNumber].day.avgtemp_f;
    const condition = weatherData.forecast.forecastday[dayNumber].day.condition;
    const minTemp = weatherData.forecast.forecastday[dayNumber].day.mintemp_f;
    const maxTemp = weatherData.forecast.forecastday[dayNumber].day.maxtemp_f;
    const windMPH = weatherData.forecast.forecastday[dayNumber].day.wind_mph;
    const chanceOfRain =
      weatherData.forecast.forecastday[dayNumber].daily_chance_of_rain;
    const humidity =
      weatherData.forecast.forecastday[dayNumber].day.avghumidity;
    return {
      temp,
      condition,
      minTemp,
      maxTemp,
      windMPH,
      chanceOfRain,
      humidity,
    };
  } else if (type === "current") {
    const temp = weatherData.forecast.forecastday[dayNumber].day.temp_f;
    const condition = weatherData.forecast.forecastday[dayNumber].day.condition;
    const feelsLike =
      weatherData.forecast.forecastday[dayNumber].day.feelslike_f;
    const windMPH = weatherData.forecast.forecastday[dayNumber].day.wind_mph;
    const uv = weatherData.forecast.forecastday[dayNumber].uv;
    const humidity =
      weatherData.forecast.forecastday[dayNumber].day.avghumidity;

    return { temp, condition, feelsLike, windMPH, uv, humidity };
  }
}

getUserInput();

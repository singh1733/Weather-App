async function getWeather(location) {
  const response = await fetch(
    "https://api.weatherapi.com/v1/current.json?key=3c559f8d37c146e887a191047241906&q=" +
      location,
    { mode: "cors" }
  );
  const weatherData = await response.json();
  return weatherData;
}

getWeather("twinsburg");

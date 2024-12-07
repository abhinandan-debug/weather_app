const apiKey = "7d5e74e7b112e34001dc87b79a2fc7c3";
const apiUrl =
  "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const airQualityUrl =
  "https://api.openweathermap.org/data/2.5/air_pollution?";
const oneCallUrl =
  "https://api.openweathermap.org/data/2.5/onecall?";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");

async function checkWeather(city) {
  const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

  if (response.status == 404) {
    document.querySelector(".error").style.display = "block";
    document.querySelector(".weather").style.display = "none";
  } else {
    const data = await response.json();

    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".temp").innerHTML =
      Math.round(data.main.temp) + "°C";
    document.querySelector(".humidity").innerHTML =
      data.main.humidity + " %";
    document.querySelector(".wind").innerHTML =
      data.wind.speed + " km/h";

    if (data.weather[0].main == "Clouds") {
      weatherIcon.src = "img/clouds.png";
    } else if (data.weather[0].main == "Clear") {
      weatherIcon.src = "img/clear.png";
    } else if (data.weather[0].main == "Rain") {
      weatherIcon.src = "img/rain.png";
    } else if (data.weather[0].main == "Drizzle") {
      weatherIcon.src = "img/drizzle.png";
    } else if (data.weather[0].main == "Mist") {
      weatherIcon.src = "img/mist.png";
    }


    const lat = data.coord.lat;
    const lon = data.coord.lon;
    checkAQI(lat, lon);
    checkUV(lat, lon);

    document.querySelector(".weather").style.display = "block";
    document.querySelector(".error").style.display = "none";
  }
}

async function checkAQI(lat, lon) {
  const response = await fetch(
    airQualityUrl + `lat=${lat}&lon=${lon}&appid=${apiKey}`
  );

  const data = await response.json();
  const aqi = data.list[0].main.aqi;
  let aqiText;

  switch (aqi) {
    case 1:
      aqiText = "Good";
      break;
    case 2:
      aqiText = "Fair";
      break;
    case 3:
      aqiText = "Moderate";
      break;
    case 4:
      aqiText = "Poor";
      break;
    case 5:
      aqiText = "Very Poor";
      break;
    default:
      aqiText = "Unknown";
  }

  document.querySelector(".aqi").innerHTML = `AQI: ${aqi} (${aqiText})`;
}

async function checkUV(lat, lon) {
  const response = await fetch(
    oneCallUrl + `lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily&appid=${apiKey}`
  );

  const data = await response.json();
  const uvIndex = data.current.uvi;

  document.querySelector(".uv").innerHTML = `UV Index: ${uvIndex}`;
}
searchBtn.addEventListener("click", () => {
  checkWeather(searchBox.value);
});

searchBox.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    checkWeather(searchBox.value);
  }
});
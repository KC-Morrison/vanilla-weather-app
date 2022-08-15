function formatDate(timestamp) {
	let date = new Date(timestamp);
	let hours = date.getHours();
	if (hours < 10) {
		hours = `0${hours}`;
	}
	let minutes = date.getMinutes();
	if (minutes < 10) {
		minutes = `0${minutes}`;
	}
	let days = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
	];
	let day = days[date.getDay()];
	return `${day} ${hours}:${minutes}`;
}

function displayForecast(response) {
	//receives the response from the API call to get forecast data
	console.log(response.data.daily);
	let forecastElement = document.querySelector("#forecast"); //target the HTML element
	let forecastHTML = `<div class="row">`; //we want this to be a row because we want a grid
	let days = ["Thu", "Fri", "Sat"];
	days.forEach(function (day) {
		forecastHTML = //now we inject the HTML
			forecastHTML +
			`
          <div class="col-2">
            <div class="weather-forecast-date">${day}</div>
            <img src="https://ssl.gstatic.com/onebox/weather/64/partly_cloudy.png" />
            <div class="weather-forecast-tmperatures">
              <span class="weather-forecast-temperature-min">12°</span>
              <span class="weather-forecast-temperature-max">18°</span>
            </div>
          </div>
          
        `;
	});

	forecastHTML = forecastHTML + `</div>`;
	forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
	//this function makes the API call to get the forecast
	//console.log(coordinates);
	let apiKey = "8ccf37f47c78fce7cbde0d0a29369196";
	let apiUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
	//console.log(apiUrl);
	axios.get(apiUrl).then(displayForecast);
}

function displayTemperature(response) {
	let temperatureElement = document.querySelector("#temperature");
	let cityElement = document.querySelector("#city");
	let descriptionElement = document.querySelector("#description");
	let humidityElement = document.querySelector("#humidity");
	let windElement = document.querySelector("#wind");
	let dateElement = document.querySelector("#date");
	let iconElement = document.querySelector("#icon");
	let lowElement = document.querySelector("#low");
	let highElement = document.querySelector("#high");
	celsiusTemperature = response.data.main.temp;
	temperatureElement.innerHTML = Math.round(celsiusTemperature);
	cityElement.innerHTML = response.data.name;
	descriptionElement.innerHTML = response.data.weather[0].description;
	humidityElement.innerHTML = response.data.main.humidity;
	windElement.innerHTML = Math.round(response.data.wind.speed);
	dateElement.innerHTML = formatDate(response.data.dt * 1000); //gets the date-time (dt) from the weather API and converts to milliseconds and sends it to the formatDate function
	iconElement.setAttribute(
		"src",
		`http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
	);
	iconElement.setAttribute("alt", response.data.weather[0].description);
	lowElement.innerHTML = Math.round(response.data.main.temp_min);
	highElement.innerHTML = Math.round(response.data.main.temp_max);

	getForecast(response.data.coord); //we need to get the coordinates for city to do the forecast API call
}

function search(city) {
	let apiKey = "8ccf37f47c78fce7cbde0d0a29369196";
	let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
	//console.log(apiUrl);
	axios.get(apiUrl).then(displayTemperature);
}

function handleSubmit(event) {
	event.preventDefault();
	let cityInputElement = document.querySelector("#city-input");
	search(cityInputElement.value); //calls the search function and sends it the value typed in to the search bar
}

function displayFahrenheitTemperature(event) {
	event.preventDefault();
	let temperatureElement = document.querySelector("#temperature");
	celsiusLink.classList.remove("active"); //removes the active class from the C so that it looks like a link again
	fahrenheitLink.classList.add("active"); //adds the active class to the F so it doesn't look like a link
	let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
	temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
}

function displayCelsiusTemperature(event) {
	event.preventDefault();
	celsiusLink.classList.add("active"); //adds the active class to the C so it doesn't look like a link
	fahrenheitLink.classList.remove("active"); //removes the active class from the F so it looks like a link
	let temperatureElement = document.querySelector("#temperature");
	temperatureElement.innerHTML = Math.round(celsiusTemperature);
}

let celsiusTemperature = null;

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

search("Sydney"); //this calls the search function on load and sends it the value Sydney

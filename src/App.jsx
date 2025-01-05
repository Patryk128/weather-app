import { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import WeatherIcon from "./WeatherIcon.jsx";
import BackgroundWrapper from "./BackgroundWrapper.jsx";
import Modal from "./Modal.jsx";
import "./App.css";

const App = () => {
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState("");
  const [isInputVisible, setIsInputVisible] = useState(true);
  const [selectedDayDetails, setSelectedDayDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const API_KEY = import.meta.env.VITE_API_KEY;

  const roundToNearestHalf = (value) => Math.round(value * 2) / 2;

  const fetchWeather = async (selectedCity) => {
    const cityName = selectedCity || city;
    if (!cityName) {
      setError("Enter city name");
      return;
    }

    setError("");
    try {
      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${API_KEY}`
      );
      if (!weatherResponse.data || !weatherResponse.data.main) {
        setError("City not found. Try again.");
        setWeather(null);
        setForecast([]);
        return;
      }
      const weatherData = weatherResponse.data;
      weatherData.main.temp = roundToNearestHalf(weatherData.main.temp);
      setWeather(weatherData);

      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&cnt=40&appid=${API_KEY}`
      );
      const dailyForecasts = {};
      forecastResponse.data.list.forEach((entry) => {
        const date = entry.dt_txt.split(" ")[0];
        if (!dailyForecasts[date]) {
          dailyForecasts[date] = {
            minTemp: entry.main.temp,
            maxTemp: entry.main.temp,
            icon: entry.weather[0].icon,
            date: date,
            hourly: [],
          };
        } else {
          dailyForecasts[date].minTemp = Math.min(
            dailyForecasts[date].minTemp,
            entry.main.temp
          );
          dailyForecasts[date].maxTemp = Math.max(
            dailyForecasts[date].maxTemp,
            entry.main.temp
          );
        }
        dailyForecasts[date].hourly.push(entry);
      });

      setForecast(Object.values(dailyForecasts).slice(0, 5));
      setSuggestions([]);
    } catch {
      setError("City not found. Try again.");
      setWeather(null);
      setForecast([]);
    }
  };

  const fetchSuggestions = async (query) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await axios.get(
        `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`
      );
      setSuggestions(response.data);
    } catch {
      setSuggestions([]);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setCity(value);
    fetchSuggestions(value);
  };

  const handleSuggestionClick = (suggestedCity) => {
    setCity(suggestedCity);
    fetchWeather(suggestedCity);
  };

  const handleDayClick = (day) => {
    setSelectedDayDetails(day.hourly);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDayDetails(null);
  };

  return (
    <BackgroundWrapper weatherDescription={weather?.weather[0]?.description}>
      <div className="App">
        <header
          className={`App-header ${weather ? "city-entered" : "no-city"}`}
        >
          <h1 onClick={() => weather && setIsInputVisible((prev) => !prev)}>
            {weather ? (
              <span>
                {weather.name}, {weather.sys.country}{" "}
                <span className="temperature">{weather.main.temp}°C</span>
              </span>
            ) : (
              "Weather App"
            )}
          </h1>
          {(isInputVisible || !weather) && (
            <div
              className={`input-container ${
                isInputVisible ? "visible" : "hidden"
              }`}
            >
              <input
                type="text"
                placeholder="Enter city name"
                value={city}
                onChange={handleInputChange}
                className="city-input"
              />
              <button onClick={() => fetchWeather()} className="search-button">
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </div>
          )}
          <ul className="suggestions">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => handleSuggestionClick(suggestion.name)}
              >
                {suggestion.name}, {suggestion.country}
              </li>
            ))}
          </ul>
          {error && <p className="error">{error}</p>}
          {weather && (
            <div className="weather-info">
              <p className="humidity">Humidity: {weather.main.humidity}%</p>
              <div className="weather-info-description">
                <p className="condition">
                  Condition: {weather.weather[0].description}
                </p>
                <WeatherIcon
                  iconCode={weather.weather[0].icon}
                  colored={true}
                />
              </div>
            </div>
          )}
          {forecast.length > 0 && (
            <div className="forecast">
              <div className="forecast-container">
                {forecast.map((day, index) => (
                  <div
                    key={index}
                    className="forecast-day"
                    onClick={() => handleDayClick(day)}
                  >
                    <p>{new Date(day.date).toLocaleDateString()}</p>
                    <WeatherIcon iconCode={day.icon} colored={true} />
                    <p>
                      {roundToNearestHalf(day.minTemp)}°C /{" "}
                      {roundToNearestHalf(day.maxTemp)}°C
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </header>
        {isModalOpen && (
          <Modal onClose={closeModal}>
            <h3>Hourly Forecast</h3>
            <div className="hourly-container">
              {selectedDayDetails.map((entry, index) => (
                <div key={index} className="hourly-entry">
                  <p>
                    {new Date(entry.dt_txt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <WeatherIcon
                    iconCode={entry.weather[0].icon}
                    colored={true}
                  />
                  <p>{roundToNearestHalf(entry.main.temp)}°C</p>
                </div>
              ))}
            </div>
          </Modal>
        )}
      </div>
    </BackgroundWrapper>
  );
};

export default App;

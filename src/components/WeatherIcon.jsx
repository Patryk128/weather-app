import "weather-icons/css/weather-icons.css";

const WeatherIcon = ({ iconCode }) => {
  const getWeatherIcon = (iconCode) => {
    const iconMap = {
      "01d": "wi-day-sunny",
      "01n": "wi-night-clear",
      "02d": "wi-day-cloudy",
      "02n": "wi-night-cloudy",
      "03d": "wi-cloud",
      "03n": "wi-cloud",
      "04d": "wi-cloudy",
      "04n": "wi-cloudy",
      "09d": "wi-showers",
      "09n": "wi-showers",
      "10d": "wi-day-rain",
      "10n": "wi-night-rain",
      "11d": "wi-thunderstorm",
      "11n": "wi-thunderstorm",
      "13d": "wi-snow",
      "13n": "wi-snow",
      "50d": "wi-fog",
      "50n": "wi-fog",
    };
    return iconMap[iconCode] || "wi-na";
  };

  const iconClass = getWeatherIcon(iconCode);

  return <i className={`wi ${iconClass} weather-icon`}></i>;
};

export default WeatherIcon;

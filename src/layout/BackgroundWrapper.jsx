import PropTypes from "prop-types";
import "../Styles/BackgroundWrapper.css";

const BackgroundWrapper = ({ weatherDescription, children }) => {
  const getBackgroundStyle = () => {
    if (!weatherDescription) return "default";

    const description = weatherDescription.toLowerCase();

    if (description.includes("rain")) {
      return "rainy";
    } else if (description.includes("cloud")) {
      return "cloudy";
    } else if (description.includes("clear")) {
      return "sunny";
    } else if (description.includes("snow")) {
      return "snowy";
    } else if (description.includes("thunderstorm")) {
      return "stormy";
    } else if (description.includes("drizzle")) {
      return "drizzly";
    } else if (
      description.includes("mist") ||
      description.includes("haze") ||
      description.includes("fog")
    ) {
      return "misty";
    } else if (
      description.includes("smoke") ||
      description.includes("dust") ||
      description.includes("sand") ||
      description.includes("ash")
    ) {
      return "dusty";
    } else if (description.includes("squall")) {
      return "windy";
    } else if (description.includes("tornado")) {
      return "tornado";
    } else {
      return "default";
    }
  };

  return (
    <div className={`background-wrapper ${getBackgroundStyle()}`}>
      {children}
    </div>
  );
};

BackgroundWrapper.propTypes = {
  weatherDescription: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default BackgroundWrapper;

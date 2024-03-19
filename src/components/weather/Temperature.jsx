import "./weather.css";

export default function Temperature({ temp, tempUnit, temperatureToggle }) {
  return (
    <div onClick={temperatureToggle} className="weather-temp">
      {temp}
      {tempUnit}
    </div>
  );
}

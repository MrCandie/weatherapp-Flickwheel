import "./weather.css";

export default function HumidityAndWindspeed({
  initial,
  data,
  detail,
  speed,
  unit,
  setSpeed,
  setUnit,
}) {
  return (
    <div className="data-container">
      <ReusableElement
        title="Humidity"
        text={`${
          initial
            ? data?.main?.humidity
            : detail?.current
            ? detail?.current?.humidity
            : 0
        }%`}
        src="/humidity.png"
      />
      <ReusableElement
        onClick={() => {
          const speed = initial
            ? data?.wind?.speed
            : detail?.current?.wind_speed;
          if (unit === "m/hr") {
            setSpeed(speed);
            setUnit("km/hr");
          } else {
            setSpeed(speed * 1000);
            setUnit("m/hr");
          }
        }}
        title="Wind Speed"
        text={`${speed ? speed : 0} ${unit}`}
        src="/wind.png"
      />
    </div>
  );
}

function ReusableElement({ title, text, src, onClick }) {
  return (
    <div onClick={onClick} className="element">
      <img src={src} alt="" />
      <div className="data">
        <div className="humidity-percent">{text}</div>
        <div className="text">{title}</div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import axios from "axios";
import "./weather.css";
import { toast } from "react-toastify";

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

export default function Weather() {
  const api_key = "ddb927e66d09d3cc100d73bf4ddad767";
  const open_weather_api_key = "0656a9ce39cdaae77b2656c4cc70e069";

  // state to get entered search value
  const [search, setSearch] = useState("");

  // state to store user weather information
  const [data, setData] = useState("");

  // state to store search location's weather information
  const [detail, setDetail] = useState("");

  // state to check if the user searched for a location or it is the users location
  const [initial, setInitial] = useState(true);

  // state for wind speed
  const [speed, setSpeed] = useState("");

  // state for wind speed unit
  const [unit, setUnit] = useState("km/hr");

  //state for temperature unit
  const [tempUnit, setTempUnit] = useState("°C");

  // state for temperature
  const [temp, setTemp] = useState("");

  // state for temperature icon
  const [src, setSrc] = useState("");

  useEffect(() => {
    if (initial) {
      if (data?.weather[0].icon === "01d" || data?.weather[0].icon === "01n") {
        setSrc("/clear.png");
      } else if (
        data?.weather[0].icon === "02d" ||
        data?.weather[0].icon === "02n"
      ) {
        setSrc("/cloud.png");
      } else if (
        data?.weather[0].icon === "03d" ||
        data?.weather[0].icon === "03n"
      ) {
        setSrc("/drizzle.png");
      } else if (
        data?.weather[0].icon === "04d" ||
        data?.weather[0].icon === "04n"
      ) {
        setSrc("/drizzle.png");
      } else if (
        data?.weather[0].icon === "09d" ||
        data?.weather[0].icon === "09n"
      ) {
        setSrc("/rain.png");
      } else if (
        data?.weather[0].icon === "10d" ||
        data?.weather[0].icon === "10n"
      ) {
        setSrc("/rain.png");
      } else if (
        data?.weather[0].icon === "13d" ||
        data?.weather[0].icon === "13n"
      ) {
        setSrc("/snow.png");
      } else {
        setSrc("/clear.png");
      }
    } else {
      setSrc(detail?.current?.weather_icons[0]);
    }
  }, [data, initial, detail]);

  useEffect(() => {
    setSpeed(initial ? data?.wind?.speed : detail?.current?.wind_speed);
  }, [data, detail, initial]);

  useEffect(() => {
    setTemp(
      initial
        ? data?.main?.temp
          ? Math.round(+data?.main?.temp - 273.15)
          : 0
        : detail?.current?.temperature
    );
  }, [data, detail, initial]);

  // user's location weather information
  useEffect(() => {
    async function fetchData() {
      try {
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const lat = position.coords.latitude;
              const lng = position.coords.longitude;
              const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${open_weather_api_key}`,
                {
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              );
              const data = response.data;
              setData(data);
              setInitial(true);
            },
            (error) => {
              toast.error("Error getting user location:", error);
            }
          );
        } else {
          toast.error("Geolocation is not supported by this browser.");
        }
      } catch (error) {
        toast.error(error?.response?.data.message || "something went wrong");
      }
    }
    fetchData();
  }, []);

  async function forecastHandler() {
    try {
      const response = await axios.get(
        `http://api.weatherstack.com/forecast?access_key=${api_key}&query=New York&forecast_days=1&hourly=1`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = response.data;
    } catch (error) {
      toast?.error(error?.response?.data.message || "something went wrong");
    }
  }

  async function searchHandler() {
    if (!search) {
      toast.warning("Enter a valid address");
      return;
    }
    try {
      const response = await axios.get(
        `http://api.weatherstack.com/current?access_key=${api_key}&query=${search}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = response.data;
      setDetail(data);
      setUnit("km/hr");
      setTempUnit("°C");
      setInitial(false);
      toast.success("Successful");
      setSearch("");
    } catch (error) {
      toast.error(error?.response?.data.message || "something went wrong");
    }
  }

  return (
    <div className="container">
      <div className="search">
        <input
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          type="text"
          placeholder="Search Address"
        />
        <button onClick={searchHandler}>
          <img src="/search.png" alt="search" />
        </button>
      </div>

      <div className="weather-image">
        <img src={src} alt="weather image" />
      </div>

      <div
        onClick={() => {
          const initialTemp = initial
            ? data?.main?.temp
              ? Math.round(+data?.main?.temp - 273.15)
              : 0
            : detail?.current?.temperature;
          if (tempUnit === "°C") {
            const fahrent = initial * 1.8 + 32;
            setTemp(fahrent);
            setTempUnit("°F");
          } else {
            setTemp(initialTemp);
            setTempUnit("°C");
          }
        }}
        className="weather-temp"
      >
        {temp}
        {tempUnit}
      </div>
      <div onClick={forecastHandler} className="weather-descriptions">
        {initial
          ? data?.weather
            ? data?.weather[0]?.description
            : ""
          : detail?.current?.weather_descriptions[0]}
      </div>

      <div className="weather-location">
        {initial ? data?.name : detail?.location?.name},{" "}
        {initial ? data?.sys?.country : detail?.location?.country}
      </div>

      <div className="data-container">
        <ReusableElement
          title="Humidity"
          text={`${
            initial ? data?.main?.humidity : detail?.current?.humidity
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
          text={`${speed} ${unit}`}
          src="/wind.png"
        />
      </div>
    </div>
  );
}

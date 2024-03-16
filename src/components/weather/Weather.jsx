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
  const [search, setSearch] = useState("");
  const [data, setData] = useState("");
  const [detail, setDetail] = useState("");
  const [initial, setInitial] = useState(true);
  const [speed, setSpeed] = useState("");
  const [unit, setUnit] = useState("km/hr");
  const [tempUnit, setTempUnit] = useState("°C");
  const [temp, setTemp] = useState("");
  const [src, setSrc] = useState("");

  useEffect(() => {
    const initialTemp = initial
      ? data?.main?.temp
        ? Math.round(+data?.main?.temp - 273.15)
        : 0
      : detail?.current?.temperature;

    if (initialTemp <= 0) {
      setSrc("/snow.png");
    } else if (initialTemp > 25 && initialTemp <= 30) {
      setSrc("/cloud.png");
    } else if (initialTemp > 1 && initialTemp <= 25) {
      setSrc("/rain.png");
    } else if (initialTemp > 30) {
      setSrc("/clear.png");
    }
    console.log(initialTemp);
  }, [data, initial, detail]);

  console.log(src);

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
              console.error("Error getting user location:", error);
            }
          );
        } else {
          console.error("Geolocation is not supported by this browser.");
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
      console.log(data);
    } catch (error) {
      toast?.error(error?.response?.data.message || "something went wrong");
    }
  }

  async function searchHandler() {
    if (!search) {
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
          placeholder="Search"
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
            console.log(123);
            const speed = initial
              ? data?.wind?.speed
              : detail?.current?.wind_speed;
            if (unit === "m/hr") {
              console.log(speed);
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

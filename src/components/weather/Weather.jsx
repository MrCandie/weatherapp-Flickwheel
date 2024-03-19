import { useEffect, useState } from "react";
import axios from "axios";
import "./weather.css";
import { toast } from "react-toastify";
import Search from "./Search";
import HumidityAndWindspeed from "./HumidityAndWindspeed";
import Temperature from "./Temperature";

// ps: i had to use two weather api provider

// openweather to get user's current weather information (BECAUSE THE QUERY ALLOWS FOR THE USERS LATITUDE AND LONGITUDE, and weatherstack only takes in the city name as query)

// weatherstack to get weather information for the location searched for

export default function Weather() {
  const weather_stack_api_key = "ddb927e66d09d3cc100d73bf4ddad767";
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

  // weather icons
  useEffect(() => {
    if (initial) {
      if (data?.weather) {
        if (
          data?.weather[0]?.icon === "01d" ||
          data?.weather[0].icon === "01n"
        ) {
          setSrc("/clear.png");
        } else if (
          data?.weather[0]?.icon === "02d" ||
          data?.weather[0].icon === "02n"
        ) {
          setSrc("/cloud.png");
        } else if (
          data?.weather[0]?.icon === "03d" ||
          data?.weather[0]?.icon === "03n"
        ) {
          setSrc("/drizzle.png");
        } else if (
          data?.weather[0]?.icon === "04d" ||
          data?.weather[0]?.icon === "04n"
        ) {
          setSrc("/drizzle.png");
        } else if (
          data?.weather[0]?.icon === "09d" ||
          data?.weather[0]?.icon === "09n"
        ) {
          setSrc("/rain.png");
        } else if (
          data?.weather[0]?.icon === "10d" ||
          data?.weather[0]?.icon === "10n"
        ) {
          setSrc("/rain.png");
        } else if (
          data?.weather[0]?.icon === "13d" ||
          data?.weather[0]?.icon === "13n"
        ) {
          setSrc("/snow.png");
        } else {
          setSrc("/clear.png");
        }
      } else {
        setSrc(detail?.current?.weather_icons[0]);
      }
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

  async function searchHandler() {
    if (!search) {
      toast.warning("Enter a valid address");
      return;
    }
    try {
      const response = await axios.get(
        `http://api.weatherstack.com/current?access_key=${weather_stack_api_key}&query=${search}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = response.data;
      if (data?.success === false) {
        toast.error(data?.error?.info);
        return;
      }
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

  function temperatureToggle() {
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
  }

  return (
    <>
      <div>Click on temperature and wndspeed to toggle their units</div>
      <div className="container">
        <Search
          search={search}
          setSearch={setSearch}
          searchHandler={searchHandler}
        />

        <div className="weather-image">
          <img src={src} alt="weather image" />
        </div>

        <Temperature
          temp={temp}
          tempUnit={tempUnit}
          temperatureToggle={temperatureToggle}
        />
        <div className="weather-descriptions">
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

        <HumidityAndWindspeed
          initial={initial}
          data={data}
          detail={detail}
          speed={speed}
          setSpeed={setSpeed}
          unit={unit}
          setUnit={setUnit}
        />
      </div>
    </>
  );
}

import useGeolocation from "./hooks/useGeolocation";
import LocationDisplay from "./components/location/locationDisplay";
import WeatherDisplay from "./components/weather/weatherDisplay";
import useWeather from "./hooks/useWeather";

const Home = () => {
  useGeolocation();
  useWeather();

  return (
    <div className="home-container">
      <div className="info-container" style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "20px" }}>
        <WeatherDisplay />
        <LocationDisplay />
      </div>
    </div>
  );
};


export default Home;
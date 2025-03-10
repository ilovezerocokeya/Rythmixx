import useGeolocation from "./hooks/useGeolocation";
import LocationDisplay from "./components/location/locationDisplay";
import WeatherDisplay from "./components/weather/weatherDisplay";
import useWeather from "./hooks/useWeather";
import WeatherBackground from "./components/ui/weatherBackground";
import { useWeatherStore } from "./stores/useWeatherStore";

const Home = () => {
  useGeolocation();
  useWeather();
  
  const { weather, timeOfDay } = useWeatherStore();
  const nickname = "zerocokeya";

  // 날씨와 시간대에 따른 글자색 반환
const getTextColor = (weather: string | null, timeOfDay: string) => {
  if (timeOfDay === "night") return "#ffffff"; // 밤에는 흰색
  if (weather === "Rain" || weather === "Snow" || weather === "Clouds") return "#222"; // 비/눈/흐림은 어두운 색
  return "#000"; // 맑을 때 검정색
};


  return (
    <div className="home-container">
      <WeatherBackground />
      <div className="info-container" style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "20px" }}>
        <h1 className="greeting" style={{ color: getTextColor(weather, timeOfDay) }}>
          Hello! {nickname}
        </h1>
        <WeatherDisplay />
        <LocationDisplay />
      </div>
    </div>
  );
};


export default Home;
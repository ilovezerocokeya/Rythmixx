import { useWeatherStore } from "@/stores/useWeatherStore";


const WeatherDisplay = () => {
  const { weather } = useWeatherStore();

  console.log("현재 날씨 상태:", weather);

  
  const getWeatherEmoji = (weather: string | null) => {
    switch (weather) {
      case "Clear":
        return "☀️"; // 맑음
      case "Clouds":
        return "☁️"; // 구름
      case "Rain":
        return "🌧️"; // 비
      case "Snow":
        return "❄️"; // 눈
      case "Thunderstorm":
        return "⛈️"; // 천둥
      default:
        return "❓"; // 알 수 없음
    }
  };

  return (
    <div>
      <h1>현재 날씨</h1>
      <p style={{ fontSize: "2rem" }}>{getWeatherEmoji(weather)}</p>
    </div>
  );
};

export default WeatherDisplay;
import { useWeatherStore } from "../../stores/useWeatherStore";

// 현재 날씨 상태를 화면에 표시
const WeatherDisplay = () => {
  const { weather, timeOfDay, temperature } = useWeatherStore();

  // 날씨에 따라 적절한 이모지 반환
  const getWeatherEmoji = () => {
    if (!weather) return "⏳"; // 날씨 정보가 없을 때 로딩 표시

    if (timeOfDay === "night") {
      // 밤일 때
      if (weather === "Rain") return "🌧️"; // 비
      if (weather === "Snow") return "❄️"; // 눈
      return "🌙"; // 기본값: 맑은 밤
    } else {
      // 낮일 때
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
    }
  };

  return (
  <div className="flex items-center gap-4 md:gap-6">
    <span className="text-3xl md:text-4xl">{getWeatherEmoji()}</span>
    <span className="text-lg md:text-xl font-bold text-red-500">
      {temperature !== null ? `${temperature.toFixed(1)}°C` : "온도 정보를 가져오는 중..."}
    </span>
  </div>
  );
};
export default WeatherDisplay;
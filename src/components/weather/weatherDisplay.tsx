import { useCallback } from "react";
import { useWeatherStore } from "../../stores/useWeatherStore";

// 현재 날씨 상태를 화면에 표시
const WeatherDisplay = () => {
  const { weather } = useWeatherStore();

  const weatherEmoji = useCallback(() => {
    if (!weather) return ""; // 날씨 정보가 없을 때 로딩 표시

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
        return ""; // 기본값 (로딩)
    }
  }, [weather]); // weather 값이 변경될 때만 재계산

  return (
    <div className="flex items-center gap-4 md:gap-6">
      <span className="text-3xl md:text-4xl">{weatherEmoji()}</span>
    </div>
  );
};

export default WeatherDisplay;
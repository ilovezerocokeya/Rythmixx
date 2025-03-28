import { useMemo } from "react";
import { useWeatherStore } from "../../stores/useWeatherStore";

// 현재 날씨 상태를 화면에 표시
const WeatherDisplay = () => {
  const { weather, timeOfDay } = useWeatherStore();

  const weatherEmoji = useMemo(() => {
    if (!weather) return ""; // 날씨 정보가 없을 때 로딩 표시

    if (timeOfDay === "night") {
      if (weather === "Rain") return "🌧️"; // 비
      if (weather === "Snow") return "❄️"; // 눈
      if (weather === "Clouds") return "☁️🌙"; // 구름 
      return "🌙"; // 기본값: 맑은 밤
    }

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
        return "⛈️"; // 천둥번개
      default:
        return ""; // 알 수 없음
    }
  }, [weather, timeOfDay]); // weather, timeOfDay 값이 변경될 때만 재계산

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm">{weatherEmoji}</span>
    </div>
  );
};

export default WeatherDisplay;
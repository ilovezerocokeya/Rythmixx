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
    <div style={styles.container}>
      <span style={styles.emoji}>{getWeatherEmoji()}</span>
      <span style={styles.temperature}>
        {temperature !== null ? `${temperature.toFixed(1)}°C` : "온도 정보를 가져오는 중..."}
      </span>
    </div>
  );
};

// 스타일 객체
const styles = {
  container: {
    display: "flex", // 좌우 정렬을 위한 flex 적용
    alignItems: "center", // 수직 가운데 정렬
    gap: "20px", // 요소 간 간격
  },
  emoji: {
    fontSize: "2rem",
  },
  temperature: {
    fontSize: "1.2rem",
    color: "red", // 온도는 빨간색으로 표시
    fontWeight: "bold",
  },
};

export default WeatherDisplay;
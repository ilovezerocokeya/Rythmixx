
import { useState, useEffect } from "react";
import { useWeatherStore } from "../../stores/useWeatherStore";
import useReverseGeocoding from '../../hooks/useReverseGeocoding';

// 배경 밝기에 따른 적절한 글자 색 반환 함수
const getTextColor = (weather: string | null, timeOfDay: string) => {
  if (timeOfDay === "night") {
    return "#fff"; // 밤이면 흰색 글자
  }

  switch (weather) {
    case "Clear":
      return "#000"; // 맑으면 검정색
    case "Clouds":
      return "#111"; // 흐리면 어두운 회색
    case "Rain":
    case "Drizzle":
      return "#ccc"; // 비 오면 밝은 회색
    case "Thunderstorm":
      return "#f8f8f8"; // 번개 치면 거의 흰색
    case "Snow":
      return "#222"; // 눈 오면 어두운 회색 (배경이 하얗기 때문)
    default:
      return "#000"; // 기본값 (맑음)
  }
};

// 위치 정보 표시 컴포넌트
const LocationDisplay = () => {
  const city = useReverseGeocoding();
  const { weather, timeOfDay } = useWeatherStore(); // 날씨 & 시간 정보 가져오기
  const [displayCity, setDisplayCity] = useState<string | null>(null);

  useEffect(() => {
    if (city) {
      setDisplayCity(city);
    }
  }, [city]);

  return (
    <div
      className="text-sm md:text-lg transition-colors duration-500 ease-in-out"
      style={{
        color: getTextColor(weather, timeOfDay), // 자동 글자색 설정
      }}
    >
      <p>{displayCity ? displayCity : "위치 정보를 가져오는 중..."}</p>
    </div>
  );
};

export default LocationDisplay;
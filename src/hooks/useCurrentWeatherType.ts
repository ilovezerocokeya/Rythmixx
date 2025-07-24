import { useWeatherStore } from "@/stores/useWeatherStore";

export const useCurrentWeatherType = () => {
  // 전역 상태에서 현재 날씨와 시간대 정보를 가져옴
  const { weather, timeOfDay } = useWeatherStore((state) => ({
    weather: state.weather,
    timeOfDay: state.timeOfDay,
  }));

  const normalized = (weather ?? "").toLowerCase(); // 날씨 값이 없을 경우를 대비하여 소문자로 변환

  // 외부 API에서 받은 날씨 값을 내부에서 사용할 키로 매핑
  const mapping: Record<string, string> = {
    clear: "clear",
    clouds: "clouds",
    rain: "rain",
    snow: "snow",
    thunderstorm: "thunderstorm",
  };

  const mapped = mapping[normalized] ?? "default";

  // 밤 시간대이고, 날씨가 맑거나 확인 불가능한 경우는 "night"으로 처리
  if (timeOfDay === "night" && (mapped === "clear" || mapped === "default")) {
    return "night";
  }

  // 그 외의 경우는 매핑된 날씨 타입 반환
  return mapped;
};
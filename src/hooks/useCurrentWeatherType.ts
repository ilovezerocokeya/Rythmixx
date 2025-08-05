import { useWeatherStore } from "@/stores/useWeatherStore";

export const useCurrentWeatherType = () => {
  const { weather, timeOfDay } = useWeatherStore((state) => ({
    weather: state.weather,
    timeOfDay: state.timeOfDay,
  }));

  const normalized = (weather ?? "").toLowerCase();

  const mapping: Record<string, string> = {
    clear: "clear",
    clouds: "clouds",
    rain: "rain",
    snow: "snow",
    thunderstorm: "thunderstorm",
  };

  const mapped = mapping[normalized] ?? "default";

  if (timeOfDay === "night" && (mapped === "clear" || mapped === "default")) {
    return "night";
  }

  return mapped;
};
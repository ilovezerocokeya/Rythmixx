import { useMemo } from "react";
import { useWeatherStore } from "@/stores/useWeatherStore";
import useReverseGeocoding from "@/hooks/useReverseGeocoding";

const WeatherDisplay = () => {
  const { weather, timeOfDay } = useWeatherStore();
  const city = useReverseGeocoding();

  const weatherEmoji = useMemo(() => {
    if (!weather) return "";
    if (timeOfDay === "night") {
      if (weather === "Rain") return "🌧️";
      if (weather === "Snow") return "❄️";
      return "🌙";
    }
    switch (weather) {
      case "Clear": return "☀️";
      case "Clouds": return "☁️";
      case "Rain": return "🌧️";
      case "Snow": return "❄️";
      case "Thunderstorm": return "⛈️";
      default: return "";
    }
  }, [weather, timeOfDay]);

  return (
    <div className="flex items-center px-2 py-0.5 bg-white/60 backdrop-blur-sm rounded-full shadow-sm">
      <span className="text-lg">{weatherEmoji}</span>
      <span className="ml-1 text-[12px] font-semibold text-neutral-500 tracking-tight leading-none">
        {city || "...⏳"}
      </span>
    </div>
  );
};

export default WeatherDisplay;
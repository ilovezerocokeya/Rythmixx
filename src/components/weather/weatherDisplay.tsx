import { useState, useMemo, useEffect } from "react";
import { useWeatherStore } from "@/stores/useWeatherStore";
import useReverseGeocoding from "@/hooks/useReverseGeocoding";

const WeatherDisplay = () => {
  const { weather, timeOfDay } = useWeatherStore();
  const [showLocation, setShowLocation] = useState(false);
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

  // 팝업 자동 닫기
  useEffect(() => {
    if (!showLocation) return;
    const timer = setTimeout(() => setShowLocation(false), 2000);
    return () => clearTimeout(timer);
  }, [showLocation]);

  return (
    <div className="relative">
      <span
        className="text-xl cursor-pointer"
        onClick={() => setShowLocation(true)}
      >
        {weatherEmoji}
      </span>

      {showLocation && (
      <div
        key={city}
        className="absolute top-10 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up"
      >
        <div className="relative px-5 py-2.5 flex items-center gap-1 text-sm text-blue-950 font-medium bg-[rgba(255,255,255,0.5)] border border-white/50 shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-md backdrop-saturate-150 rounded-2xl whitespace-nowrap">
          <div className="absolute top-[-6px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 rotate-45 bg-[rgba(255,255,255,0.5)] border-t border-l border-white/50 backdrop-blur-md backdrop-saturate-150 shadow" />
          <span className="text-base drop-shadow-sm">📍</span>
          <span className="drop-shadow-sm">{city || "위치 불러오는 중..."}</span>
        </div>
      </div>
    )}
    </div>
  );
};

export default WeatherDisplay;
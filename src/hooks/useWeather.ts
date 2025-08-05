import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useLocationStore } from "../stores/useLocationStore";
import { useWeatherStore } from "../stores/useWeatherStore";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const WEATHER_UPDATE_INTERVAL = 30 * 60 * 1000; // 30분
const RETRY_INTERVAL = 5 * 60 * 1000; // 5분
const MAX_RETRY_COUNT = 3;

const simplifyWeather = (weather: string, cloudiness: number) => {
  if (weather === "Clear") return cloudiness > 45 ? "Clouds" : "Clear";
  if (["Clouds", "Haze", "Mist", "Fog"].includes(weather)) return "Clouds";
  if (["Rain", "Drizzle"].includes(weather)) return "Rain";
  if (weather === "Snow") return "Snow";
  if (weather === "Thunderstorm") return "Thunderstorm";
  return "Clear";
};

const useWeather = () => {
  const { lat, lon } = useLocationStore();
  const { setWeather, setTimeOfDay, setWeatherLoaded } = useWeatherStore();

  const lastFetchTime = useRef(0);
  const retryCount = useRef(0);
  const [sunTimes, setSunTimes] = useState<{ sunrise: number; sunset: number } | null>(null);

  const fetchWeather = useCallback(async () => {
    if (!lat || !lon) return;

    const now = Date.now();
    if (now - lastFetchTime.current < WEATHER_UPDATE_INTERVAL && retryCount.current === 0) return;

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      if (!res.ok) throw new Error(`API 실패: ${res.status}`);

      const data = await res.json();

      const cloudiness = data.clouds?.all ?? 0;
      const rawWeather = data.weather?.[0]?.main || "Clear";
      const simplified = simplifyWeather(rawWeather, cloudiness);

      setWeather(simplified);
      setSunTimes({ sunrise: data.sys.sunrise, sunset: data.sys.sunset });

      setWeatherLoaded(true);
      lastFetchTime.current = now;
      retryCount.current = 0;
    } catch {
      retryCount.current++;
      if (retryCount.current <= MAX_RETRY_COUNT) {
        setTimeout(fetchWeather, RETRY_INTERVAL);
      } else {
        setWeatherLoaded(true);
      }
    }
  }, [lat, lon, setWeather, setWeatherLoaded]);

  // 최초 실행 및 주기적 호출
  useEffect(() => {
    if (!lat || !lon) return;
    fetchWeather(); // 초기 실행
    const intervalId = setInterval(fetchWeather, WEATHER_UPDATE_INTERVAL);
    return () => clearInterval(intervalId);
  }, [lat, lon, fetchWeather]);

  // 낮/밤 판단
  const timeOfDay = useMemo(() => {
    if (!sunTimes) return "day";
    const now = Math.floor(Date.now() / 1000);
    return now > sunTimes.sunrise && now < sunTimes.sunset ? "day" : "night";
  }, [sunTimes]);

  // 상태 반영
  useEffect(() => {
    setTimeOfDay(timeOfDay);
  }, [timeOfDay, setTimeOfDay]);

  return null;
};

export default useWeather;
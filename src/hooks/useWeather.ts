import { useEffect, useRef, useState, useMemo } from "react";
import { useLocationStore } from "../stores/useLocationStore";
import { useWeatherStore } from "../stores/useWeatherStore";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const WEATHER_UPDATE_INTERVAL = 30 * 60 * 1000;
const RETRY_INTERVAL = 5 * 60 * 1000; 
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
  const lastFetchTime = useRef<number>(0);
  const retryCount = useRef<number>(0);
  const [sunTimes, setSunTimes] = useState<{ sunrise: number; sunset: number } | null>(null);

  useEffect(() => {
  // 위치(lat, lon)가 있을 때 날씨 정보를 가져오는 역할
  if (!lat || !lon) return;

  const fetchWeather = async () => {
    const now = Date.now();

    // 마지막 요청 이후 30분 이내면 API 요청 생략
    if (now - lastFetchTime.current < WEATHER_UPDATE_INTERVAL && retryCount.current === 0) return;

    try {
      // 날씨 데이터 요청
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      if (!res.ok) throw new Error(`API 실패: ${res.status}`);

      const data = await res.json();

      // 날씨 데이터 가공 및 상태 업데이트
      const cloudiness = data.clouds?.all ?? 0;
      const rawWeather = data.weather?.[0]?.main || "Clear";
      const simplified = simplifyWeather(rawWeather, cloudiness);

      setWeather(simplified); 
      setSunTimes({ sunrise: data.sys.sunrise, sunset: data.sys.sunset }); // 일출/일몰 시간 저장
      setWeatherLoaded(true);
      lastFetchTime.current = now;
      retryCount.current = 0;
    } catch {
      // 요청 실패 시 최대 3회까지 재시도
      retryCount.current++;
      if (retryCount.current <= MAX_RETRY_COUNT) setTimeout(fetchWeather, RETRY_INTERVAL);
      else setWeatherLoaded(true); // 실패해도 앱 멈추지 않도록 처리
    }
  };

  fetchWeather(); // 초기 한 번 실행
  const interval = setInterval(fetchWeather, WEATHER_UPDATE_INTERVAL); // 30분마다 반복 실행

  return () => clearInterval(interval); // 컴포넌트 언마운트 시 interval 정리
}, [lat, lon, setWeather, setWeatherLoaded]);


const timeOfDay = useMemo(() => {
  // 일출/일몰 시간 기준으로 낮/밤 판별
  if (!sunTimes) return "day";
  const now = Math.floor(Date.now() / 1000);
  return now > sunTimes.sunrise && now < sunTimes.sunset ? "day" : "night";
}, [sunTimes]);

useEffect(() => {
  // timeOfDay 값이 변경될 때 상태 저장 (낮/밤 구분)
  setTimeOfDay(timeOfDay);
}, [timeOfDay, setTimeOfDay]);

  return null;
};

export default useWeather;
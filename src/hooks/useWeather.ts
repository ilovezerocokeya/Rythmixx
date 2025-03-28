import { useEffect, useRef, useState, useMemo } from "react";
import { useLocationStore } from "../stores/useLocationStore";
import { useWeatherStore } from "../stores/useWeatherStore";
import { getDistance, Coord } from "@/utils/geo";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const WEATHER_UPDATE_INTERVAL = 30 * 60 * 1000; // 날씨 정보를 갱신하는 주기
const RETRY_INTERVAL = 10 * 1000;// API 요청 실패 시 재시도 간격 (30초)
const MAX_RETRY_COUNT = 3; // API 요청 실패 시 최대 재시도 횟수

// 날씨 상태를 단순화하는 함수 (구름량 포함해서 처리)
const simplifyWeather = (weather: string, cloudiness: number) => {
  const cloudConditions = ["Clouds", "Haze", "Mist", "Fog", "Smoke", "Dust", "Sand", "Ash", "Squall", "Tornado"];
  const rainConditions = ["Rain", "Drizzle"];
  const snowConditions = ["Snow"];
  const thunderstormConditions = ["Thunderstorm"];

  if (weather === "Clear") return cloudiness > 40 ? "Clouds" : "Clear";
  if (cloudConditions.includes(weather)) return "Clouds";
  if (rainConditions.includes(weather)) return "Rain";
  if (snowConditions.includes(weather)) return "Snow";
  if (thunderstormConditions.includes(weather)) return "Thunderstorm";
  return "Clear";
};

const useWeather = () => {
  const { lat, lon } = useLocationStore();
  const { setWeather, setTimeOfDay } = useWeatherStore();
  const lastFetchTime = useRef<number>(0); // 마지막 날씨 API 호출 시각
  const retryCount = useRef<number>(0); // 재시도 횟수 카운터
  const lastFetchedCoords = useRef<Coord | null>(null); // 마지막 날씨 API 호출 시의 좌표
  const [sunTimes, setSunTimes] = useState<{ sunrise: number; sunset: number } | null>(null); // 일출, 일몰 시간 저장

  // 날씨 정보를 가져오는 로직
  useEffect(() => {
    if (!lat || !lon) return;

    const currentCoords = { lat, lon };

    const fetchWeather = async () => {
      const currentTime = Date.now();

      // 마지막 호출 이후 30분이 지나지 않았고, 재시도 중이 아니라면 생략
      if (currentTime - lastFetchTime.current < WEATHER_UPDATE_INTERVAL && retryCount.current === 0) {
        return;
      }

      // 1km 미만 이동했으면 API 호출 생략
      if (lastFetchedCoords.current) {
        const distance = getDistance(lastFetchedCoords.current, currentCoords);
        if (distance < 1000) {
          return;
        }
      }

      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );

        if (!response.ok) throw new Error(`API 요청 실패! 상태 코드: ${response.status}`);

        const data = await response.json();
        const cloudiness = data.clouds?.all ?? 0;
        const rawWeather = data.weather?.[0]?.main || "Clear";
        const simplifiedWeather = simplifyWeather(rawWeather, cloudiness);

        // Zustand 상태에 날씨 저장
        setWeather(simplifiedWeather);

        // 마지막 호출 시간과 좌표 갱신
        lastFetchTime.current = currentTime;
        lastFetchedCoords.current = currentCoords;
        retryCount.current = 0; // 재시도 초기화

        // 일출/일몰 시간 저장
        if (!sunTimes) {
          setSunTimes({
            sunrise: data.sys.sunrise,
            sunset: data.sys.sunset,
          });
        }
      } catch (error) {
        console.error("날씨 정보를 가져오는 데 실패했습니다.", error);

        // 실패 시 최대 3회까지 재시도 (5분 → 10분 → 15분 간격)
        if (retryCount.current < MAX_RETRY_COUNT) {
          retryCount.current += 1;
          setTimeout(fetchWeather, RETRY_INTERVAL);
        }
      }
    };

    // 컴포넌트 마운트 시 즉시 호출
    fetchWeather();

    // 이후 30분마다 자동 호출
    const interval = setInterval(fetchWeather, WEATHER_UPDATE_INTERVAL);
    return () => clearInterval(interval);
  }, [lat, lon, setWeather, sunTimes]);

  // 일출/일몰 시간을 기준으로 현재가 낮인지 밤인지 판단
  const timeOfDay = useMemo(() => {
    if (!sunTimes) return "day"; // 기본값은 낮
    const now = Math.floor(Date.now() / 1000);
    return now > sunTimes.sunrise && now < sunTimes.sunset ? "day" : "night";
  }, [sunTimes]);

  // 시간대 상태 저장
  useEffect(() => {
    setTimeOfDay(timeOfDay);
  }, [timeOfDay, setTimeOfDay]);

  return null;
};

export default useWeather;
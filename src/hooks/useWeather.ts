import { useEffect, useRef } from "react";
import { useLocationStore } from "../stores/useLocationStore";
import { useWeatherStore } from "../stores/useWeatherStore";

// OpenWeather API 키 (환경 변수에서 가져옴)
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

// 날씨 정보를 갱신하는 주기 (30분)
const WEATHER_UPDATE_INTERVAL = 30 * 60 * 1000;

// API 요청 실패 시 재시도 간격 (1분)
const RETRY_INTERVAL = 1 * 60 * 1000;

// API 요청 실패 시 최대 재시도 횟수
const MAX_RETRY_COUNT = 3;

// 날씨 데이터를 단순화하는 함수
const simplifyWeather = (weather: string, cloudiness: number) => {
  const cloudConditions = ["Clouds", "Haze", "Mist", "Fog", "Smoke", "Dust", "Sand", "Ash", "Squall", "Tornado"];
  const rainConditions = ["Rain", "Drizzle"];
  const snowConditions = ["Snow"];
  const thunderstormConditions = ["Thunderstorm"];

  if (weather === "Clear") return cloudiness > 45 ? "Clouds" : "Clear"; // 구름량이 45%보다 많으면 clouds 아니면 sunny
  if (cloudConditions.includes(weather)) return "Clouds";
  if (rainConditions.includes(weather)) return "Rain";
  if (snowConditions.includes(weather)) return "Snow";
  if (thunderstormConditions.includes(weather)) return "Thunderstorm";
  return "Clear"; // 기본값은 맑음
};

const useWeather = () => {
  const { lat, lon } = useLocationStore(); // 현재 위도, 경도 상태 가져오기
  const { setWeather } = useWeatherStore(); // Zustand 상태 업데이트 함수 가져오기
  const lastFetchTime = useRef<number>(0); // 마지막 API 요청 시간을 저장하는 ref
  const retryCount = useRef<number>(0); // API 요청 실패 시 재시도 횟수를 저장하는 ref
  
  useEffect(() => {
    if (!lat || !lon) return; // 위도, 경도가 없으면 API 요청하지 않음

    // OpenWeather API를 호출하여 날씨 데이터를 가져오는 함수     
    const fetchWeather = async () => {
      const currentTime = Date.now();

      // 마지막 요청이 30분 이내이면 API 호출을 건너뜀
      if (currentTime - lastFetchTime.current < WEATHER_UPDATE_INTERVAL && retryCount.current === 0) {
        console.log(" 최근 요청이 30분 이내라 API 요청을 건너뜁니다.");
        return;
      }

      try {
        // OpenWeather API 호출
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );

        if (!response.ok) {
          throw new Error(`API 요청 실패! 상태 코드: ${response.status}`);
        }

        const data = await response.json();

        // 구름량과 날씨 상태 변환
        const cloudiness = data.clouds?.all ?? 0;
        const rawWeather = data.weather?.[0]?.main || "Clear"; // 기본값: Clear
        const simplifiedWeather = simplifyWeather(rawWeather, cloudiness);

        setWeather(simplifiedWeather); // Zustand 상태 업데이트
        lastFetchTime.current = currentTime; // 마지막 요청 시간 저장
        retryCount.current = 0; // 정상 응답 시 재시도 횟수 초기화
      } catch (error) {
        console.error("날씨 정보를 가져오는 데 실패했습니다.", error);

        // 최대 3번까지 재시도
        if (retryCount.current < MAX_RETRY_COUNT) {
          retryCount.current += 1;
          setTimeout(fetchWeather, RETRY_INTERVAL);
        }
      }
    };

    fetchWeather(); // 첫 API 호출 실행

    // 30분마다 자동 업데이트
    const interval = setInterval(fetchWeather, WEATHER_UPDATE_INTERVAL);
    return () => clearInterval(interval);

  }, [lat, lon, setWeather]);

  return null;
};

export default useWeather;

import { useLocationStore } from "@/stores/useLocationStore";
import { useEffect, useState, useRef } from "react";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

const useReverseGeocoding = () => {
  const { lat, lon } = useLocationStore();
  const [location, setLocation] = useState<string | null>(null);
  const lastFetchedCoords = useRef<{ lat: number | null; lon: number | null }>({
    lat: null,
    lon: null,
  });
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3; // 최대 재시도 횟수

  useEffect(() => {
    if (!lat || !lon) return; // 위치 정보가 없으면 실행 안 함

    // 이전에 요청한 좌표와 동일하면 API 요청 생략
    if (lastFetchedCoords.current.lat === lat && lastFetchedCoords.current.lon === lon) {
      return;
    }

    const fetchLocationName = async (retryDelay = 5000) => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`
        );
        const data = await response.json();

        console.log("[Geocoding API 응답]:", data);

        if (Array.isArray(data) && data.length > 0) {
          setLocation(data[0].name || "알 수 없음");
          lastFetchedCoords.current = { lat, lon }; // 최신 좌표 저장
          setRetryCount(0); // 성공 시 재시도 횟수 초기화
        } else {
          setLocation("위치 정보를 찾을 수 없음");
        }
      } catch (error) {
        console.error("[Geocoding 실패]", error);
        setLocation("위치 정보를 가져올 수 없음");

        // 실패 시 재시도
        if (retryCount < maxRetries) {
          setTimeout(() => {
            setRetryCount((prev) => prev + 1);
            fetchLocationName(retryDelay * 2); // 5초 → 10초 → 20초 증가
          }, retryDelay);
        }
      }
    };

    fetchLocationName();
  }, [lat, lon, retryCount]);

  return location;
};

export default useReverseGeocoding;
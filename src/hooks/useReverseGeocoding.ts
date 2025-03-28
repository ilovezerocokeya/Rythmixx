import { useLocationStore } from "@/stores/useLocationStore";
import { useEffect, useState, useRef } from "react";
import { getDistance, Coord } from "@/utils/geo";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

const useReverseGeocoding = () => {

  const { lat, lon } = useLocationStore();
  const [location, setLocation] = useState<string | null>(null); 
  const lastFetchedCoords = useRef<Coord | null>(null);

  // 실패 시 재시도를 위한 상태
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3; // 최대 3회까지 재시도

  useEffect(() => {
    // 위도 또는 경도가 없는 경우, API 요청 생략
    if (!lat || !lon) return;

    const currentCoords = { lat, lon };

    // 이전 요청 좌표와 비교해서 1km 이상 이동했는지 확인
    if (lastFetchedCoords.current) {
      const distance = getDistance(lastFetchedCoords.current, currentCoords);
      if (distance < 1000) {
        return;
      }
    }

    // 위치 이름을 가져오는 비동기 함수 정의
    const fetchLocationName = async (retryDelay = 5000) => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`
        );
        const data = await response.json();

        // 응답 결과가 유효한 경우 도시 이름 설정
        if (Array.isArray(data) && data.length > 0) {
          setLocation(data[0].name || "알 수 없음");
          lastFetchedCoords.current = currentCoords; // 현재 좌표 저장
          setRetryCount(0); // 재시도 횟수 초기화
        } else {
          // 응답 배열이 비어 있는 경우 처리
          setLocation("위치 정보를 찾을 수 없음");
        }
      } catch (error) {
        console.error("[Geocoding 실패]", error);
        setLocation("위치 정보를 가져올 수 없음");

        // 실패 시 지수 백오프 방식으로 최대 3회까지 재시도
        if (retryCount < maxRetries) {
          setTimeout(() => {
            setRetryCount((prev) => prev + 1);
            fetchLocationName(retryDelay * 2); // 5초 → 10초 → 20초 증가
          }, retryDelay);
        }
      }
    };

    // 위치 이름 요청 함수 호출
    fetchLocationName();
  }, [lat, lon, retryCount]); // 위도, 경도, 재시도 횟수 변경 시 실행됨

  // 도시 이름 반환
  return location;
};

export default useReverseGeocoding;
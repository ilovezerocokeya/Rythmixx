import { useEffect, useState, useRef } from "react";
import { useLocationStore } from "../stores/useLocationStore";
import { getDistance, Coord } from "@/utils/geo";


const useGeolocation = () => {
  const { setLocation, setError } = useLocationStore();

  // 마지막 위치 갱신 시간
  const lastUpdateTime = useRef(0);

  // 마지막으로 갱신한 좌표
  const lastCoords = useRef<Coord | null>(null);

  // 위치 실패 시 재시도 횟수
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3; // 최대 재시도 횟수

  useEffect(() => {
    // Geolocation API 지원 여부 확인
    if (!navigator.geolocation) {
      console.error("Geolocation을 지원하지 않는 브라우저입니다.");
      setError("Geolocation을 지원하지 않는 브라우저입니다.");
      return;
    }

    // 위치 수신 성공 시 호출되는 콜백 함수
    const successCallback = (position: GeolocationPosition) => {
      const now = Date.now();
      const { latitude, longitude } = position.coords;
      const currentCoords = { lat: latitude, lon: longitude };
    
      // 10분 이내이면 무시
      if (now - lastUpdateTime.current < 600000) return;
    
      // 1km 미만이면 무시
      if (lastCoords.current) {
        const movedDistance = getDistance(lastCoords.current, currentCoords);
        if (movedDistance < 1000) return;
      }
    
      setLocation(latitude, longitude);
      lastUpdateTime.current = now;
      lastCoords.current = currentCoords;
      setRetryCount(0);
    };

    // 위치 수신 실패 시 호출되는 콜백 함수
    const errorCallback = (error: GeolocationPositionError) => {
      console.error("위치 정보를 가져오는 데 실패했습니다.", error);
      setError("위치 정보를 가져올 수 없습니다.");

      // 실패 시 최대 3회까지 재시도 (10초, 20초, 40초 간격)
      if (retryCount < maxRetries) {
        const retryDelay = Math.pow(2, retryCount) * 10000;
        setTimeout(() => {
          navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
          setRetryCount((prev) => prev + 1);
        }, retryDelay);
      }
    };

    // 위치 지속 감지 시작
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        successCallback(pos);
      },
      (err) => {
        console.error("위치 수신 실패", err);
        errorCallback(err);
      },
      {
        maximumAge: 10 * 60 * 1000, // 10분 내 캐시된 위치 재사용
        timeout: 10000,             // 위치 수신 제한 시간
        enableHighAccuracy: true,   // 가능한 경우 GPS 기반 위치 사용
      }
    );

    // 컴포넌트 언마운트 시 위치 감지 중단
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [setLocation, setError, retryCount]);

  return null;
};

export default useGeolocation;
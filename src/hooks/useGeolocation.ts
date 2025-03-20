import { useEffect, useState, useRef } from "react";
import { useLocationStore } from "../stores/useLocationStore";

const useGeolocation = () => {
  const { setLocation, setError } = useLocationStore();
  const lastUpdateTime = useRef(0); // 마지막 업데이트 시간 저장
  const [retryCount, setRetryCount] = useState(0); // 실패 시 재시도 횟수 저장
  const maxRetries = 3; // 최대 재시도 횟수 제한

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation을 지원하지 않는 브라우저입니다.");
      setError("Geolocation을 지원하지 않는 브라우저입니다.");
      return;
    }

    // 위치 업데이트 함수
    const successCallback = (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;
      const now = Date.now();

      // 최소 5초 간격으로만 업데이트
      if (now - lastUpdateTime.current > 5000) {
        setLocation(latitude, longitude);
        lastUpdateTime.current = now; // 마지막 업데이트 시간 저장
        setRetryCount(0); // 성공 시 재시도 횟수 초기화
      }
    };

    // 위치 가져오기 실패 시 재시도 로직
    const errorCallback = (error: GeolocationPositionError) => {
      console.error("위치 정보를 가져오는 데 실패했습니다.", error);
      setError("위치 정보를 가져올 수 없습니다.");

      if (retryCount < maxRetries) {
        const retryDelay = Math.pow(2, retryCount) * 5000; // 5초 → 10초 → 20초
        setTimeout(() => {
          navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
          setRetryCount((prev) => prev + 1);
        }, retryDelay);
      }
    };

    // 지속적인 위치 감지
    const watchId = navigator.geolocation.watchPosition(successCallback, errorCallback, {
      maximumAge: 10 * 60 * 1000, // 10분 동안 캐시된 위치 사용
      timeout: 5000,
    });

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [setLocation, setError, retryCount]); // retryCount 추가하여 재시도 반영

  return null;
};

export default useGeolocation;
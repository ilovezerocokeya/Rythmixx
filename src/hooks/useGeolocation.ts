import { useEffect, useRef } from "react";
import { useLocationStore } from "../stores/useLocationStore";

const useGeolocation = () => {
  const { setLocation, setError } = useLocationStore();
  const lastUpdateTime = useRef(0);
  const retryCount = useRef(0);
  const maxRetries = 3;

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation을 지원하지 않는 브라우저입니다.");
      setError("Geolocation을 지원하지 않는 브라우저입니다.");
      return;
    }

    const successCallback = (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;
      const now = Date.now();

      // 최소 5초 간격으로만 위치 업데이트
      if (now - lastUpdateTime.current > 5000) {
        setLocation(latitude, longitude);
        lastUpdateTime.current = now;
        retryCount.current = 0;
      }
    };

    const errorCallback = (error: GeolocationPositionError) => {
      console.error("위치 정보를 가져오는 데 실패했습니다.", error);
      setError("위치 정보를 가져올 수 없습니다.");

      if (retryCount.current < maxRetries) {
        const delay = Math.pow(2, retryCount.current) * 5000;
        retryCount.current += 1;
        setTimeout(() => {
          navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
        }, delay);
      }
    };

    const watchId = navigator.geolocation.watchPosition(successCallback, errorCallback, {
      maximumAge: 10 * 60 * 1000,
      timeout: 5000,
    });

    return () => {
      navigator.geolocation.clearWatch(watchId); // 컴포넌트 언마운트 시 위치 감지 중단
    };
  }, [setLocation, setError]);

  return null;
};

export default useGeolocation;
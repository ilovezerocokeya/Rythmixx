import { useLocationStore } from "@/stores/useLocationStore";
import { useEffect } from "react";


const useGeolocation = () => {
  const { setLocation, setError } = useLocationStore();

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation을 지원하지 않는 브라우저입니다.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation(position.coords.latitude, position.coords.longitude);
      },
      () => {
        setError("위치 정보를 가져올 수 없습니다. 서울시청을 기본 위치로 설정합니다.");
      }
    );
  }, [setLocation, setError]);
};

export default useGeolocation;
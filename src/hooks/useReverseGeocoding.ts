import { useEffect, useState } from "react";
import { useLocationStore } from "../stores/useLocationStore";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

const useReverseGeocoding = () => {
  const { lat, lon } = useLocationStore();
  const [location, setLocation] = useState<string | null>(null);

  useEffect(() => {
    if (!lat || !lon) return;

    const fetchLocationName = async () => {
      try {
        const response = await fetch(
          `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=5&appid=${API_KEY}`
        );
        const data = await response.json();

        if (data.length > 0) {
          const city = data[0].name || "알 수 없음"; // 도시명만 표시
          setLocation(city);
        } else {
          setLocation("위치 정보를 찾을 수 없음");
        }
      } catch (error) {
        console.error("Geocoding 실패", error);
        setLocation("위치 정보를 가져올 수 없음");
      }
    };

    fetchLocationName();
  }, [lat, lon]);

  return location;
};

export default useReverseGeocoding;
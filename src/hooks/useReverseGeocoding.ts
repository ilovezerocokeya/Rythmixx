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
  const maxRetries = 3;

  useEffect(() => {
    if (!lat || !lon) return;

    if (lastFetchedCoords.current.lat === lat && lastFetchedCoords.current.lon === lon) {
      return;
    }

    const fetchLocationName = async (retryDelay = 5000) => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}&lang=kr`
        );
        const data = await response.json();

        console.log("[Geocoding API 응답]:", data);

        if (Array.isArray(data) && data.length > 0) {
          setLocation(data[0].local_names?.ko || data[0].name || "알 수 없음");
          lastFetchedCoords.current = { lat, lon };
          setRetryCount(0);
        } else {
          setLocation("위치 정보를 찾을 수 없음");
        }
      } catch (error) {
        console.error("[Geocoding 실패]", error);
        setLocation("위치 정보를 가져올 수 없음");

        if (retryCount < maxRetries) {
          setTimeout(() => {
            setRetryCount((prev) => prev + 1);
            fetchLocationName(retryDelay * 2);
          }, retryDelay);
        }
      }
    };

    fetchLocationName();
  }, [lat, lon, retryCount]);

  return location;
};

export default useReverseGeocoding;
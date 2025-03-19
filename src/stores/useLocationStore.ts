import { create } from "zustand";

type LocationState = {
  lat: number;
  lon: number;
  error: string | null;
  setLocation: (lat: number, lon: number) => void;
  setError: (error: string) => void;
};

// localStorage에서 위치를 즉시 불러와 서울시청을 기본값으로 설정
const savedLocation = JSON.parse(localStorage.getItem("userLocation") || "null");
const SEOUL_CITY_HALL = { lat: 37.5665, lon: 126.9780 };

// 사용자의 현재 위치를 저장 및 관리
export const useLocationStore = create<LocationState>((set) => ({
  lat: savedLocation?.lat || SEOUL_CITY_HALL.lat,
  lon: savedLocation?.lon || SEOUL_CITY_HALL.lon,
  error: null,

  setLocation: (lat, lon) => {
    set({ lat, lon, error: null });
    localStorage.setItem("userLocation", JSON.stringify({ lat, lon })); // 위치 저장
  },

  setError: (error) => {
    console.error("위치 오류 발생:", error);
    set({ error, lat: SEOUL_CITY_HALL.lat, lon: SEOUL_CITY_HALL.lon });
  },
}));
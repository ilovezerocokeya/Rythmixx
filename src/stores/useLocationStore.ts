import { create } from 'zustand';

type LocationState = {
  lat: number;
  lon: number;
  error: string | null;
  setLocation: (lat: number, lon: number) => void;
  setError: (error: string) => void;
  restoreLocation: () => void;
};

const SEOUL_CITY_HALL = { lat: 37.5665, lon: 126.9780 };

export const useLocationStore = create<LocationState>((set) => ({
  lat: SEOUL_CITY_HALL.lat,
  lon: SEOUL_CITY_HALL.lon,
  error: null,

  setLocation: (lat, lon) => {
    set({ lat, lon, error: null });

    if (typeof window !== 'undefined') {
      localStorage.setItem("userLocation", JSON.stringify({ lat, lon }));
    }
  },

  setError: (error) => {
    console.error("위치 오류 발생:", error);
    set({ error, lat: SEOUL_CITY_HALL.lat, lon: SEOUL_CITY_HALL.lon });
  },

  restoreLocation: () => {
    if (typeof window === 'undefined') return;

    const stored = localStorage.getItem("userLocation");
    if (!stored) return;

    try {
      const { lat, lon } = JSON.parse(stored);
      set({ lat, lon, error: null });
    } catch (err) {
      console.error("위치 정보 파싱 오류:", err);
    }
  },
}));
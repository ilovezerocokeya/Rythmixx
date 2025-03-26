import { create } from "zustand";

// 날씨 및 시간대 상태를 관리하는 글로벌 스토어
type WeatherState = {
  weather: string | null;
  timeOfDay: string;
  setWeather: (weather: string) => void;
  setTimeOfDay: (timeOfDay: string) => void;
};

// Zustand를 사용한 날씨 관련 전역 상태 정의
export const useWeatherStore = create<WeatherState>((set) => ({
  weather: null,
  timeOfDay: "day",
  setWeather: (weather) => set({ weather }),
  setTimeOfDay: (timeOfDay) => set({ timeOfDay }),
}));
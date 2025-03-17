import { create } from "zustand";

type WeatherState = {
  weather: string | null;
  temperature: number | null; 
  setWeather: (weather: string) => void;
  setTemperature: (temperature: number | null) => void; // 기온 설정 함수 추가
};

export const useWeatherStore = create<WeatherState>((set) => ({
  weather: null,
  temperature: null,
  setWeather: (weather) => set({ weather }),
  setTemperature: (temperature) => set({ temperature }),
}));
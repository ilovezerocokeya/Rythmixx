import { create } from "zustand";

type WeatherState = {
  weather: string | null;
  timeOfDay: string;
  temperature: number | null; 
  setWeather: (weather: string) => void;
  setTimeOfDay: (timeOfDay: string) => void;
  setTemperature: (temperature: number | null) => void; // 기온 설정 함수 추가
};

export const useWeatherStore = create<WeatherState>((set) => ({
  weather: null,
  timeOfDay: "day",
  temperature: null,
  setWeather: (weather) => set({ weather }),
  setTimeOfDay: (timeOfDay) => set({ timeOfDay }),
  setTemperature: (temperature) => set({ temperature }),
}));
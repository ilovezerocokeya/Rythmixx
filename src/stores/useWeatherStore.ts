import { create } from "zustand";

type WeatherState = {
  weather: string | null;
  setWeather: (weather: string) => void;
};

export const useWeatherStore = create<WeatherState>((set) => ({
  weather: null,
  setWeather: (weather) => set({ weather }),
}));
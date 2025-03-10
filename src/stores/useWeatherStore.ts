import { create } from "zustand";

type WeatherState = {
  weather: string | null;
  timeOfDay: string;
  setWeather: (weather: string) => void;
  setTimeOfDay: (timeOfDay: string) => void;
};

export const useWeatherStore = create<WeatherState>((set) => ({
  weather: null,
  timeOfDay: "day",
  setWeather: (weather) => set({ weather }),
  setTimeOfDay: (timeOfDay) => set({ timeOfDay }),
}));
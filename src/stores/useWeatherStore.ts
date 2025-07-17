import { create } from "zustand";

// 날씨 및 시간대 상태 타입 정의
type WeatherState = {
  weather: string | null;             
  timeOfDay: string;                  
  isWeatherLoaded: boolean;           
  setWeather: (weather: string) => void;
  setTimeOfDay: (timeOfDay: string) => void;
  setWeatherLoaded: (loaded: boolean) => void;
};

// Zustand를 사용한 날씨 상태 전역 저장소 생성
export const useWeatherStore = create<WeatherState>((set) => ({
  weather: null,           
  timeOfDay: "day",        
  isWeatherLoaded: false,  

  setWeather: (weather) => set({ weather }),           
  setTimeOfDay: (timeOfDay) => set({ timeOfDay }),     
  setWeatherLoaded: (loaded) => set({ isWeatherLoaded: loaded }),
}));
import { useEffect, useState } from "react";
import { useLocationStore } from "../stores/useLocationStore";
import { useWeatherStore } from "../stores/useWeatherStore";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

// 날씨 데이터를 5가지 유형으로 단순화하는 함수
const simplifyWeather = (weather: string, cloudiness: number) => {
  const cloudConditions = ["Clouds", "Haze", "Mist", "Fog", "Smoke", "Dust", "Sand", "Ash", "Squall", "Tornado"];
  const rainConditions = ["Rain", "Drizzle"];
  const snowConditions = ["Snow"];
  const thunderstormConditions = ["Thunderstorm"];

  if (weather === "Clear") {
    return cloudiness > 45 ? "Clouds" : "Clear"; // 구름량이 많으면 "Clouds"로 변경
  }
  if (cloudConditions.includes(weather)) return "Clouds";
  if (rainConditions.includes(weather)) return "Rain";
  if (snowConditions.includes(weather)) return "Snow";
  if (thunderstormConditions.includes(weather)) return "Thunderstorm";

  return "Clear"; // 기본값
};

const useWeather = () => {
  const { lat, lon } = useLocationStore();
  const { setWeather, setTimeOfDay, setTemperature } = useWeatherStore();
  const [sunTimes, setSunTimes] = useState<{ sunrise: number; sunset: number } | null>(null);

  useEffect(() => {
    if (!lat || !lon || !API_KEY) return;

    const fetchWeather = async () => {


      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );

        if (!response.ok) {
          console.error(" 날씨 API 요청 실패! 상태 코드:", response.status);
          return;
        }

        const data = await response.json();

        // 구름량과 날씨 상태를 활용한 변환
        const cloudiness = data.clouds?.all ?? 0; // 구름량 (%)
        const rawWeather = data.weather?.[0]?.main || "Clear"; // 기본 Clear
        const simplifiedWeather = simplifyWeather(rawWeather, cloudiness);

        setWeather(simplifiedWeather);

        // 기온 설정
        const temperature = data.main?.temp ?? null; // 기온 (없으면 null)
        setTemperature(temperature);

        // 일출/일몰 시간 저장 (처음 요청할 때만)
        if (!sunTimes) {
          setSunTimes({
            sunrise: data.sys.sunrise,
            sunset: data.sys.sunset,
          });
        }

      } catch (error) {
        console.error("날씨 정보를 가져오는 데 실패했습니다.", error);

      }
    };

    fetchWeather();

  }, [lat, lon, API_KEY, setWeather, sunTimes]);

    // 현재 시간 기준으로 낮/밤 판별
    useEffect(() => {
      if (!sunTimes) return;
  
      const currentTime = Math.floor(Date.now() / 1000); // 초 단위로 변환
      setTimeOfDay(currentTime > sunTimes.sunrise && currentTime < sunTimes.sunset ? "day" : "night");
    }, [sunTimes, setTimeOfDay]);


  return null;
};

export default useWeather;
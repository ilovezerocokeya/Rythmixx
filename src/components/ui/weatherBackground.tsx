import { useWeatherStore } from "../../stores/useWeatherStore";
import "../../styles/WeatherBackground.css";

const WeatherBackground = () => {
    const { weather, timeOfDay } = useWeatherStore();

  return <div className={`weather-background ${weather?.toLowerCase()} ${timeOfDay}`}></div>
};

export default WeatherBackground;
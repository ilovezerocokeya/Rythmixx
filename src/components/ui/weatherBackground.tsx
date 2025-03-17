import { useEffect } from "react";
import "../../styles/WeatherBackground.css";

type WeatherBackgroundProps = {
  weatherType: string;
  setBackgroundType?: (type: string) => void;
};

const WeatherBackground: React.FC<WeatherBackgroundProps> = ({ weatherType, setBackgroundType }) => {
  let backgroundImage = "";
  let backgroundType = "default"; // 기본값 설정

  switch (weatherType) {
    case "rainy":
      backgroundImage = "/images/rainy.webp";
      backgroundType = "rainy";
      break;
    case "snowy":
      backgroundImage = "/images/snowing.webp";
      backgroundType = "snowy";
      break;
    case "sunny":
      backgroundImage = "/images/sunny.webp";
      backgroundType = "sunny";
      break;
    case "cloudy":
      backgroundImage = "/images/cloud.webp";
      backgroundType = "cloudy";
      break;
    case "thunder":
      backgroundImage = "/images/thunder.webp";
      backgroundType = "thunder";
      break;
    default:
      backgroundImage = "/images/default.webp";
      backgroundType = "default";
  }

  // 부모 컴포넌트에서 배경 타입을 저장할 수 있도록 설정
  useEffect(() => {
    if (setBackgroundType) {
      setBackgroundType(backgroundType);
    }
  }, [backgroundType, setBackgroundType]);

  return (
    <div
      className="absolute inset-0 bg-cover bg-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        zIndex: "-10",
      }}
    />
  );
};

export default WeatherBackground;
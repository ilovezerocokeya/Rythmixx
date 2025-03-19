import { useEffect, useState, useRef } from "react";
import "../../styles/WeatherBackground.css";

type WeatherBackgroundProps = {
  weatherType: string;
  setBackgroundType?: (type: string) => void;
};

const backgroundImages: Record<string, string> = {
  rainy: "/images/rainy.webp",
  snowy: "/images/snowing.webp",
  sunny: "/images/sunny.webp",
  cloudy: "/images/cloud.webp",
  thunder: "/images/thunder.webp",
  default: "/images/default.webp",
};

const WeatherBackground: React.FC<WeatherBackgroundProps> = ({ weatherType, setBackgroundType }) => {
  const [cachedImage, setCachedImage] = useState<string>(backgroundImages.default);
  const loadedImages = useRef<Record<string, string>>({}); // 캐싱된 이미지 저장

  useEffect(() => {
    const newImage = backgroundImages[weatherType] || backgroundImages.default;

    // 이미 로드된 이미지인지 확인
    if (loadedImages.current[weatherType]) {
      setCachedImage(loadedImages.current[weatherType]);
      return;
    }

    // 이미지 미리 로드
    const img = new Image();
    img.src = newImage;
    img.onload = () => {
      loadedImages.current[weatherType] = newImage; // 캐시에 저장
      setCachedImage(newImage);
    };
    setBackgroundType?.(weatherType);

  }, [weatherType]);

  return (
    <div
      className="absolute bg-cover bg-center"
      style={{
        width: "320px",
        height: "180px",
        backgroundImage: `url(${cachedImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        zIndex: "-10",
        transition: "background-image 0.3s ease-in-out",
      }}
    />
  );
};

export default WeatherBackground;
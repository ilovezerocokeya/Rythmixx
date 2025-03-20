import { useEffect, useState, useMemo } from "react";
import "../../styles/WeatherBackground.css";

type WeatherBackgroundProps = {
  weatherType: string;
  setBackgroundType?: (type: string) => void;
};

const backgroundImages: Record<string, string> = {
  rainy: "/images/rainy.webp",
  snowy: "/images/snow.webp",
  sunny: "/images/sunny.webp",
  cloudy: "/images/cloud.webp",
  thunder: "/images/flash.webp",
  night: "/images/night.webp",
  default: "/images/default.webp",
};

const WeatherBackground: React.FC<WeatherBackgroundProps> = ({ weatherType, setBackgroundType }) => {
  // 현재 배경 이미지 상태
  const [cachedImage, setCachedImage] = useState<string>(backgroundImages.default);

  // 캐시된 이미지 목록을 useMemo로 관리
  const loadedImages = useMemo(() => new Map<string, string>(), []);

  useEffect(() => {
    const newImage = backgroundImages[weatherType] || backgroundImages.default;

    // 이미 로드된 이미지인지 확인 후 즉시 설정
    if (loadedImages.has(weatherType)) {
      setCachedImage(loadedImages.get(weatherType)!);
      return;
    }

    // 이미지 미리 로드
    const img = new Image();
    img.src = newImage;
    img.onload = () => {
      loadedImages.set(weatherType, newImage); // 캐시에 저장
      setCachedImage(newImage);
    };

    // 배경 타입 변경 감지 시 setBackgroundType 호출
    if (setBackgroundType && newImage !== cachedImage) {
      setBackgroundType(weatherType);
    }

  }, [weatherType, cachedImage, loadedImages, setBackgroundType]);

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
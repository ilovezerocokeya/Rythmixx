import { useEffect, useMemo, useRef, useState } from "react";
import "../../styles/WeatherBackground.css";

export type WeatherBackgroundProps = {
  weatherType: string;
  isSpecial?: boolean;
  onClick?: () => void;
};

const backgroundImages: Record<string, string> = {
  snow: "/images/snow.webp",
  "snow-special": "/images/snow_special.webp",
  rain: "/images/rainy.webp",
  "rain-special": "/images/rainy_special.webp",
  clear: "/images/sunny.webp",
  "clear-special": "/images/sunny_special.webp",
  clouds: "/images/cloud.webp",
  "clouds-special": "/images/cloud_special.webp",
  thunderstorm: "/images/flash.webp",
  "thunderstorm-special": "/images/flash_special.webp",
  night: "/images/night.webp",
  "night-special": "/images/night_special.webp",
};

const WeatherBackground: React.FC<WeatherBackgroundProps> = ({
  weatherType,
  isSpecial,
  onClick,
}) => {
  
  // 이미지 캐시 저장소
  const imageCache = useRef(new Map<string, string>());
  
  // 현재 날씨에 해당하는 키와 이미지 URL 계산
  const imageKey = useMemo(() => (isSpecial ? `${weatherType}-special` : weatherType), [weatherType, isSpecial]);
  const newImageUrl = backgroundImages[imageKey];
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    // preload 삽입
    if (!document.querySelector(`link[rel="preload"][href="${newImageUrl}"]`)) {
      const preload = document.createElement("link");
      preload.rel = "preload";
      preload.href = newImageUrl;
      preload.as = "image";
      document.head.appendChild(preload);
    }

    // 캐시되어 있으면 즉시 적용
    if (imageCache.current.has(imageKey)) {
      setImageSrc(imageCache.current.get(imageKey)!);
      return;
    }

    // 이미지 로드 후 적용
    const img = new Image();
    img.src = newImageUrl;
    img.onload = () => {
      imageCache.current.set(imageKey, newImageUrl);
      setImageSrc(newImageUrl);
    };
  }, [imageKey, newImageUrl]);

  if (!weatherType || !imageSrc) {
    return (
      <div className="absolute w-full h-[190px] z-1 flex items-center justify-center bg-black text-white text-sm">
        ⏳
      </div>
    );
  }

  return (
    <div
      className="absolute w-full h-[190px] z-1 bg-cover bg-center transition-opacity duration-500"
      onClick={onClick}
      style={{
        backgroundImage: `url(${imageSrc})`,
        transition: "background-image 0.3s ease-in-out",
      }}

      
    />
  );
};

export default WeatherBackground;
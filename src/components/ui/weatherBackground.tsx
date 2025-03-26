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
  default: "/images/default.webp",
};

const WeatherBackground: React.FC<WeatherBackgroundProps> = ({
  weatherType,
  isSpecial,
  onClick,
}) => {
  const [imageSrc, setImageSrc] = useState(backgroundImages.default);

  // 이미지 캐시 저장소
  const imageCache = useRef(new Map<string, string>());

  // 현재 날씨에 해당하는 키와 이미지 URL 계산
  const imageKey = useMemo(() => (isSpecial ? `${weatherType}-special` : weatherType), [weatherType, isSpecial]);
  const newImageUrl = backgroundImages[imageKey] || backgroundImages.default;

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

  return (
    <div
      className="absolute w-full h-[190px] z-1 cursor-pointer"
      onClick={onClick}
    >
      <img
        src={imageSrc}
        alt="현재 날씨 배경"
        className="w-full h-full object-cover"
        loading="eager"
        decoding="async"
        width="340"
        height="190"
      />
    </div>
  );
};

export default WeatherBackground;
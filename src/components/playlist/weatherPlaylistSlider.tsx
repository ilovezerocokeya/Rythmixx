import React, { useState, useCallback } from "react";
import { motion, useAnimation } from "framer-motion";
import WeatherBackground from "../ui/weatherBackground";
import WeatherDisplay from "../weather/weatherDisplay";
import LocationDisplay from "../location/locationDisplay";

type PlaylistProps = {
  id: string;
  title: string;
  weatherType?: string;
  onClick: () => void;
};

type WeatherPlaylistSliderProps = {
  playlists: PlaylistProps[];
  nickname: string;
};

const WeatherPlaylistSlider: React.FC<WeatherPlaylistSliderProps> = ({ playlists, nickname }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [backgroundType, setBackgroundType] = useState("default"); 
  const controls = useAnimation();
  const totalSlides = playlists.length;

  // 배경 타입에 따른 글자 색상 반환
  const getTextColor = (backgroundType: string) => {
    switch (backgroundType) {
      case "rainy": return "#ffffff";  
      case "snowy": return "#000000";  
      case "sunny": return "#ffffff";  
      case "cloudy": return "#ffffff"; 
      case "thunder": return "#000000";
      default: return "#ffffff";
    }
  };

  // 슬라이드 이동 함수
  const scroll = useCallback(async (newIndex: number) => {
    if (newIndex < 0) newIndex = totalSlides - 1;
    else if (newIndex >= totalSlides) newIndex = 0;

    setCurrentIndex(newIndex);
    await controls.start({ 
      x: -newIndex * 100 + "%", 
      transition: { type: "spring", stiffness: 150, damping: 20 } 
    });
  }, [controls, totalSlides]);

  return (
    <div className="relative w-full h-[85vh] flex items-center justify-center overflow-hidden">
      {/* 날씨 배경 적용 */}
      <div className="absolute inset-0 -z-0">
        <WeatherBackground 
          weatherType={playlists[currentIndex]?.weatherType || "default"} 
          setBackgroundType={setBackgroundType} // 배경 타입 업데이트
        />
      </div>

      {/* 닉네임 & 날씨 정보 */}
      <div className="absolute top-6 md:top-10 left-1/2 transform -translate-x-1/2 text-center z-10">
        <h1 className="text-xl md:text-3xl font-bold" style={{ color: getTextColor(backgroundType) }}>
          Hello, {nickname}
        </h1>
        <div className="flex items-center justify-center mt-1 md:mt-2 space-x-1 md:space-x-2">
          <WeatherDisplay />
          <span style={{ color: getTextColor(backgroundType) }}>|</span>
          <LocationDisplay />
        </div>
      </div>

      {/* 슬라이더 */}
      <motion.div
        animate={controls}
        className="flex w-full h-full cursor-grab"
        drag="x"
        dragConstraints={{ left: -100 * (totalSlides - 1), right: 0 }}
        dragElastic={0.15}
        dragMomentum={false}
        onDragEnd={(event, info) => {
          if (info.velocity.x < -50) {
            scroll(currentIndex + 1);
          } else if (info.velocity.x > 50) {
            scroll(currentIndex - 1);
          }
        }}
      >
        {playlists.map((playlist) => (
          <motion.div
            key={playlist.id}
            className="w-full min-w-full h-full flex flex-col items-center justify-center text-black"
          >
            <div className="absolute bottom-20 text-center px-6 z-10">
              <h2 className="text-lg md:text-3xl font-bold whitespace-nowrap">
                {playlist.title}
              </h2>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* 좌우 화살표 버튼 */}
      <motion.button
        onClick={() => scroll(currentIndex - 1)}
        whileHover={{ scale: 1.1, opacity: 1 }}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white p-3 rounded-full hover:bg-gray-700 transition"
        aria-label="이전 슬라이드"
      >
        ←
      </motion.button>

      <motion.button
        onClick={() => scroll(currentIndex + 1)}
        whileHover={{ scale: 1.1, opacity: 1 }}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white p-3 rounded-full hover:bg-gray-700 transition"
        aria-label="다음 슬라이드"
      >
        →
      </motion.button>

      {/* 인디케이터 */}
      <div className="absolute bottom-6 w-full flex justify-center space-x-1 md:space-x-2 z-10">
        {playlists.map((_, index) => (
          <div
            key={index}
            className={`transition-all duration-300 
              ${index === currentIndex 
                ? "bg-white scale-125 h-1 w-6 md:h-1.5 md:w-8"  
                : "bg-gray-500 h-0.5 w-4 md:h-1 md:w-6"         
              } rounded-full md:rounded-xl`}
            onClick={() => scroll(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default WeatherPlaylistSlider;
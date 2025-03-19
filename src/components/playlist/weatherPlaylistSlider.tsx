import React, { useState, useCallback, useMemo } from "react";
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
  const textColor = useMemo(() => {
    switch (backgroundType) {
      case "rainy": return "#ffffff";  
      case "snowy": return "#000000";  
      case "sunny": return "#ffffff";  
      case "cloudy": return "#ffffff"; 
      case "thunder": return "#000000";
      default: return "#ffffff";
    }
  }, [backgroundType]); 

  const playlistItems = useMemo(() => {
    return playlists.map((playlist) => (
      <motion.div
        key={playlist.id}
        className="w-full min-w-full h-full flex flex-col items-center justify-center text-black"
      >
        <div className="absolute mb-150 text-center z-10">
          <h2 className="text-m font-bold whitespace-nowrap">
            {playlist.title}
          </h2>
        </div>
      </motion.div>
    ));
  }, [playlists]);

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
          setBackgroundType={setBackgroundType} 
        />
      </div>

      {/* 닉네임 & 날씨 정보 */}
      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-center z-10">
        <h1 className="text-sm font-bold" style={{ color: textColor }}>
          Hello, {nickname}
        </h1>
        <div className="flex items-center justify-center space-x-1">
          <WeatherDisplay />
          <span style={{ color: textColor }}>|</span>
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
        {playlistItems}
      </motion.div>

      {/* 좌우 화살표 버튼 */}
      <motion.button
        onClick={() => scroll(currentIndex - 1)}
        whileHover={{ scale: 1.3, color: "#ffffff" }}
        className="absolute left-1 top-[13%] transform -translate-y-1/2 text-gray text-lg transition-colors duration-200"
        aria-label="이전 슬라이드"
      >
        ←
      </motion.button>
            
      <motion.button
        onClick={() => scroll(currentIndex + 1)}
        whileHover={{ scale: 1.3, color: "#ffffff" }}
        className="absolute right-1 top-[13%] transform -translate-y-1/2 text-gray text-lg transition-colors duration-200"
        aria-label="다음 슬라이드"
      >
        →
      </motion.button>

      {/* 인디케이터 */}
      <div className="absolute mb-120 w-full flex justify-center space-x-2 z-10">
        {playlists.map((_, index) => (
          <div
            key={index}
            className={`transition-all duration-300 
              ${index === currentIndex 
                ? "bg-white scale-125 h-0.5 w-4"  
                : "bg-gray-500 h-0.5 w-4"         
              } rounded-full`}
            onClick={() => scroll(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default WeatherPlaylistSlider;
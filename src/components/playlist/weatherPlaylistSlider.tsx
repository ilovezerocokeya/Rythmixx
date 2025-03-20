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
  const controls = useAnimation();
  const totalSlides = playlists.length;

  // 슬라이드 목록
  const playlistItems = useMemo(() => {
    return playlists.map((playlist) => (
      <motion.div
        key={playlist.id}
        className="w-full min-w-full h-full flex flex-col items-center justify-center text-white"
      >
        <div className="absolute top-38 text-center z-10">
          <h2 className="text-m font-bold whitespace-nowrap">{playlist.title}</h2>
        </div>
      </motion.div>
    ));
  }, [playlists]);

  // 슬라이드 이동 함수
  const scroll = useCallback((direction: "left" | "right") => {
    setCurrentIndex((prev) => {
      let newIndex = direction === "left" ? prev - 1 : prev + 1;
      if (newIndex < 0) newIndex = totalSlides - 1;
      if (newIndex >= totalSlides) newIndex = 0;

      controls.start({
        x: -newIndex * 100 + "%",
        transition: { type: "spring", stiffness: 150, damping: 20 },
      });

      return newIndex;
    });
  }, [controls, totalSlides]);

  return (
    <div className="relative w-full h-[85vh] flex items-center justify-center overflow-hidden">
      {/* 날씨 배경 */}
      <div className="absolute inset-0 -z-0">
        <WeatherBackground weatherType={playlists[currentIndex]?.weatherType || "default"} />
      </div>

      {/* 닉네임 & 날씨 정보 */}
      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-[95%] flex items-center justify-center space-x-1 z-10">
        <h1 className="text-xs text-white font-bold whitespace-nowrap">
          Hello! {nickname},
        </h1>
        <WeatherDisplay />
        <LocationDisplay />
      </div>

      {/* 슬라이더 */}
      <motion.div 
        animate={controls} 
        className="flex w-full h-full cursor-grab"
        drag="x" // 스와이프 활성화
        dragConstraints={{ left: -100 * (totalSlides - 1), right: 0 }} // 드래그 범위 제한
        dragElastic={0.2} // 탄성 설정
        dragMomentum={true} // 드래그 모멘텀 활성화
        onDragEnd={(event, info) => {
          if (info.velocity.x < -50) {
            scroll("right");
          } else if (info.velocity.x > 50) {
            scroll("left");
          }
        }}
      >
        {playlistItems}
      </motion.div>

      {/* 좌우 화살표 버튼 */}
      <motion.button
        onClick={() => scroll("left")}
        whileHover={{
          scale: 1.2,
          opacity: 0.8,
        }}
        className="absolute left-4 top-25 transform -translate-y-1/2 text-white text-lg transition-colors duration-200 bg-transparent"
        aria-label="이전 슬라이드"
      >
        ←
      </motion.button>

      <motion.button
        onClick={() => scroll("right")}
        whileHover={{
          scale: 1.2,
          opacity: 0.8,
        }}
        className="absolute right-4 top-25 transform -translate-y-1/2 text-white text-lg transition-colors duration-200 bg-transparent"
        aria-label="다음 슬라이드"
      >
        →
      </motion.button>

      {/* 인디케이터 */}
      <div className="absolute top-43 left-1/2 transform -translate-x-1/2 flex justify-center space-x-2 z-10">
        {playlists.map((_, index) => (
          <div
            key={index}
            className={`transition-all duration-300 
              ${index === currentIndex ? "bg-white scale-125 h-0.5 w-4" : "bg-gray-500 h-0.5 w-4"} 
              rounded-full`}
            onClick={() => scroll(index === currentIndex ? "right" : "left")}
          />
        ))}
      </div>
    </div>
  );
};

export default WeatherPlaylistSlider;
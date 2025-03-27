import React, { useState, useCallback, useMemo } from "react";
import { motion, useAnimation } from "framer-motion";
import WeatherBackground from "../ui/weatherBackground";
import WeatherDisplay from "../weather/weatherDisplay";
import LocationDisplay from "../location/locationDisplay";
import { useCurrentWeatherType } from "@/hooks/useCurrentWeatherType";
import usePreloadWeatherImages from "@/hooks/usePreloadWeatherImages";
import { mockWeatherPlaylists } from "@/mocks/mockPlaylists"; 
import { useWeatherStore } from "@/stores/useWeatherStore";

type WeatherPlaylistSliderProps = {
  nickname: string;
};

const WeatherPlaylistSlider: React.FC<WeatherPlaylistSliderProps> = ({ nickname }) => {
  const [currentIndex, setCurrentIndex] = useState(0); // 현재 보여지는 슬라이드 인덱스
  const controls = useAnimation(); // Framer Motion 슬라이드 전환 애니메이션 컨트롤
  const currentWeatherType = useCurrentWeatherType(); // 현재 날씨 타입 가져오기
  const { weather } = useWeatherStore();
  
  usePreloadWeatherImages();

  // 날씨 타입 로딩 전이라면 아무것도 렌더링하지 않음
  if (!currentWeatherType) return null;

  // 현재 날씨를 기준으로 플레이리스트 슬라이드 구성
  const playlists = useMemo(() => {

    // 오늘 날씨용 슬라이드 찾기
    const todaySlide = mockWeatherPlaylists.find(
      (p) => p.weatherType === currentWeatherType
    );
  
    // 나머지 슬라이드
    const otherSlides = mockWeatherPlaylists.filter(
      (p) => p.weatherType !== currentWeatherType
    );
  
    return todaySlide ? [todaySlide, ...otherSlides] : otherSlides;
  }, [currentWeatherType]);

  const totalSlides = playlists.length;

  // 슬라이드 좌우 이동 함수 (좌우 버튼 / 인디케이터 클릭 시)
  const scroll = useCallback(
    (dir: "left" | "right" | number) => {
      setCurrentIndex((prev) => {
        let next: number;

        // 문자열 or 숫자에 따라 다음 인덱스 계산
        if (typeof dir === "number") next = dir;
        else next = dir === "left" ? prev - 1 : prev + 1;

        // 슬라이드 순환 로직
        if (next < 0) next = totalSlides - 1;
        if (next >= totalSlides) next = 0;

        // 애니메이션으로 x축 이동 처리
        controls.start({
          x: `-${next * 100}%`,
          transition: { duration: 0.3, ease: "easeInOut" },
        });

        return next;
      });
    },
    [controls, totalSlides]
  );

  return (
    <div className="relative w-full h-[190px] flex items-center justify-center overflow-hidden">
      {/* 배경: 현재 슬라이드의 날씨에 따라 다르게 렌더링 */}
      {weather && (
  <WeatherBackground
    weatherType={playlists[currentIndex].weatherType}
    isSpecial={playlists[currentIndex].weatherType === currentWeatherType}
    onClick={playlists[currentIndex].onClick}
  />
)}

      {/* 인삿말 및 날씨 */}
      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-[95%] flex items-center justify-center space-x-1 z-10">
        <h1 className="text-xs text-white font-bold whitespace-nowrap">
          Hello! <span className="text-gray-400">{nickname}</span>,
        </h1>
        <WeatherDisplay />
        <LocationDisplay />
      </div>

       {/* 슬라이드 타이틀 */}
      <div className="absolute top-36 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="text-center text-white space-y-1">
          {currentIndex === 0 && (
            <p className="text-sm font-semibold opacity-80 whitespace-nowrap">
              이런 날씨엔 이런 노래 :
            </p>
          )}
          <h1 className="text-m font-bold whitespace-nowrap">
            {playlists[currentIndex].title}
          </h1>
        </div>
      </div>

      {/* 슬라이더 */}
      <motion.div
        animate={controls}
        className="flex w-full h-full cursor-grab"
        drag="x"
        dragConstraints={{ left: -100 * (totalSlides - 1), right: 0 }}
        dragElastic={0.2}
        dragMomentum={true}
        onDragEnd={(e, info) => {
          if (info.velocity.x < -50) scroll("right");
          else if (info.velocity.x > 50) scroll("left");
        }}
      >
         {/* 각 슬라이드 요소 */}
        {playlists.map((playlist) => (
          <motion.div
            key={`playlist-${playlist.id}`}
            className="w-full min-w-full h-full flex items-center justify-center"
            onClick={playlist.onClick}
          >
            {/* 슬라이드 내부 콘텐츠: 제목
            <div className="text-center text-white text-sm font-semibold">
              {playlist.title}
            </div> */}
          </motion.div>
        ))}
      </motion.div>

      {/* 좌우 화살표 */}
      <motion.button
        onClick={() => scroll("left")}
        whileHover={{ scale: 1.1 }}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-lg z-10 
                   hover:bg-white/10 rounded-xl p-2 transition duration-200"
        aria-label="이전 슬라이드"
      >
        ←
      </motion.button>

      <motion.button
        onClick={() => scroll("right")}
        whileHover={{ scale: 1.1 }}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-lg z-10 
                   hover:bg-white/10 rounded-xl p-2 transition duration-200"
        aria-label="다음 슬라이드"
      >
        →
      </motion.button>

      {/* 인디케이터 */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex justify-center space-x-2 z-10">
        {playlists.map((_, index) => (
          <div
            key={index}
            className={`transition-all duration-300 
              ${index === currentIndex ? "bg-white scale-125 h-0.5 w-4" : "bg-gray-500 h-0.5 w-4"} 
              rounded-full`}
            onClick={() => scroll(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default WeatherPlaylistSlider;
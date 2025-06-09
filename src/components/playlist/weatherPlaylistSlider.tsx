import React, { useState, useCallback, useMemo } from "react";
import { motion, useAnimation } from "framer-motion";
import WeatherBackground from "../ui/weatherBackground";
import WeatherDisplay from "../weather/weatherDisplay";
import LocationDisplay from "../location/locationDisplay";
import { useCurrentWeatherType } from "@/hooks/useCurrentWeatherType";
import usePreloadWeatherImages from "@/hooks/usePreloadWeatherImages";
import { mockWeatherPlaylists } from "@/mocks/mockPlaylists"; 
import { useWeatherStore } from "@/stores/useWeatherStore";
import { useAuthStore } from "@/stores/authStore";
import { useLoginModalStore } from "@/stores/useLoginModalStore"; // 추가


type WeatherPlaylistSliderProps = {
  nickname: string;
};

const WeatherPlaylistSlider: React.FC<WeatherPlaylistSliderProps> = ({ nickname }) => {
  const [currentIndex, setCurrentIndex] = useState(0); // 현재 보여지는 슬라이드 인덱스
  const controls = useAnimation(); // Framer Motion 슬라이드 전환 애니메이션 컨트롤
  const currentWeatherType = useCurrentWeatherType(); // 현재 날씨 타입 가져오기
  const { weather } = useWeatherStore();
  const openLoginModal = useLoginModalStore((state) => state.open);
  const user = useAuthStore((state) => state.user);
  const isGuest = !user;
  
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
  <div className="w-full">
    <div className="w-full flex flex-col rounded-2xl overflow-hidden border border-gray-200 shadow-md bg-white">

      {/* 슬라이드 영역 */}
      <div className="relative w-full h-[240px]">

        {/* 배경 이미지 */}
        {weather && (
          <WeatherBackground
            weatherType={playlists[currentIndex].weatherType}
            isSpecial={playlists[currentIndex].weatherType === currentWeatherType}
            onClick={playlists[currentIndex].onClick}
          />
        )}

        {/* 헤더 */}
        <div className="absolute top-0 left-0 w-full px-4 py-2 flex justify-between items-center z-30 bg-white/80 backdrop-blur-sm border-b border-gray-200">
          <div className="flex items-center space-x-2 text-sm text-gray-800 font-semibold">
            <span>Hello, <span className="text-blue-600">{nickname}</span></span>
            <WeatherDisplay />
            <LocationDisplay />
          </div>
          {isGuest ? (
            <button
              onClick={openLoginModal}
              className="px-3 py-[4px] text-[11px] font-medium text-blue-600 border border-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition-all"
            >
              로그인
            </button>
          ) : (
            <span className="text-[11px] text-gray-500">👋 {user.nickname}님</span>
          )}
        </div>

        {/* 슬라이드 */}
        <motion.div
          animate={controls}
          className="flex w-full h-full pt-10 pb-12"
          drag="x"
          dragConstraints={{ left: -100 * (totalSlides - 1), right: 0 }}
          dragElastic={0.2}
          dragMomentum={true}
          onDragEnd={(e, info) => {
            if (info.velocity.x < -50) scroll("right");
            else if (info.velocity.x > 50) scroll("left");
          }}
        >
          {playlists.map((playlist) => (
            <motion.div
              key={`playlist-${playlist.id}`}
              className="w-full min-w-full h-full flex items-center justify-center"
              onClick={playlist.onClick}
            />
          ))}
        </motion.div>

        {/* 좌우 버튼 */}
        <motion.button
          onClick={() => scroll("left")}
          whileHover={{ scale: 1.1 }}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 z-20 hover:bg-gray-100 rounded-full p-2 transition duration-200"
          aria-label="이전 슬라이드"
        >
          ←
        </motion.button>
        <motion.button
          onClick={() => scroll("right")}
          whileHover={{ scale: 1.1 }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 z-20 hover:bg-gray-100 rounded-full p-2 transition duration-200"
          aria-label="다음 슬라이드"
        >
          →
        </motion.button>

        {/* 제목 + 인디케이터 */}
        <div className="absolute bottom-0 left-0 w-full px-4 py-3 bg-white/80 backdrop-blur-md border-t border-gray-200 z-20">
          <div className="text-center text-gray-800">
            <h1 className="text-sm font-semibold">{playlists[currentIndex].title}</h1>
          </div>
          <div className="flex justify-center space-x-2 mt-2">
            {playlists.map((_, index) => (
              <div
                key={index}
                className={`transition-all duration-300 rounded-full h-1 w-4 ${
                  index === currentIndex ? "bg-blue-600" : "bg-gray-300"
                }`}
                onClick={() => scroll(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default WeatherPlaylistSlider;
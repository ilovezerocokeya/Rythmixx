import React, { useState, useCallback } from "react";
import { motion, useAnimation } from "framer-motion";

type Playlist = {
  id: string;
  title: string;
  onClick?: () => void;
};

interface MainCurationPlaylistSliderProps {
  playlists: Playlist[]; // 외부에서 주입
}

const MainCurationPlaylistSlider: React.FC<MainCurationPlaylistSliderProps> = ({ playlists }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const controls = useAnimation();

  const totalSlides = playlists.length;

  const scroll = useCallback(
    (dir: "left" | "right" | number) => {
      setCurrentIndex((prev) => {
        let next: number;

        if (typeof dir === "number") next = dir;
        else next = dir === "left" ? prev - 1 : prev + 1;

        if (next < 0) next = totalSlides - 1;
        if (next >= totalSlides) next = 0;

        controls.start({
          x: `-${next * 100}%`,
          transition: { duration: 0.3, ease: "easeInOut" },
        });

        return next;
      });
    },
    [controls, totalSlides]
  );

  if (playlists.length === 0) return null;

  return (
    <div className="w-full">
      <div className="w-full flex flex-col rounded-2xl overflow-hidden border border-gray-200 shadow-md bg-white">

        {/* 슬라이드 영역 */}
        <div className="relative w-full h-[240px]">

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
                key={playlist.id}
                className="w-full min-w-full h-full flex items-center justify-center"
                onClick={playlist.onClick}
              >
                {/* 필요한 UI 구성 요소는 여기서 꾸며줘 */}
                <div className="text-lg font-semibold text-center">{playlist.title}</div>
              </motion.div>
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

export default MainCurationPlaylistSlider;

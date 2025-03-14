import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PlaylistCard from "./playlistCard";

type PlaylistProps = {
  id: string;
  title: string;
  imageUrl: string;
  onClick: () => void;
};

type PlaylistSliderProps = {
  title?: string;
  playlists: PlaylistProps[];
};

const PlaylistSlider: React.FC<PlaylistSliderProps> = ({ title, playlists }) => {
  const totalCards = playlists.length;
  const [currentIndex, setCurrentIndex] = useState(1); // 처음에 1번 카드가 중앙에 오도록 설정
  const [cardGap, setCardGap] = useState(220); // 기본값: 웹 카드 간격

  // 반응형 카드 간격 조정
  useEffect(() => {
    const updateCardGap = () => {
      setCardGap(window.innerWidth < 768 ? 110 : 220);
    };

    updateCardGap();
    window.addEventListener("resize", updateCardGap);
    return () => window.removeEventListener("resize", updateCardGap);
  }, []);

  // 슬라이드 이동 함수
  const scroll = (direction: "left" | "right") => {
    setCurrentIndex((prevIndex) => {
      let newIndex = direction === "left" ? prevIndex - 1 : prevIndex + 1;

      if (newIndex < 0) {
        newIndex = totalCards - 1; // 마지막 카드 → 처음으로 이동
      } else if (newIndex >= totalCards) {
        newIndex = 0; // 처음 카드 → 마지막으로 이동
      }

      return newIndex;
    });
  };

  return (
    <div className="relative w-full max-w-[900px] mx-auto mt-12 md:mt-20 flex flex-col items-center pb-20 md:pb-32">
      {/* 섹션 제목 */}
      {title && (
        <h2 className="text-base md:text-2xl font-bold text-center mb-20 md:mb-32">
          {title}
        </h2>
      )}

      {/* 슬라이더 */}
      <div className="relative flex items-center justify-center w-full h-[250px] md:h-[400px]">
        {/* 왼쪽 버튼 */}
        <motion.button
          onClick={() => scroll("left")}
          whileHover={{ scale: 1.1, opacity: 1 }}
          className="absolute left-4 md:left-12 top-1/2 transform -translate-y-1/2 text-white 
                     bg-gray-700 p-2 md:p-4 rounded-full hover:bg-gray-500 text-md md:text-2xl z-20"
        >
          {"←"}
        </motion.button>

        {/* 원형 플레이리스트 카드 슬라이더 */}
        <div className="relative flex items-center justify-center w-full px-2 md:px-6">
          {playlists.map((playlist, index) => {
            const distance = Math.abs(currentIndex - index);
            const scale = distance === 0 ? 1.2 : distance === 1 ? 1 : 0.85;
            const opacity = distance > 1 ? 0 : 1 - distance * 0.3;
            const translateX = (index - currentIndex) * cardGap;
            const translateY = distance === 0 ? -10 : distance === 1 ? 0 : 30;

            return (
              <motion.div
                key={playlist.id}
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{ scale, opacity, x: translateX, y: translateY }}
                transition={{ duration: 0.6, ease: "easeInOut" }} // 부드러운 효과 적용
                className={`absolute left-1/2 transform -translate-x-1/2 ${
                  distance > 1 ? "hidden" : "block"
                }`}
              >
                <PlaylistCard {...playlist} />
              </motion.div>
            );
          })}
        </div>

        {/* 오른쪽 버튼 */}
        <motion.button
          onClick={() => scroll("right")}
          whileHover={{ scale: 1.1, opacity: 1 }}
          className="absolute right-4 md:right-12 top-1/2 transform -translate-y-1/2 text-white 
                     bg-gray-700 p-2 md:p-4 rounded-full hover:bg-gray-500 text-md md:text-2xl z-10"
        >
          {"→"}
        </motion.button>
      </div>
    </div>
  );
};

export default PlaylistSlider;
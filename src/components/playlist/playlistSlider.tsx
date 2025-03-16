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
  const [currentIndex, setCurrentIndex] = useState(2); // 중앙에서 시작
  const [cardGap, setCardGap] = useState(200); // 기본 간격
  const [maxVisibleCards, setMaxVisibleCards] = useState(5); // 한 번에 보이는 카드 개수

  // 반응형 카드 간격 및 보이는 카드 개수 조정
  useEffect(() => {
    const updateLayout = () => {
      if (window.innerWidth < 768) {
        setCardGap(110); // 모바일 간격 좁게
        setMaxVisibleCards(3); // 모바일에서는 3장 보이도록 조정
      } else {
        setCardGap(220); // 웹 간격 넓게
        setMaxVisibleCards(5); // 웹에서는 5장 보이도록 조정
      }
    };

    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
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
    <div className="relative w-full max-w-[1200px] mx-auto md:mt-20 flex flex-col items-center md:pb-10">
      {/* 섹션 제목 */}
      {title && (
        <h2 className="text-base md:text-2xl font-bold text-center">
          {title}
        </h2>
      )}

      {/* 슬라이더 */}
      <div className="relative flex items-center justify-center w-full h-[250px] md:h-[400px]">
        {/* 왼쪽 버튼 */}
        <motion.button
          onClick={() => scroll("left")}
          whileHover={{ scale: 1.1, opacity: 1 }}
          className="absolute left-2 md:left-6 top-1/2 transform -translate-y-1/2 text-white 
                     bg-gray-700 p-2 md:p-4 rounded-full hover:bg-gray-500 text-md md:text-2xl z-20"
        >
          {"←"}
        </motion.button>

        {/* 원형 플레이리스트 카드 슬라이더 */}
        <div className="relative flex items-center justify-center w-full px-2 md:px-6">
          {playlists.map((playlist, index) => {
            const distance = Math.abs(currentIndex - index);
            
            // 모바일과 웹에서 보이는 카드 개수 다르게 설정
            const maxDistance = maxVisibleCards === 3 ? 1 : 2; 
            const scale = distance === 0 ? 1.2 : distance === 1 ? 1 : distance === maxDistance ? 0.9 : 0.75;
            const opacity = distance > maxDistance ? 0 : 1 - distance * 0.2;
            const translateX = (index - currentIndex) * cardGap;
            const translateY = distance === 0 ? -10 : distance <= maxDistance ? 0 : 20;

            return (
              <motion.div
                key={playlist.id}
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{ scale, opacity, x: translateX, y: translateY }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className={`absolute left-1/2 transform -translate-x-1/2 ${
                  distance > maxDistance ? "hidden" : "block"
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
          className="absolute right-2 md:right-6 top-1/2 transform -translate-y-1/2 text-white 
                     bg-gray-700 p-2 md:p-4 rounded-full hover:bg-gray-500 text-md md:text-2xl z-10"
        >
          {"→"}
        </motion.button>
      </div>
    </div>
  );
};

export default PlaylistSlider;
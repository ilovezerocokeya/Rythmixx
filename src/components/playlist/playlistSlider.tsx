import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import PlaylistCard from "./playlistCard";
import { debounce } from "lodash";

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

// 화면 크기에 따라 카드 간격과 최대 표시 개수를 조정하는 함수
const updateLayout = debounce((setCardGap: (gap: number) => void, setMaxVisibleCards: (count: number) => void) => {
  if (window.innerWidth < 768) {
    setCardGap(110);
    setMaxVisibleCards(3);
  } else {
    setCardGap(220);
    setMaxVisibleCards(5);
  }
}, 200);

const PlaylistSlider: React.FC<PlaylistSliderProps> = ({ title, playlists }) => {
  const totalCards = playlists.length;
  const [currentIndex, setCurrentIndex] = useState(2); // 초기 인덱스를 2로 설정하여 중앙에 배치
  const [cardGap, setCardGap] = useState(200); // 카드 간격 기본값
  const [maxVisibleCards, setMaxVisibleCards] = useState(5); // 기본적으로 한 번에 보이는 카드 개수 설정

  // 화면 크기 변경 시 카드 간격과 보이는 카드 개수를 동적으로 업데이트
  useEffect(() => {
    updateLayout(setCardGap, setMaxVisibleCards);
    window.addEventListener("resize", () => updateLayout(setCardGap, setMaxVisibleCards));
    return () => window.removeEventListener("resize", () => updateLayout(setCardGap, setMaxVisibleCards));
  }, []);

  // 슬라이드 이동 함수
  const scroll = useCallback((direction: "left" | "right") => {
    setCurrentIndex((prevIndex) => {
      const newIndex = direction === "left" ? prevIndex - 1 : prevIndex + 1;
      return newIndex < 0 ? totalCards - 1 : newIndex >= totalCards ? 0 : newIndex;
    });
  }, [totalCards]);

  return (
    <div className="relative w-full max-w-[1200px] mx-auto md:mt-20 flex flex-col items-center md:pb-10">
      {/* 섹션 제목이 존재할 경우 렌더링 */}
      {title && <h2 className="text-base md:text-2xl font-bold text-center">{title}</h2>}

      {/* 슬라이더 컨테이너 */}
      <div className="relative flex items-center justify-center w-full h-[250px] md:h-[400px]">
        
        {/* 왼쪽 이동 버튼 */}
        <motion.button
          onClick={() => scroll("left")}
          whileHover={{ scale: 1.1, opacity: 1 }}
          className="absolute left-2 md:left-6 top-1/2 transform -translate-y-1/2 text-white 
                     bg-gray-700 p-2 md:p-4 rounded-full hover:bg-gray-500 text-md md:text-2xl z-20"
        >
          {"←"}
        </motion.button>

        {/* 카드 리스트 컨테이너 */}
        <div className="relative flex items-center justify-center w-full px-2 md:px-6">
          {playlists.map((playlist, index) => {
            const distance = Math.abs(currentIndex - index); // 현재 인덱스와의 거리 계산
            const maxDistance = maxVisibleCards === 3 ? 1 : 2; // 모바일과 웹에서 보이는 카드 개수 다르게 설정
            
            // 카드 크기 및 투명도 설정
            const scale = distance === 0 ? 1.2 : distance === 1 ? 1 : distance === maxDistance ? 0.9 : 0.75;
            const opacity = distance > maxDistance ? 0 : 1 - distance * 0.2;
            const translateX = (index - currentIndex) * cardGap; // 가로 위치 설정
            const translateY = distance === 0 ? -10 : distance <= maxDistance ? 0 : 20; // 세로 위치 설정

            return (
              <motion.div
                key={playlist.id}
                initial={{ scale: 0.8, opacity: 0.5 }} // 초기 애니메이션 설정
                animate={{ scale, opacity, x: translateX, y: translateY }} // 애니메이션 적용
                transition={{ duration: 0.6, ease: "easeInOut" }} // 부드러운 애니메이션 적용
                className="absolute left-1/2 transform -translate-x-1/2"
                style={{ opacity: opacity, visibility: opacity === 0 ? "hidden" : "visible" }} // 깜빡임 방지
              >
                <PlaylistCard {...playlist} />
              </motion.div>
            );
          })}
        </div>

        {/* 오른쪽 이동 버튼 */}
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
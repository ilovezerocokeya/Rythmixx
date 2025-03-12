import React, { ReactNode, useRef, useState } from "react";
import { motion } from "framer-motion";
import PlaylistCard from "./playlistCard";

type PlaylistProps = {
  id: string;
  title: string;
  imageUrl: string;
  onClick: () => void;
};

type PlaylistSliderProps = {
  title?: ReactNode;
  playlists: PlaylistProps[];
};

const PlaylistSlider: React.FC<PlaylistSliderProps> = ({ title, playlists }) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const visibleCards = 2;

  const scroll = (direction: "left" | "right") => {
    if (!sliderRef.current) return;

    const cardWidth = 520; // 카드 1개의 너비
    const visibleCards = 2; // 한 번에 보이는 카드 수
    const totalCards = playlists.length;
    const maxIndex = Math.ceil(totalCards / visibleCards) - 1; // 최대 인덱스

    let newIndex = direction === "left" ? currentIndex - 1 : currentIndex + 1;

    // 무한 슬라이더
    if (newIndex < 0) {
      newIndex = maxIndex; // 마지막 인덱스로 이동
    } else if (newIndex > maxIndex) {
      newIndex = 0; // 처음으로 이동
    }

    setCurrentIndex(newIndex);
    sliderRef.current.scrollTo({ left: newIndex * cardWidth * visibleCards, behavior: "smooth" });
  };

  return (
    <div className="relative w-full max-w-[1020px] mx-auto">
      {/* 섹션 제목 */}
      {title && <h2 className="text-2xl font-bold text-center mb-8">{title}</h2>}

      {/* 슬라이더 컨테이너 */}
      <div className="relative flex items-center justify-center w-[1020px]">
        {/* 왼쪽 버튼 */}
        <motion.button
          onClick={() => scroll("left")}
          whileHover={{ scale: 1.1, opacity: 1 }}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 0.7 }}
          className="absolute left-[-20px] p-3 bg-gray-700 text-white rounded-full hover:bg-gray-500 text-2xl z-20"
        >
          {"←"}
        </motion.button>

        {/* 플레이리스트 카드 슬라이더 */}
        <div
          ref={sliderRef}
          className="flex gap-6 overflow-hidden whitespace-nowrap scroll-smooth w-[1040px] px-4"
          style={{
            display: "flex",
            flexWrap: "nowrap",
            overflowX: "hidden",
            scrollBehavior: "smooth",
          }}
        >
          {playlists.map((playlist) => (
            <PlaylistCard key={playlist.id} {...playlist} />
          ))}
        </div>

        {/* 오른쪽 버튼 */}
        <motion.button
          onClick={() => scroll("right")}
          whileHover={{ scale: 1.1, opacity: 1 }}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 0.7 }}
          className="absolute right-[-10px] p-3 bg-gray-700 text-white rounded-full hover:bg-gray-500 text-2xl z-10"
        >
          {"→"}
        </motion.button>
      </div>

      {/* 인디케이터 (현재 위치 표시) */}
      <div className="flex justify-center mt-4">
        {Array.from({ length: Math.ceil(playlists.length / visibleCards) }).map((_, index) => (
          <div
            key={index}
            className={`h-2 w-2 mx-1 rounded-full ${index === currentIndex ? "bg-white scale-110" : "bg-gray-500"}`}
          />
        ))}
      </div>
    </div>
  );
};

export default PlaylistSlider;
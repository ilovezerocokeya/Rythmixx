import React, { useState, useCallback } from "react";
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
  const cardsPerView = 3; // 한 번에 보이는 카드 개수
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardGap = 73;

  // 슬라이드 이동 함수
  const scroll = useCallback(
    (direction: "left" | "right") => {
      setCurrentIndex((prevIndex) => {
        if (direction === "left") {
          return prevIndex === 0 ? totalCards - cardsPerView : prevIndex - 1;
        } else {
          return prevIndex >= totalCards - cardsPerView ? 0 : prevIndex + 1;
        }
      });
    },
    [totalCards, cardsPerView]
  );

  return (
    <div className="relative w-full mx-auto -mb-15 flex flex-col items-center">
      {/* 섹션 제목 */}
      {title && <h2 className="text-base font-bold -mb-12 text-center">{title}</h2>}

      {/* 슬라이더 전체 컨테이너 */}
      <div className="relative flex items-center justify-between w-full max-w-[320px] h-[250px] px-2">
        
        {/* 왼쪽 이동 버튼 */}
        <motion.button
          onClick={() => scroll("left")}
          whileHover={{ scale: 1.1, opacity: 1 }}
          className="text-white bg-gray-700 p-2 rounded-full hover:bg-gray-500 z-20"
        >
          {"←"}
        </motion.button>

        {/* 카드 컨테이너 */}
        <div className="relative w-[290px] h-[110px] overflow-hidden">
          <motion.div
            animate={{ x: -currentIndex * cardGap }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="flex space-x-1"
          >
            {playlists.map((playlist) => (
              <motion.div key={playlist.id} whileHover={{ scale: 1.15 }}>
                <PlaylistCard {...playlist} />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* 오른쪽 이동 버튼 */}
        <motion.button
          onClick={() => scroll("right")}
          whileHover={{ scale: 1.1, opacity: 1 }}
          className="text-white bg-gray-700 p-2 rounded-full hover:bg-gray-500 z-20"
        >
          {"→"}
        </motion.button>

      </div>
    </div>
  );
};

export default PlaylistSlider;
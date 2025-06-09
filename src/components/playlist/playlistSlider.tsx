import React, { useCallback, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import PlaylistCard from "../ui/playlistCard";

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
  const totalCards = playlists.length; // 전체 카드 개수
  const cardGap = 70; // 카드 간격
  const controls = useAnimation(); // Framer Motion 애니메이션 컨트롤
  const [isDragging, setIsDragging] = useState(false); // 드래그 중인지 여부 상태
  const [, setCurrentIndex] = useState(0);

  // 슬라이드 이동 함수
  const scroll = useCallback(
    (direction: "left" | "right") => {
      
      // 현재 인덱스 상태를 업데이트하면서 다음 인덱스를 계산
      setCurrentIndex((prevIndex) => {

        // 이동 방향에 따라 인덱스를 증가 또는 감소
        const nextIndex =
          direction === "left"
            ? Math.max(0, prevIndex - 1)                         
            : Math.min(totalCards - 1, prevIndex + 1);         
  
        // Framer Motion의 애니메이션 컨트롤러를 통해 슬라이드 이동 애니메이션 실행
        controls.start({
          x: -nextIndex * cardGap,                              // 카드 하나당 이동 거리 만큼 x축 이동
          transition: { duration: 0.3, ease: "easeInOut" },     // 부드러운 easeInOut 전환 적용
        });
  
        // 상태 업데이트를 위해 nextIndex 반환
        return nextIndex;
      });
    },
    [controls, totalCards]
  );

  return (
    <div className="w-full flex flex-col gap-2">
      {/* 섹션 제목 */}
      {title && (
        <h2 className="text-sm font-semibold text-gray-900 px-4">
          {title}
        </h2>
      )}

      {/* 카드 슬라이더 */}
      <div className="relative w-full px-4 py-3 rounded-xl bg-white border border-gray-200 shadow-sm">
        <div className="relative w-full h-[115px] overflow-hidden">
          <motion.div
            animate={controls}
            drag="x"
            dragConstraints={{ left: -cardGap * (totalCards - 1), right: 0 }}
            dragElastic={0.2}
            dragMomentum={true}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex space-x-2 cursor-grab"
            onDragStart={() => setIsDragging(true)}
            onDragEnd={(event, info) => {
              setTimeout(() => setIsDragging(false), 200);
              if (info.velocity.x < -50) scroll("right");
              else if (info.velocity.x > 50) scroll("left");
            }}
          >
            {playlists.map((playlist) => (
              <PlaylistCard
                key={playlist.id}
                {...playlist}
                onClick={() => !isDragging && playlist.onClick()}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PlaylistSlider;
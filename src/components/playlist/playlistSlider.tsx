import React, { useCallback, useState } from "react";
import { motion, useAnimation } from "framer-motion";
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
  const totalCards = playlists.length; // 전체 카드 개수
  const cardGap = 70; // 카드 간격
  const controls = useAnimation(); // Framer Motion 애니메이션 컨트롤
  const [isDragging, setIsDragging] = useState(false); // 드래그 중인지 여부 상태
  let currentIndex = 0; // 인덱스 상태 제거 후 변수로 대체

  // 슬라이드 이동 함수
  const scroll = useCallback(
    (direction: "left" | "right") => {
      currentIndex = direction === "left" ? Math.max(0, currentIndex - 1) : Math.min(totalCards - 1, currentIndex + 1);
  
      controls.start({
        x: -currentIndex * cardGap,
        transition: { duration: 0.5, ease: "easeInOut" },
      });
    },
    [controls]
  );

  return (
    <div className="relative w-full mx-auto -mb-15 flex flex-col items-start">
      {/* 섹션 제목 (왼쪽 정렬) */}
      {title && <h2 className="text-base font-bold ml-6 -mb-12">{title}</h2>}

      {/* 슬라이더 전체 컨테이너 */}
      <div className="relative flex items-center justify-between w-full max-w-[320px] h-[250px] px-2">
        {/* 카드 컨테이너 */}
        <div className="relative h-[110px] mb-8 w-full overflow-hidden">
          <motion.div
            animate={controls}
            drag="x" // 드래그 가능하도록 설정
            dragConstraints={{ left: -cardGap * (totalCards - 1), right: 0 }} // 드래그 범위 설정
            dragElastic={0.2} // 드래그 탄성 설정
            dragMomentum={true} // 드래그 모멘텀 활성화
            transition={{ type: "spring", stiffness: 120, damping: 20 }} // 애니메이션 설정
            className="flex space-x-1 cursor-grab"
            onDragStart={() => setIsDragging(true)} // 드래그 시작 시 상태 변경
            onDragEnd={(event, info) => {
              setTimeout(() => setIsDragging(false), 200); // 200ms 후 드래그 상태 해제

              // 드래그 속도에 따라 자동 이동
              if (info.velocity.x < -50) {
                scroll("right");
              } else if (info.velocity.x > 50) {
                scroll("left");
              }
            }}
          >
            {/* 플레이리스트 카드 렌더링 */}
            {playlists.map((playlist) => (
              <motion.div key={playlist.id}>
                <PlaylistCard {...playlist} onClick={() => !isDragging && playlist.onClick()} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PlaylistSlider;
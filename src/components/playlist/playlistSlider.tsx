import React, { useCallback, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import CurationVideoCard from "../ui/CurationVideoCard";

// 카드 정보 타입 정의
type PlaylistProps = {
  id: string;
  title: string;
  imageUrl: string;
  onClick?: () => void;
  onDelete?: () => void;
};

// 슬라이더 전체 props 정의
type PlaylistSliderProps = {
  title?: string;
  playlists: PlaylistProps[];
};

// 카드 너비, 간격, 패딩 설정
const CARD_WIDTH = 180;
const CARD_GAP = 12;
const EXTRA_PADDING = 24;

// 총 슬라이더 너비 계산 함수
const TOTAL_WIDTH = (cardCount: number) =>
  cardCount * (CARD_WIDTH + CARD_GAP) + EXTRA_PADDING;

const PlaylistSlider: React.FC<PlaylistSliderProps> = ({ title, playlists }) => {
  const totalCards = playlists.length;
  const controls = useAnimation(); // framer-motion 제어용
  const [isDragging, setIsDragging] = useState(false); // 드래그 중 여부
  const [, setCurrentIndex] = useState(0); // 슬라이드 인덱스 상태 (렌더 목적 X)

  // 드래그 속도에 따른 수동 스크롤 이동 처리
  const scroll = useCallback(
    (direction: "left" | "right") => {
      setCurrentIndex((prevIndex) => {
        const nextIndex =
          direction === "left"
            ? Math.max(0, prevIndex - 1)
            : Math.min(totalCards - 1, prevIndex + 1);

        controls.start({
          x: -nextIndex * (CARD_WIDTH + CARD_GAP),
          transition: { duration: 0.3, ease: "easeInOut" },
        });

        return nextIndex;
      });
    },
    [controls, totalCards]
  );

  return (
    <div className="w-full flex flex-col gap-2">
      {title && (
        <h2 className="text-sm font-semibold text-gray-900 px-4">{title}</h2>
      )}

      <div className="relative w-full px-2 py-4 bg-white border border-gray-200 shadow-md rounded-2xl">
        <div className="relative w-full h-[200px] overflow-hidden pr-4">
          <motion.div
            animate={controls}
            drag="x"
            dragConstraints={{
              // 전체 너비 - 보여질 영역(320px 기준)을 기준으로 드래그 제한
              left: -Math.max(0, TOTAL_WIDTH(totalCards) - 320),
              right: 0,
            }}
            dragElastic={0.15}
            dragMomentum={true}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex cursor-grab active:cursor-grabbing space-x-3"
            style={{ width: `${TOTAL_WIDTH(totalCards)}px` }} // motion 영역 너비 지정
            onDragStart={() => setIsDragging(true)}
            onDragEnd={(event, info) => {
              // 드래그 후 속도 기준으로 좌우 이동 결정
              setTimeout(() => setIsDragging(false), 150);
              if (info.velocity.x < -50) scroll("right");
              else if (info.velocity.x > 50) scroll("left");
            }}
          >
            {playlists.map((playlist) => (
              <CurationVideoCard
                key={playlist.id}
                id={playlist.id}
                title={playlist.title}
                imageUrl={playlist.imageUrl}
                onClick={() => !isDragging && playlist.onClick?.()} // 드래그 중이 아닐 때만 클릭 허용
                onDelete={playlist.onDelete}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PlaylistSlider;
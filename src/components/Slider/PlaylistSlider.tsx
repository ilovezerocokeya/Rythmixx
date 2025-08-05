import React, { useCallback, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import CurationVideoCard from "../CommonUI/CurationVideoCard";

// 카드 정보 타입 정의
interface PlaylistProps {
  id: string;
  title: string;
  imageUrl: string;
  onClick?: () => void;
  onDelete?: () => void;
}

interface PlaylistSliderProps {
  title?: string;
  playlists: PlaylistProps[];
}

// 카드 슬라이더 너비 계산 관련 상수
const CARD_WIDTH = 180;
const CARD_GAP = 12;
const EXTRA_PADDING = 24;

const TOTAL_WIDTH = (cardCount: number) =>
  cardCount * (CARD_WIDTH + CARD_GAP) + EXTRA_PADDING;

const PlaylistSlider: React.FC<PlaylistSliderProps> = ({ title, playlists }) => {
  const totalCards = playlists.length;
  const controls = useAnimation();
  const [isDragging, setIsDragging] = useState(false);

  const scroll = useCallback(
    (direction: "left" | "right") => {
      controls.start((latest) => {
        const prevX = latest.x || 0;
        const cardStep = CARD_WIDTH + CARD_GAP;
        const maxX = 0;
        const minX = -Math.max(0, TOTAL_WIDTH(totalCards) - 320);

        const nextX =
          direction === "left"
            ? Math.min(maxX, prevX + cardStep)
            : Math.max(minX, prevX - cardStep);

        return {
          x: nextX,
          transition: { duration: 0.3, ease: "easeInOut" },
        };
      });
    },
    [controls, totalCards]
  );

  const handleClick = (playlist: PlaylistProps) => {
    if (!isDragging) {
      playlist.onClick?.();
    }
  };

  return (
    <div className="w-full flex flex-col gap-2">
      {title && (
        <h2 className="text-sm font-semibold text-gray-900 px-4">{title}</h2>
      )}

      {/* 슬라이더 전체 영역 */}
      <div className="relative w-full px-2 py-2 bg-white border border-gray-200 shadow-md rounded-2xl">
        <div className="relative w-full h-[180px] overflow-hidden pr-2">
          {totalCards > 0 ? (
            <motion.div
              animate={controls}
              drag="x"
              dragConstraints={{
                left: -Math.max(0, TOTAL_WIDTH(totalCards) - 320),
                right: 0,
              }}
              dragElastic={0.9}
              dragMomentum={true}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex cursor-grab active:cursor-grabbing space-x-3"
              style={{ width: `${TOTAL_WIDTH(totalCards)}px` }}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={(_, info) => {
                setTimeout(() => setIsDragging(false), 150);
                if (info.velocity.x < -50) scroll("right");
                else if (info.velocity.x > 50) scroll("left");
              }}
            >
              {playlists.map((playlist) => (
                <motion.div key={playlist.id} className="shadow-sm rounded-xl">
                  <CurationVideoCard
                    id={playlist.id}
                    title={playlist.title}
                    imageUrl={playlist.imageUrl}
                    onClick={() => handleClick(playlist)}
                    onDelete={playlist.onDelete}
                    variant="small"
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
              아직 영상이 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaylistSlider;
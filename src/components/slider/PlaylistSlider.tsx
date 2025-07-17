import React, { useCallback, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import CurationVideoCard from "../ui/CurationVideoCard";

// 개별 카드 정보 타입 정의
type PlaylistProps = {
  id: string;
  title: string;
  imageUrl: string;
  onClick?: () => void;
  onDelete?: () => void;
};

// 슬라이더 컴포넌트에 전달되는 props 타입 정의
type PlaylistSliderProps = {
  title?: string;
  playlists: PlaylistProps[];
};

// 카드 UI 관련 상수 정의
const CARD_WIDTH = 180;
const CARD_GAP = 12;
const EXTRA_PADDING = 24;

// 전체 슬라이더 너비 계산 함수
const TOTAL_WIDTH = (cardCount: number) =>
  cardCount * (CARD_WIDTH + CARD_GAP) + EXTRA_PADDING;

// 메인 슬라이더 컴포넌트
const PlaylistSlider: React.FC<PlaylistSliderProps> = ({ title, playlists }) => {
  const totalCards = playlists.length;
  const controls = useAnimation(); 
  const [isDragging, setIsDragging] = useState(false);
  const [, setCurrentIndex] = useState(0);

  // 좌우로 슬라이드할 때 실행되는 함수
  const scroll = useCallback(
    (direction: "left" | "right") => {
      setCurrentIndex((prevIndex) => {
        const nextIndex =
          direction === "left"
            ? Math.max(0, prevIndex - 1)
            : Math.min(totalCards - 1, prevIndex + 1);

        controls.start({
          x: -nextIndex * (CARD_WIDTH + CARD_GAP), // 카드 하나 너비만큼 이동
          transition: { duration: 0.3, ease: "easeInOut" }, // 부드러운 이동
        });

        return nextIndex;
      });
    },
    [controls, totalCards]
  );

  return (
    <div className="w-full flex flex-col gap-2">
      {/* 섹션 제목 */}
      {title && (
        <h2 className="text-sm font-semibold text-gray-900 px-4">{title}</h2>
      )}

      {/* 카드 슬라이더 영역 */}
      <div className="relative w-full px-2 py-2 bg-white border border-gray-200 shadow-md rounded-2xl">
        <div className="relative w-full h-[180px] overflow-hidden pr-2">
          <motion.div
            animate={controls} // 외부에서 제어하는 애니메이션 적용
            drag="x" // 수평 드래그 가능
            dragConstraints={{
              left: -Math.max(0, TOTAL_WIDTH(totalCards) - 320), // 왼쪽 드래그 한계
              right: 0, // 오른쪽 드래그 한계
            }}
            dragElastic={0.9} // 드래그 탄성도 (끝에서 튕김 정도)
            dragMomentum={true} // 드래그 후 관성 효과
            transition={{ duration: 0.3, ease: "easeInOut" }} // 기본 트랜지션
            className="flex cursor-grab active:cursor-grabbing space-x-3"
            style={{ width: `${TOTAL_WIDTH(totalCards)}px` }} // 슬라이더 너비 설정
            onDragStart={() => setIsDragging(true)} // 드래그 시작
            onDragEnd={(_, info) => {
              setTimeout(() => setIsDragging(false), 150); // 클릭 방지용 지연 해제
              if (info.velocity.x < -50) scroll("right"); // 오른쪽으로 슬라이드
              else if (info.velocity.x > 50) scroll("left"); // 왼쪽으로 슬라이드
            }}
          >
            {/* 개별 카드 렌더링 */}
            {playlists.map((playlist) => (
              <motion.div
                key={playlist.id}
                whileHover={{ scale: 1.05 }} // 마우스 호버 시 확대
                transition={{ type: "spring", stiffness: 300 }} // 부드러운 스프링 효과
                className="shadow-sm hover:shadow-lg rounded-xl"
              >
                <CurationVideoCard
                  id={playlist.id}
                  title={playlist.title}
                  imageUrl={playlist.imageUrl}
                  onClick={() => !isDragging && playlist.onClick?.()} // 드래그 중이 아닐 때만 클릭 실행
                  onDelete={playlist.onDelete}
                  variant="small" // 카드 크기 옵션
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PlaylistSlider;
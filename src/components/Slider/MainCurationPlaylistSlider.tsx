import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CurationVideoCard from "../CommonUI/CurationVideoCard";

type PlaylistProps = {
  id: string;
  title: string;
  imageUrl: string;
  onClick?: () => void;
  onDelete?: () => void;
};

interface MainCurationPlaylistSliderProps {
  playlists: PlaylistProps[];
  title?: string;
}

const MainCurationPlaylistSlider: React.FC<MainCurationPlaylistSliderProps> = ({
  playlists,
  title,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const controls = useAnimation();
  const intervalRef = useRef<number | null>(null);

  const isSingleSlide = playlists.length === 1;

  // 자동 슬라이드 전환 (길이/단일 여부 변경 시 재설정)
  useEffect(() => {
    if (isSingleSlide) return;

    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1 >= playlists.length ? 0 : prev + 1));
    }, 5000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isSingleSlide, playlists.length]);

  // 플레이리스트 길이가 줄었을 때 인덱스 보정
  useEffect(() => {
    if (currentIndex >= playlists.length && playlists.length > 0) {
      setCurrentIndex(0);
    }
  }, [playlists.length, currentIndex]);

  // 인덱스 변경 시 애니메이션
  useEffect(() => {
    controls.start({
      x: `-${currentIndex * 100}%`,
      transition: { duration: 0.3, ease: "easeInOut" },
    });
  }, [currentIndex, controls]);

  // 슬라이드 이동
  const handleScroll = useCallback(
    (dir: "left" | "right" | number) => {
      setCurrentIndex((prev) => {
        let next =
          typeof dir === "number"
            ? dir
            : dir === "left"
            ? prev - 1
            : prev + 1;

        if (next < 0) next = playlists.length - 1;
        if (next >= playlists.length) next = 0;
        return next;
      });
    },
    [playlists.length]
  );

  // 좌우 버튼 핸들러
  const handlePrev = useCallback(() => handleScroll("left"), [handleScroll]);
  const handleNext = useCallback(() => handleScroll("right"), [handleScroll]);

  // 인디케이터 핸들러 배열 (인라인 생성 방지)
  const dotHandlers = useMemo(
    () => playlists.map((_, i) => () => handleScroll(i)),
    [playlists, handleScroll]
  );

  if (playlists.length === 0) return null;

  return (
    <div className="w-full">
      {title && (
        <div className="px-4 py-3 text-base font-semibold text-gray-800">
          {title}
        </div>
      )}

      <div className="w-full h-[280px] flex flex-col rounded-2xl overflow-hidden border border-gray-200 shadow-md bg-white">
        <div className="relative w-full h-[260px]">
          <motion.div animate={controls} className="flex w-full h-full">
            {playlists.map((playlist) => (
              <motion.div
                key={playlist.id}
                className="w-full min-w-full h-full flex items-center justify-center"
              >
                <CurationVideoCard
                  id={playlist.id}
                  title={playlist.title}
                  imageUrl={playlist.imageUrl}
                  onClick={playlist.onClick}
                  onDelete={playlist.onDelete}
                  variant="large"
                />
              </motion.div>
            ))}
          </motion.div>

          {!isSingleSlide && (
            <>
              {/* 좌우 버튼 */}
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-1 top-1/2 -translate-y-1/2 z-20
                  bg-black/50 text-white shadow-[0_4px_16px_rgba(0,0,0,0.5)]
                  rounded-xl w-10 h-10 flex items-center justify-center
                  active:scale-95 transition-all duration-200 backdrop-blur-sm border border-white/20"
                aria-label="이전 슬라이드"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="absolute right-1 top-1/2 -translate-y-1/2 z-20
                  bg-black/50 text-white shadow-[0_4px_16px_rgba(0,0,0,0.5)]
                  rounded-xl w-10 h-10 flex items-center justify-center
                  active:scale-95 transition-all duration-200 backdrop-blur-sm border border-white/20"
                aria-label="다음 슬라이드"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* 인디케이터 */}
          {!isSingleSlide && (
            <div className="relative bottom-1 left-0 w-full px-4 bg-white/80 backdrop-blur-md z-10">
              <div className="flex justify-center space-x-2 mt-2">
                {playlists.map((_, index) => (
                  <button
                    type="button"
                    key={index}
                    onClick={dotHandlers[index]}
                    aria-label={`${index + 1}번 슬라이드로 이동`}
                    aria-current={index === currentIndex ? "true" : undefined}
                    className={`transition-all duration-300 rounded-full h-1 w-4 ${
                      index === currentIndex ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainCurationPlaylistSlider;
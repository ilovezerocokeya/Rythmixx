import React, { useCallback, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import CurationVideoCard from "../ui/CurationVideoCard";

type PlaylistProps = {
  id: string;
  title: string;
  imageUrl: string;
  onClick?: () => void;
  onDelete?: () => void;
};

type PlaylistSliderProps = {
  title?: string;
  playlists: PlaylistProps[];
};

const PlaylistSlider: React.FC<PlaylistSliderProps> = ({ title, playlists }) => {
  const totalCards = playlists.length;
  const cardGap = 70;
  const controls = useAnimation();
  const [isDragging, setIsDragging] = useState(false);
  const [, setCurrentIndex] = useState(0);

  const scroll = useCallback(
    (direction: "left" | "right") => {
      setCurrentIndex((prevIndex) => {
        const nextIndex =
          direction === "left"
            ? Math.max(0, prevIndex - 1)
            : Math.min(totalCards - 1, prevIndex + 1);

        controls.start({
          x: -nextIndex * cardGap,
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
        <h2 className="text-sm font-semibold text-gray-900 px-4">
          {title}
        </h2>
      )}

      <div className="relative w-full px-1 py-3 rounded-xl bg-white border border-gray-200 shadow-sm">
        <div className="relative w-full h-[190px] overflow-hidden pr-8">
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
              <CurationVideoCard
                key={playlist.id}
                id={playlist.id}
                title={playlist.title}
                imageUrl={playlist.imageUrl}
                onClick={() => !isDragging && playlist.onClick?.()}
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
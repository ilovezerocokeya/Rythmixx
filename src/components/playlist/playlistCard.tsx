import { motion } from "framer-motion";

type PlaylistCardProps = {
  id: string;
  title: string;
  imageUrl: string;
  onClick: () => void;
};

const PlaylistCard: React.FC<PlaylistCardProps> = ({ title, imageUrl, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 0.95, y: -3 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="w-[90px] h-[110px] rounded-2xl cursor-pointer border border-gray-700 bg-gray-900 
                 flex flex-col items-center justify-between text-center relative p-1 shadow-xl"
      onClick={onClick}
    >
      {/* 플레이리스트 이미지 */}
      <div className="w-[85px] h-[65px] rounded-2xl border border-gray-700 bg-gray-800 overflow-hidden">
        <motion.img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* 플레이리스트 제목 */}
      <div className="text-[9px] text-white font-semibold w-full text-center leading-tight whitespace-normal break-words">
        {title}
      </div>
    </motion.div>
  );
};

export default PlaylistCard;
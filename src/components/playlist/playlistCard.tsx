import { motion } from "framer-motion";

type PlaylistCardProps = {
  id: string;
  title: string;
  imageUrl: string;
  onClick: () => void;
};

const PlaylistCard: React.FC<PlaylistCardProps> = ({ id, title, imageUrl, onClick }) => {
  return (
    <motion.div 
      whileHover={{
        scale: 1.1, 
        boxShadow: "0px 10px 30px rgba(0,0,0,0.3)", 
        y: -5, 
        zIndex: 10, 
      }}
      whileTap={{ scale: 0.95 }}
      className="w-[100px] h-[100px] md:w-[180px] md:h-[180px] rounded-full cursor-pointer border border-gray-700 bg-gray-900 
                 transition-transform flex flex-col items-center justify-center text-center"
      onClick={onClick}
      data-id={id}
    >
      {/* 플레이리스트 이미지 */}
      <motion.img 
        src={imageUrl} 
        alt={title} 
        className="w-full h-full object-cover rounded-full transition duration-500"
        loading="lazy"
        whileHover={{ scale: 1.05 }} 
      />

      {/* 플레이리스트 제목 */}
      <div className="absolute bottom-[-30px] md:bottom-[-50px] text-xs md:text-md bg-gray-800 text-white font-semibold px-3 py-1 rounded-full">
        {title}
      </div>
    </motion.div>
  );
};

export default PlaylistCard;
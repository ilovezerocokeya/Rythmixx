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
                 transition-transform flex flex-col items-center justify-center text-center relative"
      onClick={onClick}
      data-id={id}
    >
      {/* 플레이리스트 이미지 */}
      <motion.div className="relative w-full h-full rounded-full overflow-hidden border border-gray-700 bg-gray-900">
        <motion.img 
          src={imageUrl} 
          alt={title} 
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
          whileHover={{ scale: 1.05 }} 
        />
      </motion.div>

      {/* 플레이리스트 제목 */}
      <div className="absolute bottom-[-20px] md:bottom-[-40px] text-[10px] md:text-sm bg-gray-800 text-white font-semibold px-2 py-1 rounded-full">
        {title}
      </div>
    </motion.div>
  );
};

export default PlaylistCard;
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
      className="w-[70px] h-[70px] rounded-full cursor-pointer border border-gray-700 bg-gray-900 
                 transition-transform flex flex-col items-center justify-center text-center relative"
      onClick={onClick}
      data-id={id}
    >
      {/* 플레이리스트 이미지 */}
      <div className="w-full h-full rounded-full overflow-hidden border border-gray-700 bg-gray-900">
        <motion.img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover rounded-full"
          loading="lazy"
          whileHover={{ scale: 1.05 }} 
        />
      </div>

      {/* 플레이리스트 제목 */}
      <div className="absolute left-1/2 transform -translate-x-1/2 bottom-[-25px] 
                text-[8px] text-white font-semibold
                w-[70px] min-h-[20px] text-center leading-[10px] 
                flex flex-col justify-start items-center whitespace-normal break-words"
      >
        {title}
      </div>
    </motion.div>
  );
};

export default PlaylistCard;
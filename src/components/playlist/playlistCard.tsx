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
    scale: 1.02, // 기존보다 더 확장
    rotateX: 2, // 기울어짐 추가
    boxShadow: "0px 25px 50px rgba(0,0,0,0.5)", // 더 강한 그림자 효과
    y: -5, // 살짝 위로 띄움
    zIndex: 10, // 다른 요소 위로 올라오도록 설정
  }}
  whileTap={{ scale: 0.95 }}
  className="w-[480px] min-h-[550px] rounded-lg cursor-pointer border border-gray-700 bg-gray-900 transition-transform flex flex-col items-center"
  onClick={onClick}
  data-id={id}
  style={{
    minWidth: "490px",
    transformOrigin: "center",
  }}
>
      {/* 플레이리스트 이미지 */}
      <motion.img 
        src={imageUrl} 
        alt={title} 
        className="w-full h-[75%] object-cover rounded-t-lg transition duration-500"
        loading="lazy"
        whileHover={{ scale: 1.05, rotate: -2 }} // 살짝 기울어지는 효과
      />

      {/* 플레이리스트 제목 */}
      <div className="h-[25%] flex items-center justify-center bg-gray-800 text-white text-xl font-semibold p-3 w-full">
        {title}
      </div>

      {/* 재생 버튼 */}
      <motion.div
        whileHover={{ scale: 1.3, rotate: 10 }}
        whileTap={{ scale: 0.9 }}
        className="absolute bottom-5 right-5 bg-white text-black p-3 rounded-full shadow-lg"
      >
        ▶️
      </motion.div>
    </motion.div>
  );
};

export default PlaylistCard;
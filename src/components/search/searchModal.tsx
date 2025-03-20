import React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

type PlaylistProps = {
  id: string;
  title: string;
  imageUrl: string;
};

type SearchModalProps = {
  isOpen: boolean;
  closeModal: () => void;
  filteredPlaylists: PlaylistProps[];
};

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, closeModal, filteredPlaylists }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50 pointer-events-auto" // 배경 클릭 이벤트 감지 가능
      onClick={closeModal} // 모달 바깥 클릭 시 닫기
    
    >
    {/* 모달 컨테이너 */}
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }} // 처음에는 약간 작고 아래 있음
      animate={{ opacity: 1, scale: 1, y: 0 }} // 나타날 때 부드럽게 커짐
      exit={{ opacity: 0, scale: 0.95, y: 20 }} // 닫힐 때 다시 작아짐
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="absolute top-50 left-1/2 transform -translate-x-1/2 w-[280px] h-auto bg-gray-800 text-white p-5 rounded-lg shadow-xl backdrop-blur-md border border-gray-700 pointer-events-auto" 
        onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 닫히지 않도록 방지
      >
        {/* 닫기 버튼 */}
        <button
          onClick={closeModal}
          className="absolute top-2 right-2 text-gray-400 hover:text-white transition"
        >
          <X size={20} />
        </button>

        {/* 제목 */}
        <h2 className="text-lg font-bold mb-3 text-center">🔍 검색 결과</h2>

        {/* 검색 결과 목록 */}
        {filteredPlaylists.length > 0 ? (
          <ul className="space-y-2">
            {filteredPlaylists.map((playlist) => (
              <li
                key={playlist.id}
                className="p-3 bg-gray-600 rounded-md hover:bg-gray-500 cursor-pointer transition"
              >
                {playlist.title}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 text-center">검색 결과가 없습니다.</p>
        )}
      </motion.div>
    </div>
  );
};

export default SearchModal;
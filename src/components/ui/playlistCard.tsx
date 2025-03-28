import { memo } from "react";

type PlaylistCardProps = {
  id: string;
  title: string;
  imageUrl: string; 
  onClick: () => void;
};

const PlaylistCard: React.FC<PlaylistCardProps> = ({ title, imageUrl, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="w-[90px] h-[110px] rounded-2xl cursor-pointer border border-gray-700 bg-gray-900 
                 flex flex-col items-center justify-between text-center relative p-1 shadow-xl
                 transition-transform duration-200 transform hover:scale-[0.95] hover:-translate-y-1 active:scale-[0.95]"
    >
      {/* 플레이리스트 이미지 */}
      <div className="w-[85px] h-[65px] rounded-2xl border border-gray-700 bg-gray-800 overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover rounded-2xl"
        />
      </div>

      {/* 플레이리스트 제목 */}
      <div className="text-[9px] text-white font-semibold w-full text-center leading-tight whitespace-normal break-words">
        {title}
      </div>
    </div>
  );
};

export default memo(PlaylistCard);
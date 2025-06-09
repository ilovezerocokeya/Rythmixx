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
      className="w-[100px] h-[110px] rounded-xl bg-white border border-gray-200 
                 flex flex-col items-center justify-start text-center shadow-md hover:shadow-lg 
                 transition-all duration-200"
    >
      {/* 플레이리스트 이미지 */}
      <div className="w-[88px] h-[66px] rounded-xl overflow-hidden bg-gray-100">
        <img
          src={imageUrl}
          alt={title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
        />
      </div>

      {/* 플레이리스트 제목 */}
      <p className="text-[12px] text-gray-900 font-medium mt-2 px-2 leading-snug line-clamp-1">
        {title}
      </p>
    </div>
  );
};

export default memo(PlaylistCard);
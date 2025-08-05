import { useLikeStore } from "@/stores/useLikeStore";
import { useModalStore } from "@/stores/useModalStore";
import { useAuthStore } from "@/stores/useAuthStore";
import clsx from "clsx";
import { motion } from "framer-motion";

interface CurationVideoCardProps {
  id: string;
  title: string;
  imageUrl: string;
  onClick?: () => void;
  onDelete?: () => void;
  variant?: "xs" | "small" | "large";
};

const CurationVideoCard: React.FC<CurationVideoCardProps> = ({
  id,
  title,
  imageUrl,
  onClick,
  onDelete,
  variant = "small",
}) => {
  const isLiked = useLikeStore((state) => !!state.liked[id]);
  const toggleLike = useLikeStore((state) => state.toggleLike);
  const user = useAuthStore((state) => state.user);
  const openLoginModal = useModalStore((state) => state.open);

  // 좋아요 버튼 클릭 시 처리 함수
  const handleLikeButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!user) {
      openLoginModal("login");
      return;
    }
    toggleLike({
      playlist_id: id,
      title,
      image_url: imageUrl,
    });
  };

  // 삭제 버튼 클릭 시 처리 함수
  const handleDeleteButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); 
    onDelete?.();
  };

  return (
    <div
      className={clsx(
        "relative flex-shrink-0 snap-start bg-white rounded-lg shadow p-2",
        variant === "xs"
          ? "w-[95px] h-[100px]"
          : variant === "small"
          ? "w-[180px]"
          : "w-[300px] h-[240px]"
      )}
    >
      {/* 썸네일 */}
      {variant === "xs" ? (
        <div
          onClick={onClick}
          className="aspect-[3/2] w-full rounded-md overflow-hidden select-none cursor-pointer bg-gray-100"
        >
          <img
            src={imageUrl}
            alt={title}
            onClick={onClick}
            className="w-full h-[64px] object-cover rounded-md select-none transition cursor-pointer"
            draggable={false}
          />
        </div>
      ) : (
        <img
          src={imageUrl}
          alt={title}
          onClick={onClick}
          className={clsx(
            "w-full object-cover rounded-md select-none transition cursor-pointer",
            variant === "small" ? "h-[120px]" : "h-[180px]"
          )}
          draggable={false}
        />
      )}

      {/* 타이틀 */}
      <div
        className={clsx(
          "mt-[8px] font-medium text-center select-none leading-tight cursor-default line-clamp-2",
          variant === "xs"
            ? "text-[10px] h-[26px]"
            : variant === "small"
            ? "text-[13px] h-[34px]"
            : "text-[14px] h-[36px] px-4"
        )}
      >
        {title}
      </div>

      {/* 좋아요 & 삭제 버튼 */}
      {onDelete ? (
        <button
          onClick={handleDeleteButtonClick}
          className="absolute top-2 right-2 bg-white/20 hover:bg-white/40 text-white w-6 h-6 flex items-center 
                     justify-center rounded-full text-base font-semibold shadow-md transition-all duration-150"
          title="삭제"
        >
          ×
        </button>
      ) : (
        <motion.button
          key={isLiked ? "liked" : "unliked"}
          animate={{ scale: [1, 1.4, 1] }}
          transition={{ duration: 0.3 }}
          onClick={handleLikeButtonClick}
          className={clsx(
            "absolute flex items-center justify-center rounded-full shadow ring-1 ring-white/80 hover:scale-110 transition",
            variant === "xs"
              ? "top-[2px] right-[2px] w-5 h-5 text-[14px]"
              : "top-1 right-1 w-7 h-7 text-2xl"
          )}
          style={{ backgroundColor: "rgba(255,255,255,0.9)", color: "#ef4444" }}
          title="좋아요"
        >
          {isLiked ? "♥" : "♡"}
        </motion.button>
      )}
    </div>
  );
};

export default CurationVideoCard;
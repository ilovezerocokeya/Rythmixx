import clsx from "clsx";

type CurationVideoCardProps = {
  id: string;
  title: string;
  imageUrl: string;
  onClick?: () => void;
  onDelete?: () => void;
  variant?: "small" | "large";
};

const CurationVideoCard: React.FC<CurationVideoCardProps> = ({
  title,
  imageUrl,
  onClick,
  onDelete,
  variant = "small",
}) => {
  return (
    <div
      className={clsx(
        "relative flex-shrink-0 snap-start bg-white rounded-lg shadow p-2",
        variant === "small"
          ? "w-[180px]"
          : "w-[340px] h-[240px]"
      )}
    >
      {/* 썸네일 이미지 */}
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

      {/* 플레이리스트 제목 */}
      <div
        className={clsx(
          "mt-2 text-[13px] font-medium leading-snug line-clamp-2 text-center select-none cursor-default",
          variant === "small" ? "h-[38px]" : "px-4"
        )}
      >
        {title}
      </div>

      {/* 삭제 버튼 */}
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute top-2 right-2 bg-white/20 hover:bg-white/40 text-white w-6 h-6 flex items-center justify-center rounded-full text-base font-semibold shadow-md transition-all duration-150"
          title="삭제"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default CurationVideoCard;
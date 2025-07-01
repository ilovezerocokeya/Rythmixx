type CurationVideoCardProps = {
  id: string;
  title: string;
  imageUrl: string;
  onClick?: () => void;
  onDelete?: () => void;
};

const CurationVideoCard: React.FC<CurationVideoCardProps> = ({
  title,
  imageUrl,
  onClick,
  onDelete,
}) => {
  return (
    <div
      className="relative w-[180px] flex-shrink-0 snap-start bg-white rounded-lg shadow p-2"
      onClick={onClick}
    >
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-[120px] object-cover rounded-md select-none"
        draggable={false}
      />
      <div className="mt-2 text-[13px] font-medium leading-snug line-clamp-2 h-[40px]">
        {title}
      </div>
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
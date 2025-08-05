import React from 'react';
import { CATEGORY_LABELS, CATEGORY_ORDER, CategoryType } from '@/constants/curation';

export type ExtendedCategoryType = CategoryType | 'all';

interface ControlPanelProps {
  selectedCategory: ExtendedCategoryType;
  setSelectedCategory: (category: ExtendedCategoryType) => void;
  videoId: string;
  setVideoId: (id: string) => void;
  handleAdd: () => void;
}

const EditCurationControlPanel: React.FC<ControlPanelProps> = ({
  selectedCategory,
  setSelectedCategory,
  videoId,
  setVideoId,
  handleAdd,
}) => {
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value as ExtendedCategoryType);
  };

  const handleVideoIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVideoId(e.target.value);
  };

  return (
    <div className="space-y-3">
      <label className="block font-medium text-gray-700">카테고리 선택</label>

      <select
        value={selectedCategory}
        onChange={handleCategoryChange}
        className="w-full p-2 border rounded-md"
      >
        {(['all', ...CATEGORY_ORDER] as ExtendedCategoryType[]).map((key) => (
          <option key={key} value={key}>
            {key === 'all' ? '전체 보기' : CATEGORY_LABELS[key]}
          </option>
        ))}
      </select>

      {selectedCategory !== 'all' && (
        <>
          <input
            type="text"
            placeholder="유튜브 영상 URL 또는 ID 입력"
            value={videoId}
            onChange={handleVideoIdChange}
            className="w-full p-2 border rounded-md"
          />

          <button
            onClick={handleAdd}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 active:scale-95 transition-transform duration-150"
          >
            영상 추가
          </button>
        </>
      )}
    </div>
  );
};

export default EditCurationControlPanel;
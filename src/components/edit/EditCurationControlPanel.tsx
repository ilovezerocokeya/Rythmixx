import React from 'react';
import { CATEGORY_LABELS, CATEGORY_ORDER } from '@/constants/curation';
import { CategoryType } from '@/stores/useCurationStore';

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
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value as ExtendedCategoryType);
  };

  return (
    <div className="space-y-3">
      <label className="block font-medium text-gray-700">카테고리 선택</label>

      {/* 카테고리 드롭다운 */}
      <select
        value={selectedCategory}
        onChange={handleChange} // 카테고리 변경 시 setSelectedCategory 실행
        className="w-full p-2 border rounded-md"
      >
        {(['all', ...CATEGORY_ORDER] as ExtendedCategoryType[]).map((key) => (
          <option key={key} value={key}>
            {CATEGORY_LABELS[key as CategoryType] ?? '전체 보기'}
          </option>
        ))}
      </select>

      {/* '전체'가 아닐 때만 입력창과 추가 버튼 표시 */}
      {selectedCategory !== 'all' && (
        <>
          {/* 유튜브 영상 URL 또는 ID 입력 필드 */}
          <input
            type="text"
            placeholder="유튜브 영상 URL 또는 ID 입력"
            value={videoId}
            onChange={(e) => setVideoId(e.target.value)} // 입력값 상태 업데이트
            className="w-full p-2 border rounded-md"
          />

          {/* 영상 추가 버튼 */}
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
'use client';

import React, { useCallback, useMemo } from 'react';
import { CategoryType, CATEGORY_LABELS, CATEGORY_ORDER } from '@/constants/curation';

type ExtendedCategoryType = CategoryType | 'all';

type EditCurationControlPanelProps = {
  selectedCategory: ExtendedCategoryType;
  onChangeCategory: (next: ExtendedCategoryType) => void;
  videoId: string;
  onChangeVideoId: (v: string) => void;
  onAdd: () => void;
};

const EditCurationControlPanel: React.FC<EditCurationControlPanelProps> = ({
  selectedCategory,
  onChangeCategory,
  videoId,
  onChangeVideoId,
  onAdd,
}) => {
  // 카테고리 옵션은 고정된 배열이므로 useMemo로 재사용
  const categoryOptions = useMemo<ExtendedCategoryType[]>(
    () => ['all', ...CATEGORY_ORDER],
    []
  );

  // 카테고리 변경 시 실행되는 핸들러
  const handleCategoryChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChangeCategory(e.target.value as ExtendedCategoryType);
    },
    [onChangeCategory]
  );

  // 동영상 URL 또는 ID 입력 변경 시 실행되는 핸들러
  const handleVideoChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChangeVideoId(e.target.value);
    },
    [onChangeVideoId]
  );

  const handleAddClick = useCallback(() => {
    onAdd();
  }, [onAdd]);

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <label className="block font-medium text-gray-700">카테고리 선택</label>
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="w-full p-2 border rounded-md"
        >
          {categoryOptions.map((key) => (
            <option key={key} value={key}>
              {CATEGORY_LABELS[key]}
            </option>
          ))}
        </select>
      </div>

      {selectedCategory !== 'all' && (
        <>
          <input
            type="text"
            placeholder="유튜브 영상 URL 또는 ID 입력"
            value={videoId}
            onChange={handleVideoChange}
            className="w-full p-2 border rounded-md"
          />
          <button
            onClick={handleAddClick}
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
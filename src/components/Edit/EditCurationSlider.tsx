'use client';

import React, { useCallback, useMemo } from 'react';
import MainCurationPlaylistSlider from '@/components/Slider/MainCurationPlaylistSlider';
import PlaylistSlider from '@/components/Slider/PlaylistSlider';
import { CategoryType } from '@/constants/curation';

type ExtendedCategoryType = CategoryType | 'all';

type SliderConfig = {
  category: ExtendedCategoryType;
  title: string;
  playlists: {
    id: string;
    title: string;
    imageUrl: string;
    onClick?: () => void;
    onDelete?: () => void;
  }[];
};

type CurationItem = { id: string; title: string; imageUrl: string; youtube_url: string };
type CurationVideosByCategory = Record<CategoryType, CurationItem[]>;

type EditCurationSliderProps = {
  selectedCategory: ExtendedCategoryType;
  sliders: SliderConfig[];
  curationVideosByCategory: CurationVideosByCategory;
  onDelete: (videoId: string) => void;
  onSave: () => void;
};

const EditCurationSlider: React.FC<EditCurationSliderProps> = ({
  selectedCategory,
  sliders,
  curationVideosByCategory,
  onDelete,
  onSave,
}) => {
  // 유튜브 링크 새 탭 열기
  const openYoutube = useCallback((url: string) => {
    window.open(url, '_blank');
  }, []);

  // thisWeek 데이터만 추출
  const thisWeekItems = useMemo(
    () => curationVideosByCategory['thisWeek'] ?? [],
    [curationVideosByCategory['thisWeek']]
  );

  // 항목별 삭제 핸들러 맵
  const deleteHandlerMap = useMemo(() => {
    const map = new Map<string, () => void>();
    for (const item of thisWeekItems) map.set(item.id, () => onDelete(item.id));
    return map;
  }, [thisWeekItems, onDelete]);

  // 항목별 클릭 핸들러 맵
  const clickHandlerMap = useMemo(() => {
    const map = new Map<string, () => void>();
    for (const item of thisWeekItems) map.set(item.id, () => openYoutube(item.youtube_url));
    return map;
  }, [thisWeekItems, openYoutube]);

  // thisWeek 슬라이더에 전달할 데이터
  const thisWeekPlaylists = useMemo(
    () =>
      thisWeekItems.map((item) => ({
        id: item.id,
        title: item.title,
        imageUrl: item.imageUrl,
        onDelete: deleteHandlerMap.get(item.id),
        onClick: clickHandlerMap.get(item.id),
      })),
    [thisWeekItems, deleteHandlerMap, clickHandlerMap]
  );

  // all 화면에서 thisWeek를 제외한 슬라이더 목록
  const otherSlidersWhenAll = useMemo(
    () => sliders.filter((s) => s.category !== 'thisWeek'),
    [sliders]
  );

  return (
    <>
      {selectedCategory === 'all' ? (
        <>
          {thisWeekPlaylists.length > 0 && (
            <MainCurationPlaylistSlider playlists={thisWeekPlaylists} />
          )}
          {otherSlidersWhenAll.map((slider) => (
            <PlaylistSlider
              key={slider.category}
              title={slider.title}
              playlists={slider.playlists}
            />
          ))}
        </>
      ) : selectedCategory === 'thisWeek' ? (
        <MainCurationPlaylistSlider playlists={thisWeekPlaylists} />
      ) : (
        sliders.map((slider) => (
          <PlaylistSlider
            key={slider.category}
            title={slider.title}
            playlists={slider.playlists}
          />
        ))
      )}
      {selectedCategory !== 'all' && (
        <button
          onClick={onSave}
          className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 active:scale-95 transition-transform duration-150 mt-6"
        >
          저장하기
        </button>
      )}
    </>
  );
};

export default EditCurationSlider;
import React, { useMemo } from 'react';
import PlaylistSlider from '@/components/Slider/PlaylistSlider';
import MainCurationPlaylistSlider from '@/components/Slider/MainCurationPlaylistSlider';
import { CATEGORY_LABELS, CATEGORY_ORDER } from '@/constants/curation';
import { CurationVideo, CategoryType } from '@/stores/useCurationStore';

type ExtendedCategoryType = CategoryType | 'all';

type EditCurationSliderAreaProps = {
  selectedCategory: ExtendedCategoryType;
  curationVideosByCategory: Record<CategoryType, CurationVideo[]>;
  handleDelete: (videoId: string) => void;
};

const EditCurationSlider: React.FC<EditCurationSliderAreaProps> = ({
  selectedCategory,
  curationVideosByCategory,
  handleDelete,
}) => {
  // 현재 선택된 카테고리에 따라 렌더링할 슬라이더 데이터를 메모이제이션 처리
  const sliders = useMemo(() => {
    // all일 경우 전체 카테고리 중 데이터가 존재하는 것만 필터링
    const targetCategories =
      selectedCategory === 'all'
        ? CATEGORY_ORDER.filter((key) => curationVideosByCategory[key]?.length > 0)
        : [selectedCategory];

    // 각 카테고리에 맞는 슬라이더 데이터를 생성
    return targetCategories.map((category) => ({
      category,
      title: `${CATEGORY_LABELS[category]} 추천 미리보기`,
      playlists: curationVideosByCategory[category].map((item) => ({
        id: item.id,
        title: item.title,
        imageUrl: item.imageUrl,
        onClick: () => window.open(item.youtube_url, '_blank'),
        // all일 경우 삭제 버튼 없이, 특정 카테고리일 경우 삭제 핸들러 설정
        onDelete: selectedCategory === 'all' ? undefined : () => handleDelete(item.id),
      })),
    }));
  }, [curationVideosByCategory, selectedCategory, handleDelete]);

  return (
    <>
      {sliders.map((slider) =>
        slider.category === 'thisWeek' ? (
          <MainCurationPlaylistSlider
            key={slider.category}
            playlists={slider.playlists}
          />
        ) : (
          <PlaylistSlider
            key={slider.category}
            title={slider.title}
            playlists={slider.playlists}
          />
        )
      )}
    </>
  );
};

export default EditCurationSlider;
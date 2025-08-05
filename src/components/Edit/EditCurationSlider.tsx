import React, { useMemo } from 'react';
import PlaylistSlider from '@/components/Slider/PlaylistSlider';
import MainCurationPlaylistSlider from '@/components/Slider/MainCurationPlaylistSlider';
import { CATEGORY_LABELS, CATEGORY_ORDER, CategoryType } from '@/constants/curation';
import { CurationVideo } from '@/stores/useCurationStore';

type ExtendedCategoryType = CategoryType | 'all';

interface EditCurationSliderAreaProps {
  selectedCategory: ExtendedCategoryType;
  curationVideosByCategory: Record<CategoryType, CurationVideo[]>;
  handleDelete: (videoId: string) => void;
}

const EditCurationSlider: React.FC<EditCurationSliderAreaProps> = ({
  selectedCategory,
  curationVideosByCategory,
  handleDelete,
}) => {
  const handleVideoOpen = (url: string) => () => window.open(url, '_blank');
  const handleVideoDelete = (id: string) => () => handleDelete(id);

  const sliders = useMemo(() => {
    const targetCategories: CategoryType[] =
      selectedCategory === 'all'
        ? CATEGORY_ORDER
        : [selectedCategory as CategoryType];

    return targetCategories.map((category) => {
      const videos = curationVideosByCategory[category] ?? [];

      const playlists = videos.map((item) => ({
        id: item.id,
        title: item.title,
        imageUrl: item.imageUrl,
        onClick: handleVideoOpen(item.youtube_url),
        onDelete: selectedCategory === 'all' ? undefined : handleVideoDelete(item.id),
      }));

      return {
        category,
        title: `${CATEGORY_LABELS[category]} 추천 미리보기`,
        playlists,
      };
    });
  }, [curationVideosByCategory, selectedCategory, handleDelete]);

  return (
    <>
      {sliders.map((slider) => {
        const SliderComponent =
          slider.category === 'thisWeek'
            ? MainCurationPlaylistSlider
            : PlaylistSlider;

        return (
          <SliderComponent
            key={slider.category}
            title={slider.title}
            playlists={slider.playlists}
          />
        );
      })}
    </>
  );
};

export default EditCurationSlider;
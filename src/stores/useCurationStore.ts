import { create } from 'zustand';
import { CATEGORY_ORDER } from '@/constants/curation'; 

// 🔧 새로운 카테고리 타입 정의
export type CategoryType =
  | 'mood'
  | 'weather'
  | 'genre'
  | 'situation'
  | 'place'
  | 'time'
  | 'thisWeek'
  | 'activity'
  | 'era'
  | 'vibe'
  | 'instrument'
  | 'language'
  | 'season'
  | 'energy'
  | 'trend';

export type CurationVideo = {
  id: string;
  title: string;
  imageUrl: string;
  thumbnail_url: string;
  youtube_url: string;
};

// 🔧 상태 인터페이스
interface CurationState {
  curationVideosByCategory: Record<CategoryType, CurationVideo[]>;

  addCurationVideo: (category: CategoryType, video: CurationVideo) => void;
  removeCurationVideo: (category: CategoryType, videoId: string) => void;
  setCurationVideos: (category: CategoryType, videos: CurationVideo[]) => void;
  reorderCurationVideos: (category: CategoryType, newVideos: CurationVideo[]) => void;
  resetCurationVideos: () => void;
}

// ✅ 카테고리별 빈 배열로 초기화된 구조 반환 (CATEGORY_ORDER 기반)
const createInitialCategories = (): Record<CategoryType, CurationVideo[]> => {
  return CATEGORY_ORDER.reduce((acc, category) => {
    acc[category] = [];
    return acc;
  }, {} as Record<CategoryType, CurationVideo[]>);
};

export const useCurationStore = create<CurationState>((set) => ({
  curationVideosByCategory: createInitialCategories(),

  addCurationVideo: (category, video) =>
    set((state) => ({
      curationVideosByCategory: {
        ...state.curationVideosByCategory,
        [category]: [...state.curationVideosByCategory[category], video],
      },
    })),

  removeCurationVideo: (category, videoId) =>
    set((state) => ({
      curationVideosByCategory: {
        ...state.curationVideosByCategory,
        [category]: state.curationVideosByCategory[category].filter(
          (v) => v.id !== videoId
        ),
      },
    })),

  setCurationVideos: (category, videos) =>
    set((state) => ({
      curationVideosByCategory: {
        ...state.curationVideosByCategory,
        [category]: videos,
      },
    })),

  reorderCurationVideos: (category, newVideos) =>
    set((state) => ({
      curationVideosByCategory: {
        ...state.curationVideosByCategory,
        [category]: newVideos,
      },
    })),

  resetCurationVideos: () => ({
    curationVideosByCategory: createInitialCategories(),
  }),
}));
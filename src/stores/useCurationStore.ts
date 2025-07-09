import { create } from 'zustand';
import { CATEGORY_ORDER } from '@/constants/curation';
import { fetchCurationVideosByCategory } from '@/components/apis/supabaseCuration';

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

interface CurationState {
  curationVideosByCategory: Record<CategoryType, CurationVideo[]>;
  isFetching: boolean;
  addCurationVideo: (category: CategoryType, video: CurationVideo) => void;
  removeCurationVideo: (category: CategoryType, videoId: string) => void;
  setCurationVideos: (category: CategoryType, videos: CurationVideo[]) => void;
  reorderCurationVideos: (category: CategoryType, newVideos: CurationVideo[]) => void;
  resetCurationVideos: () => void;
  fetchAllCurationVideos: () => Promise<void>;
}

const createInitialCategories = (): Record<CategoryType, CurationVideo[]> => {
  return CATEGORY_ORDER.reduce((acc, category) => {
    acc[category] = [];
    return acc;
  }, {} as Record<CategoryType, CurationVideo[]>);
};

export const useCurationStore = create<CurationState>((set, get) => ({
  curationVideosByCategory: createInitialCategories(),
  isFetching: false,

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

  fetchAllCurationVideos: async () => {
    const { isFetching } = get();
    if (isFetching) return;

    set({ isFetching: true, curationVideosByCategory: createInitialCategories() });

    try {
      const results = await Promise.allSettled(
        CATEGORY_ORDER.map((category) => fetchCurationVideosByCategory(category))
      );

      const updated: Record<CategoryType, CurationVideo[]> = CATEGORY_ORDER.reduce(
        (acc, category, index) => {
          const result = results[index];
          acc[category] =
            result.status === 'fulfilled' ? result.value : [];
          return acc;
        },
        {} as Record<CategoryType, CurationVideo[]>
      );

      set({ curationVideosByCategory: updated });
    } catch (err) {
      console.error('큐레이션 영상 전체 불러오기 실패:', err);
    } finally {
      set({ isFetching: false });
    }
  },
}));
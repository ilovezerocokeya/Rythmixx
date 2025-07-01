import { create } from 'zustand';

/* ----------------------------- 🔷 타입 정의 ----------------------------- */
export type CategoryType = 'mood' | 'weather' | 'genre' | 'situation' | 'place';

export type CurationVideo = {
  id: string;
  title: string;
  imageUrl: string;
  thumbnail_url: string;
  youtube_url: string;
};

/* ----------------------------- 🔷 상태 타입 ----------------------------- */
interface CurationState {
  curationVideosByCategory: Record<CategoryType, CurationVideo[]>;

  addCurationVideo: (category: CategoryType, video: CurationVideo) => void;
  removeCurationVideo: (category: CategoryType, videoId: string) => void;
  setCurationVideos: (category: CategoryType, videos: CurationVideo[]) => void;
  reorderCurationVideos: (category: CategoryType, newVideos: CurationVideo[]) => void;
  resetCurationVideos: () => void;
}

/* ----------------------------- 🔷 초기화 함수 ----------------------------- */
const createInitialCategories = (): Record<CategoryType, CurationVideo[]> => ({
  mood: [],
  weather: [],
  genre: [],
  situation: [],
  place: [],
});

/* ----------------------------- 🔷 Zustand 스토어 ----------------------------- */
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

  resetCurationVideos: () =>
    set(() => ({
      curationVideosByCategory: createInitialCategories(),
    })),
}));
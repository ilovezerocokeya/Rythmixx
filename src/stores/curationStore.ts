import { create } from 'zustand';

export type CategoryType = 'mood' | 'weather' | 'genre' | 'situation' | 'place';

export type CurationVideo = {
  id: string;
  title: string;
  imageUrl: string;
  thumbnail_url: string;
  youtube_url: string;
};

// 상태 인터페이스
interface CurationState {
  curationVideosByCategory: Record<CategoryType, CurationVideo[]>;

  addCurationVideo: (category: CategoryType, video: CurationVideo) => void;
  removeCurationVideo: (category: CategoryType, videoId: string) => void;
  setCurationVideos: (category: CategoryType, videos: CurationVideo[]) => void;
  reorderCurationVideos: (category: CategoryType, newVideos: CurationVideo[]) => void;
  resetCurationVideos: () => void;
}

// 카테고리별 빈 배열로 초기화된 구조 반환
const createInitialCategories = (): Record<CategoryType, CurationVideo[]> => ({
  mood: [],
  weather: [],
  genre: [],
  situation: [],
  place: [],
});


export const useCurationStore = create<CurationState>((set) => ({
  
  curationVideosByCategory: createInitialCategories(), // 초기 상태 설정

  // 특정 카테고리에 비디오 추가
  addCurationVideo: (category, video) =>
    set((state) => ({
      curationVideosByCategory: {
        ...state.curationVideosByCategory,
        [category]: [...state.curationVideosByCategory[category], video],
      },
    })),

  // 특정 카테고리에서 비디오 제거
  removeCurationVideo: (category, videoId) =>
    set((state) => ({
      curationVideosByCategory: {
        ...state.curationVideosByCategory,
        [category]: state.curationVideosByCategory[category].filter(
          (v) => v.id !== videoId
        ),
      },
    })),

  // 특정 카테고리에 비디오 배열 통째로 설정
  setCurationVideos: (category, videos) =>
    set((state) => ({
      curationVideosByCategory: {
        ...state.curationVideosByCategory,
        [category]: videos,
      },
    })),

  // 특정 카테고리의 비디오 순서 변경
  reorderCurationVideos: (category, newVideos) =>
    set((state) => ({
      curationVideosByCategory: {
        ...state.curationVideosByCategory,
        [category]: newVideos,
      },
    })),

  // 모든 카테고리 초기화
  resetCurationVideos: () =>
    set(() => ({
      curationVideosByCategory: createInitialCategories(),
    })),
}));
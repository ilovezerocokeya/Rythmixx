import { create } from 'zustand';
import { CATEGORY_ORDER } from '@/constants/curation';
import { fetchCurationVideosByCategory } from '@/utils/apis/supabaseCuration';


// 큐레이션 카테고리 타입 정의
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

// 큐레이션 영상 데이터 타입 정의
export type CurationVideo = {
  id: string;
  title: string;
  imageUrl: string;
  thumbnail_url: string;
  youtube_url: string;
  category: CategoryType;
};

// Zustand 스토어 상태 타입 정의
type CurationState = {
  curationVideosByCategory: Record<CategoryType, CurationVideo[]>;
  isFetching: boolean;
  addCurationVideo: (category: CategoryType, video: CurationVideo) => void;
  removeCurationVideo: (category: CategoryType, videoId: string) => void;
  setCurationVideos: (category: CategoryType, videos: CurationVideo[]) => void;
  reorderCurationVideos: (category: CategoryType, newVideos: CurationVideo[]) => void;
  resetCurationVideos: () => void;
  fetchAllCurationVideos: () => Promise<void>;
}

// 초기 상태 생성 함수
const createInitialCategories = (): Record<CategoryType, CurationVideo[]> => {
  return CATEGORY_ORDER.reduce((acc, category) => {
    acc[category] = [];
    return acc;
  }, {} as Record<CategoryType, CurationVideo[]>);
};

// Zustand 스토어 생성
export const useCurationStore = create<CurationState>((set, get) => ({
  curationVideosByCategory: createInitialCategories(),
  isFetching: false,

  // 영상 추가
  addCurationVideo: (category, video) =>
    set((state) => ({
      curationVideosByCategory: {
        ...state.curationVideosByCategory,
        [category]: [...state.curationVideosByCategory[category], video],
      },
    })),

  // 영상 제거
  removeCurationVideo: (category, videoId) =>
    set((state) => ({
      curationVideosByCategory: {
        ...state.curationVideosByCategory,
        [category]: state.curationVideosByCategory[category].filter(
          (v) => v.id !== videoId
        ),
      },
    })),

  // 특정 카테고리 영상 세팅
  setCurationVideos: (category, videos) =>
    set((state) => ({
      curationVideosByCategory: {
        ...state.curationVideosByCategory,
        [category]: videos,
      },
    })),

  // 특정 카테고리 영상 순서 재설정
  reorderCurationVideos: (category, newVideos) =>
    set((state) => ({
      curationVideosByCategory: {
        ...state.curationVideosByCategory,
        [category]: newVideos,
      },
    })),

  // 전체 초기화
  resetCurationVideos: () => ({
    curationVideosByCategory: createInitialCategories(),
  }),

  // 전체 큐레이션 영상 가져오기
  fetchAllCurationVideos: async () => {
    const { isFetching } = get();
    if (isFetching) return;

    set({ isFetching: true, curationVideosByCategory: createInitialCategories() });

    try {
      // 모든 카테고리 병렬 요청
      const results = await Promise.allSettled(
        CATEGORY_ORDER.map((category) => fetchCurationVideosByCategory(category))
      );

      // 요청 결과를 상태로 변환
      const updated: Record<CategoryType, CurationVideo[]> = CATEGORY_ORDER.reduce(
        (acc, category, index) => {
          const result = results[index];
          acc[category] = result.status === 'fulfilled' ? result.value : [];
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
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type MyPagePaginationState = {
  currentPage: number; 
  setCurrentPage: (page: number) => void;
  resetCurrentPage: () => void; 
}

// 페이지네이션 상태 생성
export const useMyPagePaginationStore = create<MyPagePaginationState>()(
  persist(
    (set) => ({
      currentPage: 1,
      setCurrentPage: (page) => set({ currentPage: page }), 
      resetCurrentPage: () => set({ currentPage: 1 }), 
    }),
    {
      name: 'mypage-pagination', // localStorage에 저장될 key 이름
    }
  )
);
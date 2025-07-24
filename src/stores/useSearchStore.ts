import { create } from 'zustand';

type SearchState = {
  keyword: string;
  setKeyword: (value: string) => void;
  clearKeyword: () => void;
};

export const useSearchStore = create<SearchState>((set) => ({
  keyword: '',
  setKeyword: (value) => set({ keyword: value }),
  clearKeyword: () => set({ keyword: '' }),
}));
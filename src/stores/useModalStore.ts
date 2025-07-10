import { create } from 'zustand';

type ModalType = 'login' | 'search' | 'settings' | null;

type ModalStore = {
  openModal: ModalType;
  open: (type: ModalType) => void;
  close: () => void;
};

export const useModalStore = create<ModalStore>((set) => ({
  openModal: null,
  open: (type) => set({ openModal: type }),
  close: () => set({ openModal: null }),
}));
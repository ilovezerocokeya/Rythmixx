import { create } from 'zustand';

export type User = {
  id: string;
  email: string;
  nickname: string | null;
};

type AuthState = {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  restoreUser: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  login: (user) => {
    set({ user });
    localStorage.setItem('currentUser', JSON.stringify(user));
  },

  logout: () => {
    set({ user: null });
    localStorage.removeItem('currentUser');
  },

  restoreUser: () => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        set({ user: parsedUser });
      } catch (e) {
        console.error('유저 복원 실패:', e);
        set({ user: null });
      }
    }
  },
}));
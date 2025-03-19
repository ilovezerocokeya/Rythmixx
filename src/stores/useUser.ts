import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type UserData = {
  avatar_url?: string;
  email?: string;
  email_verified?: boolean;
  full_name?: string;
  iss?: string;
  name?: string;
  phone_verified?: boolean;
  picture?: string;
  provider_id?: string;
  sub?: string;
};

type UserStore = {
  user: UserData | null;
  setUser: (user: UserData) => void;
  resetUser: () => void;
};

export const useUser = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set(() => ({ user })),
      resetUser: () => {
        set(() => ({ user: null }));
      },
    }),
    { name: 'user-storage' },
  ),
);

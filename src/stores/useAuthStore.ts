import { supabase } from '@/supabase/createClient';
import { create } from 'zustand';

// 사용자 정보 타입 정의
export type User = {
  id: string;
  email: string;
  nickname: string | null;
};

// Zustand를 통한 인증 상태 관리 타입 정의
type AuthState = {
  user: User | null | undefined;
  isAuthLoaded: boolean;
  login: (user: User) => void;
  logout: () => void;
  restoreUser: () => Promise<void>;
};

// 인증 상태 전역 저장소 생성
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthLoaded: false,

  // 로그인 시 사용자 정보 상태 저장 및 로컬에도 저장
  login: (user) => {
    set({ user });
    localStorage.setItem('currentUser', JSON.stringify(user));
  },

  // 로그아웃 시 상태 초기화 및 로컬스토리지에서 제거
  logout: () => {
    set({ user: null });
    localStorage.removeItem('currentUser');
  },

  // 앱 로드 시 로컬스토리지에 저장된 유저 정보를 상태로 복원
  restoreUser: async () => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        set({ user: parsedUser, isAuthLoaded: true });
      
        // 백그라운드에서 supabase 확인
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          const supabaseUser = data.session.user;
          set({
            user: { id: supabaseUser.id, email: supabaseUser.email ?? "", nickname: parsedUser.nickname },
          });
        }
        return;
      } catch {
        set({ user: null, isAuthLoaded: true });
      }
    } else {
      set({ user: null, isAuthLoaded: true });
    }
  },
}));
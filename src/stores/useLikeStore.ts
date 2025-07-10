import { create } from "zustand";
import { supabase } from "@/supabase/createClient";

// 좋아요한 플레이리스트 타입 정의
type LikedPlaylist = {
  playlist_id: string;
  title: string;
  image_url: string;
};

// Zustand 스토어 인터페이스 정의
interface LikeStore {
  userId: string | null;
  liked: Record<string, LikedPlaylist>;
  setUserId: (id: string) => void;
  clearLikes: () => void;
  fetchLikesFromServer: () => Promise<void>;
  toggleLike: (playlist: LikedPlaylist) => Promise<void>;
  isLiked: (playlistId: string) => boolean;
}

// Zustand 스토어 생성
export const useLikeStore = create<LikeStore>((set, get) => ({
  userId: null, // 현재 로그인한 유저 ID
  liked: {}, // 좋아요한 플레이리스트 목록 (playlist_id 기반 맵)

  // 유저 ID 설정
  setUserId: (id) => {
    set({ userId: id });
  },

  // 좋아요 초기화 (로그아웃 시 사용)
  clearLikes: () => {
    set({ userId: null, liked: {} });
  },

  // Supabase에서 좋아요 목록 불러오기
  fetchLikesFromServer: async () => {
    const { userId } = get();
    if (!userId) return;

    const { data, error } = await supabase
      .from("likes")
      .select("playlist_id, title, image_url")
      .eq("user_id", userId);

    if (error) return;

    // 불러온 데이터를 객체로 변환하여 상태에 저장
    const likedMap = data.reduce<Record<string, LikedPlaylist>>((acc, item) => {
      acc[item.playlist_id] = item;
      return acc;
    }, {});
    set({ liked: likedMap });
  },

  // 좋아요 토글 (추가 또는 삭제)
  toggleLike: async (playlist) => {
    const { userId, liked } = get();
    if (!userId) return;

    const isAlreadyLiked = !!liked[playlist.playlist_id];

    if (isAlreadyLiked) {
      // 좋아요 삭제
      const { error } = await supabase
        .from("likes")
        .delete()
        .eq("user_id", userId)
        .eq("playlist_id", playlist.playlist_id);

      if (error) return;

      const newLiked = { ...liked };
      delete newLiked[playlist.playlist_id];
      set({ liked: newLiked });

    } else {
      // 좋아요 추가 (중복 insert 방지)
      const { error } = await supabase.from("likes").insert({
        user_id: userId,
        playlist_id: playlist.playlist_id,
        title: playlist.title,
        image_url: playlist.image_url,
      });

      if (error) {
        // 중복 insert 에러 무시
        if (error.code === "23505") return;
        return;
      }

      const newLiked = {
        ...liked,
        [playlist.playlist_id]: playlist,
      };
      set({ liked: newLiked });
    }
  },

  // 해당 플레이리스트가 좋아요 되어 있는지 여부 반환
  isLiked: (playlistId) => {
    return !!get().liked[playlistId];
  },
}));
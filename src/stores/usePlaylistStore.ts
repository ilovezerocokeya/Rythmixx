import { create } from "zustand";
import { mockPreferredPlaylists, mockWeatherPlaylists } from "../mocks/mockPlaylists";

// 플레이리스트 타입 정의
type Playlist = {
    id: string;
    title: string; 
    imageUrl: string;
    onClick: () => void;
  };

// Zustand 스토어 생성
type PlaylistState = {
  preferredPlaylists: Playlist[]; // 선호 장르별 플레이리스트
  weatherPlaylists: Playlist[];   // 날씨 기반 플레이리스트
  setPlaylists: (type: "preferred" | "weather", playlists: Playlist[]) => void;
};

export const usePlaylistStore = create<PlaylistState>((set) => ({
  preferredPlaylists: mockPreferredPlaylists, // 초기값: 목업 데이터
  weatherPlaylists: mockWeatherPlaylists,

  // 플레이리스트 업데이트 함수d
  setPlaylists: (type, playlists) => 
    set((state) => ({
      ...state,
      [type === "preferred" ? "preferredPlaylists" : "weatherPlaylists"]: playlists,
    })),
}));
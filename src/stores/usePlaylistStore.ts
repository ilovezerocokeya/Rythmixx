import { create } from "zustand";
import { mockPreferredPlaylists, mockWeatherPlaylists, mockGenrePlaylists } from "../mocks/mockPlaylists";

// 플레이리스트 타입 정의
type Playlist = {
  id: string;
  title: string;
  imageUrl: string;
  onClick: () => void;
};

// Zustand 스토어 생성
type PlaylistState = {
  preferredPlaylists: Playlist[]; // 기분별 추천 플레이리스트
  weatherPlaylists: Playlist[];   // 날씨별 추천 플레이리스트
  genrePlaylists: Playlist[];     // 장르별 추천 플레이리스트
  setPlaylists: (type: "preferred" | "weather" | "genre", playlists: Playlist[]) => void;
};

export const usePlaylistStore = create<PlaylistState>((set) => ({
  preferredPlaylists: mockPreferredPlaylists, // 초기값: 기분별 음악 추천 데이터
  weatherPlaylists: mockWeatherPlaylists,    // 초기값: 날씨별 음악 추천 데이터
  genrePlaylists: mockGenrePlaylists,        // 초기값: 장르별 음악 추천 데이터

  // 플레이리스트 업데이트 함수
  setPlaylists: (type, playlists) =>
    set((state) => ({
      ...state,
      [type === "preferred"
        ? "preferredPlaylists"
        : type === "weather"
        ? "weatherPlaylists"
        : "genrePlaylists"]: playlists,
    })),
}));
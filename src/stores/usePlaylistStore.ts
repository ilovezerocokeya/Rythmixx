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
  preferredPlaylists: Playlist[];
  weatherPlaylists: Playlist[]; 
  genrePlaylists: Playlist[];   
  setPlaylists: (type: "preferred" | "weather" | "genre", playlists: Playlist[]) => void;
};

export const usePlaylistStore = create<PlaylistState>((set) => ({
  preferredPlaylists: mockPreferredPlaylists, 
  weatherPlaylists: mockWeatherPlaylists,    
  genrePlaylists: mockGenrePlaylists,        

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
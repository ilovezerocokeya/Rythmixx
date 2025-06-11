import { create } from "zustand";
import {
  mockPreferredPlaylists,
  mockWeatherPlaylists,
  mockGenrePlaylists,
} from "../mocks/mockPlaylists";

// 플레이리스트 타입 정의
type Playlist = {
  id: string;
  title: string;
  imageUrl: string;
  genre?: string;            
  keywords?: string[];    
  onClick: () => void;
};

type PlaylistCategory = "preferred" | "weather" | "genre";

type PlaylistState = {
  preferredPlaylists: Playlist[];
  weatherPlaylists: Playlist[];
  genrePlaylists: Playlist[];
  allPlaylists: Playlist[]; // ✅ 추가됨
  setPlaylists: (type: PlaylistCategory, playlists: Playlist[]) => void;
  setAllPlaylists: (playlists: Playlist[]) => void;
};

export const usePlaylistStore = create<PlaylistState>((set) => ({
  preferredPlaylists: mockPreferredPlaylists,
  weatherPlaylists: mockWeatherPlaylists,
  genrePlaylists: mockGenrePlaylists,
  allPlaylists: [
    ...mockPreferredPlaylists,
    ...mockWeatherPlaylists,
    ...mockGenrePlaylists,
  ],

  setPlaylists: (type, playlists) =>
    set((state) => ({
      ...state,
      [`${type}Playlists`]: playlists,
    })),

  setAllPlaylists: (playlists) =>
    set(() => ({
      allPlaylists: playlists,
    })),
}));
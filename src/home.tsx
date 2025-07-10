'use client';

import { useEffect } from 'react';

import useGeolocation from './hooks/useGeolocation';
import useWeather from './hooks/useWeather';
import PlaylistSlider from './components/playlist/playlistSlider';
import WeatherPlaylistSlider from './components/playlist/weatherPlaylistSlider';

import { usePlaylistStore } from './stores/usePlaylistStore';
import { useAuthStore } from './stores/useAuthStore';
import { useModalStore } from './stores/useModalStore';

import LoginModal from './components/Login/LoginModal';
import SearchModal from './components/Search/SearchModal';

const Home = () => {
  useGeolocation();
  useWeather();

  const { preferredPlaylists, genrePlaylists } = usePlaylistStore();
  const { restoreUser, user } = useAuthStore();
  const modal = useModalStore((state) => state.openModal);

  const nickname = user?.nickname ?? '게스트';

  const isLoginModalOpen = modal === 'login';
  const isSearchModalOpen = modal === 'search';

  useEffect(() => {
    restoreUser();
  }, [restoreUser]);

  return (
    <main className="flex justify-center items-center min-h-screen bg-gray-900">
      <section className="relative w-full max-w-[360px] min-h-[640px] bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden">
        
        {/* 날씨 기반 추천 */}
        <WeatherPlaylistSlider nickname={nickname} />

        {/* 추천 섹션 */}
        <div className="flex flex-col gap-6 px-4 py-6">
          <PlaylistSlider
            title="😊 기분에 따라 골라보세요!"
            playlists={preferredPlaylists}
          />
          <PlaylistSlider
            title="🎸 장르별 추천 플레이리스트"
            playlists={genrePlaylists}
          />
        </div>

        {/* 모달 */}
        {isLoginModalOpen && <LoginModal />}
        {isSearchModalOpen && <SearchModal />}
      </section>
    </main>
  );
};

export default Home;
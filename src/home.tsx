'use client';

import { useEffect } from 'react';

import useGeolocation from './hooks/useGeolocation';
import useWeather from './hooks/useWeather';
import PlaylistSlider from './components/playlist/PlaylistSlider';
import WeatherPlaylistSlider from './components/playlist/WeatherPlaylistSlider';

import { usePlaylistStore } from './stores/usePlaylistStore';
import { useAuthStore } from './stores/useAuthStore';
import { useModalStore } from './stores/useModalStore';

import LoginModal from './components/Login/LoginModal';
import SearchModal from './components/Search/SearchModal';

const Home = () => {

  const { preferredPlaylists, genrePlaylists } = usePlaylistStore(); // 추천 플레이리스트 상태 가져오기
  const { restoreUser } = useAuthStore(); // 로컬 저장소에 저장된 유저 정보 복원
  
  // 현재 열린 모달 상태 확인
  const modal = useModalStore((state) => state.openModal);
  const isLoginModalOpen = modal === 'login';
  const isSearchModalOpen = modal === 'search';

  // 현재 위치 및 날씨 정보 가져오기
  useGeolocation();
  useWeather();

  // 최초 진입 시 유저 상태 복원
  useEffect(() => {
    restoreUser();
  }, [restoreUser]);

  return (
    <main className="flex justify-center items-center min-h-screen bg-gray-900">
      <section className="relative w-full max-w-[360px] min-h-[640px] bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden">
        
        {/* 날씨 기반 추천 */}
        <WeatherPlaylistSlider />

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
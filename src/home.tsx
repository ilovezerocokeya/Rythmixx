'use client';

import { useEffect } from 'react';

import useGeolocation from './hooks/useGeolocation';
import useWeather from './hooks/useWeather';
import PlaylistSlider from './components/slider/PlaylistSlider';
import MainCurationPlaylistSlider from './components/slider/MainCurationPlaylistSlider';
import { useCurationStore } from './stores/useCurationStore';
import { useAuthStore } from './stores/useAuthStore';
import { useModalStore } from './stores/useModalStore';
import LoginModal from './components/login/LoginModal';
import SearchModal from './components/search/SearchModal';
import Header from './components/ui/Header';
import { CATEGORY_LABELS, CATEGORY_ORDER } from './constants/curation'; 

const Home = () => {
  const { curationVideosByCategory } = useCurationStore();
  const { restoreUser } = useAuthStore();

  const modal = useModalStore((state) => state.openModal);
  const isLoginModalOpen = modal === 'login';
  const isSearchModalOpen = modal === 'search';

  useGeolocation();
  useWeather();

  useEffect(() => {
    restoreUser();
  }, [restoreUser]);

  return (
    <main className="flex justify-center items-center min-h-screen bg-gray-900">
      <section className="scroll-container relative w-full max-w-[400px] h-[640px] bg-white rounded-3xl shadow-lg border border-gray-200 overflow-y-auto">
        
        {/* 헤더 */}
        <Header />

        {/* 플레이리스트 렌더링 */}
        <div className="flex flex-col gap-6 px-4 pt-12 py-6">

          {CATEGORY_ORDER.map((category) => {
            const playlists = curationVideosByCategory[category];
            if (!playlists || playlists.length === 0) return null;

            const formattedPlaylists = playlists.map((item) => ({
              id: item.id,
              title: item.title,
              imageUrl: item.imageUrl,
              onClick: () => window.open(item.youtube_url, '_blank'),
            }));

            if (category === 'thisWeek') {
              return (
                <MainCurationPlaylistSlider
                  key={category}
                  title="🎯 이번 주 추천 플리"
                  playlists={formattedPlaylists}
                />
              );
            }

            return (
              <PlaylistSlider
                key={category}
                title={`💿 ${CATEGORY_LABELS[category]} 추천`}
                playlists={formattedPlaylists}
              />
            );
          })}
        </div>

        {/* 모달 */}
        {isLoginModalOpen && <LoginModal />}
        {isSearchModalOpen && <SearchModal />}
      </section>
    </main>
  );
};

export default Home;
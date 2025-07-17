'use client';

import { useEffect, useMemo } from 'react';
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
  const modal = useModalStore((state) => state.openModal);
  const isLoginModalOpen = modal === 'login';
  const isSearchModalOpen = modal === 'search';

  useGeolocation();
  useWeather();

  // 로그인 복원 처리
  useEffect(() => {
    useAuthStore.getState().restoreUser();
  }, []);

  // 첫 진입 시 큐레이션 데이터 불러오기
  useEffect(() => {
    useCurationStore.getState().fetchAllCurationVideos();
  }, []);

  // 개발 환경에서만 상태 변경 로그 출력
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Home] curationVideosByCategory 상태 변경 감지:', curationVideosByCategory);
    }
  }, [curationVideosByCategory]);

  // 각 카테고리별 슬라이더용 데이터 포맷 캐싱
  const formattedPlaylistsByCategory = useMemo(() => {
    return CATEGORY_ORDER.reduce((acc, category) => {
      const playlists = curationVideosByCategory[category];
      acc[category] = playlists?.map((item) => ({
        id: item.id,
        title: item.title,
        imageUrl: item.imageUrl,
        onClick: () => window.open(item.youtube_url, '_blank'),
      })) ?? [];
      return acc;
    }, {} as Record<string, { id: string; title: string; imageUrl: string; onClick: () => void }[]>);
  }, [curationVideosByCategory]);

  return (
    <main className="flex justify-center items-center min-h-screen bg-gray-900">
      <section className="relative w-full max-w-[360px] h-[640px] bg-white rounded-3xl shadow-lg border border-gray-200 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="absolute top-0 left-0 shrink-0 right-0 h-[50px] z-10">
          <Header />
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 h-[50px] z-10 flex items-center justify-center border-t border-gray-200 bg-white">
          <p className="text-xs text-gray-500">© 2025 Rythmixx</p>
        </div>

        {/* 컨텐츠 */}
        <div className="absolute top-[50px] bottom-[50px] left-0 right-0 overflow-y-auto px-4 pb-6 space-y-10 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent scroll-container">
          {CATEGORY_ORDER.map((category) => {
            const playlists = formattedPlaylistsByCategory[category];
          
            if (playlists.length === 0) return null;
          
            if (category === 'thisWeek') {
              return (
                <MainCurationPlaylistSlider
                  key={category}
                  title="🎯 이번 주 추천 플리"
                  playlists={playlists}
                />
              );
            }
          
            return (
              <PlaylistSlider
                key={category}
                title={`💿 ${CATEGORY_LABELS[category]} 추천`}
                playlists={playlists}
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
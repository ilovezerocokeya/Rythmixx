import { useEffect } from 'react';

import useGeolocation from './hooks/useGeolocation';
import useWeather from './hooks/useWeather';
import PlaylistSlider from './components/playlist/playlistSlider';
import WeatherPlaylistSlider from './components/playlist/weatherPlaylistSlider';

import { usePlaylistStore } from './stores/usePlaylistStore';
import { useAuthStore } from './stores/authStore';
import { useLoginModalStore } from './stores/useLoginModalStore';
import LoginModal from './components/Login/LoginModal'; 

const Home = () => {
  useGeolocation();
  useWeather();

  const { preferredPlaylists, genrePlaylists } = usePlaylistStore();
  const restoreUser = useAuthStore((state) => state.restoreUser);
  const user = useAuthStore((state) => state.user);
  const isLoginModalOpen = useLoginModalStore((state) => state.isOpen); // 모달 상태 가져오기

  useEffect(() => {
    restoreUser();
  }, [restoreUser]);

  const nickname = user?.nickname ?? '게스트';

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="relative w-full max-w-[360px] min-h-[640px] bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        
        {/* 날씨 추천 */}
        <WeatherPlaylistSlider nickname={nickname} />

        {/* 추천 플레이리스트 */}
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

        {/* 로그인 모달 */}
        {isLoginModalOpen && <LoginModal />}
      </div>
    </div>
  );
};

export default Home;
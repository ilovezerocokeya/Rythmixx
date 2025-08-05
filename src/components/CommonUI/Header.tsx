import { useNavigate } from 'react-router-dom';
import { useModalStore } from '@/stores/useModalStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { supabase } from '@/supabase/createClient';
import WeatherDisplay from '../Weather/WeatherDisplay';

const Header = () => {
  const openModal = useModalStore((state) => state.open);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const isGuest = !user;

  // 로고 클릭 시 홈으로 이동
  const handleLogoClick = () => {
    navigate('/');
  };

  // 검색 버튼 클릭 시 검색 모달 열기
  const handleSearchModalOpen = () => {
    openModal('search');
  };

  // 마이페이지 버튼 클릭 시 이동
  const handleMyPageClick = () => {
    navigate('/mypage');
  };

  // 로그인 버튼 클릭 시 로그인 모달 열기
  const handleLoginModalOpen = () => {
    openModal('login');
  };

  // 로그아웃 처리
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert('로그아웃 실패');
      return;
    }
    logout();
    location.reload();
  };

  return (
    <div className="absolute top-0 left-0 w-full px-4 py-2 flex justify-between items-center rounded-3xl z-999 bg-white/50 backdrop-blur-sm border-b border-gray-200">
      <div className="flex items-center space-x-3">
        <button
          onClick={handleLogoClick}
          className="text-base font-bold text-blue-600 hover:text-blue-700"
        >
          Rythmixx
        </button>

        <WeatherDisplay />
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={handleSearchModalOpen}
          className="px-3 py-[4px] text-[11px] font-medium text-gray-700 border border-gray-200 rounded-full hover:bg-gray-100 transition-all"
        >
          🔍
        </button>

        {!isGuest && (
          <button
            onClick={handleMyPageClick}
            className="px-3 py-[4px] text-[11px] font-medium text-blue-500 border border-blue-500 rounded-full hover:bg-blue-500 hover:text-white transition-all"
          >
            🎶
          </button>
        )}

        {isGuest ? (
          <button
            onClick={handleLoginModalOpen}
            className="px-3 py-[4px] text-[11px] font-medium text-blue-600 border border-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition-all"
          >
            로그인
          </button>
        ) : (
          <button
            onClick={handleLogout}
            className="px-3 py-[4px] text-[11px] font-medium text-gray-600 border border-gray-300 rounded-full hover:bg-gray-100 transition-all"
          >
            로그아웃
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
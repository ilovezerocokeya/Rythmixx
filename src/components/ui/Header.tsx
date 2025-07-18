
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
        {/* 로고 */}
        <button
          onClick={() => navigate('/')}
          className="text-base font-bold text-blue-600 hover:text-blue-700"
        >
          Rythmixx
        </button>

        {/* 날씨 */}
        <WeatherDisplay />
      </div>

      <div className="flex items-center space-x-2">
        {/* 검색 버튼 */}
        <button
          onClick={() => openModal('search')}
          className="px-3 py-[4px] text-[11px] font-medium text-gray-700 border border-gray-200 rounded-full hover:bg-gray-100 transition-all"
        >
          🔍
        </button>

        {!isGuest && (
          <button
            onClick={() => navigate('/mypage')}
            className="px-3 py-[4px] text-[11px] font-medium text-blue-500 border border-blue-500 rounded-full hover:bg-blue-500 hover:text-white transition-all"
          >
            🎶
          </button>
        )}

        {/* 로그인 / 로그아웃 버튼 */}
        {isGuest ? (
          <button
            onClick={() => openModal('login')}
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
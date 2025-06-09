import WeatherDisplay from '../weather/weatherDisplay';
import { Link } from 'react-router-dom';
import LocationDisplay from '../location/locationDisplay';
import { useLoginModalStore } from '@/stores/useLoginModalStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { supabase } from '@/supabase/createClient';

const Header = () => {
  const openLoginModal = useLoginModalStore((state) => state.open);
  const { user, logout } = useAuthStore();
  const isGuest = !user;

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert('로그아웃 실패');
      return;
    }
    logout(); // 전역 상태 초기화
  };

  return (
    <div className="absolute top-0 left-0 w-full px-4 py-2 flex justify-between items-center z-30 bg-white/80 backdrop-blur-sm border-b border-gray-200">
      <div className="flex items-center space-x-2 text-sm text-gray-800 font-semibold">
        <span>
          Hello,{' '}
          <span className="text-blue-600">
            {user?.nickname || '게스트'}
          </span>
        </span>
        <WeatherDisplay />
        <LocationDisplay />
      </div>

      <div className="flex items-center space-x-2">
        {!isGuest && (
          <Link
            to="/mypage"
            className="px-3 py-[4px] text-[11px] font-medium text-blue-500 border border-blue-500 rounded-full hover:bg-blue-500 hover:text-white transition-all"
          >
            🎶
          </Link>
        )}

      {isGuest ? (
        <button
          onClick={openLoginModal}
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
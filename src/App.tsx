import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './Routers/index';
import { useLikeStore } from '@/stores/useLikeStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useWeatherStore } from '@/stores/useWeatherStore';
import useWeather from './hooks/useWeather';
import './App.css';

function App() {
  const isAuthLoaded = useAuthStore((state) => state.isAuthLoaded);
  const isWeatherLoaded = useWeatherStore((state) => state.isWeatherLoaded);

  useWeather();

  useEffect(() => {
    const initApp = async () => {
      // 유저 인증 정보 복원
      await useAuthStore.getState().restoreUser();

      // 로그인된 유저라면 좋아요 정보 초기화
      const userId = useAuthStore.getState().user?.id;
      if (userId) {
        useLikeStore.getState().setUserId(userId);
        await useLikeStore.getState().fetchLikesFromServer();
      }
    };

    initApp();
  }, []);


  if (!isAuthLoaded || !isWeatherLoaded) {
    return (
      <main className="flex justify-center items-center min-h-screen bg-gray-900">
        <section className="relative w-full max-w-[360px] h-[640px] bg-white rounded-3xl shadow-lg border border-gray-200 flex flex-col overflow-hidden">
          {/* header */}
          <div className="absolute top-0 left-0 shrink-0 right-0 h-[50px] z-10 flex justify-center items-center">
            <span className="text-sm font-bold text-blue-600">Rythmixx</span>
          </div>

          {/* footer */}
          <div className="absolute bottom-0 left-0 right-0 h-[50px] z-10 flex items-center justify-center border-t border-gray-200 bg-white">
            <p className="text-xs text-gray-500">© 2025 Rythmixx</p>
          </div>

          {/* 로딩 메시지 영역 */}
          <div className="absolute top-[50px] bottom-[50px] left-0 right-0 flex justify-center items-center">
            <p className="text-sm font-semibold text-gray-600">로딩 중...</p>
          </div>
        </section>
      </main>
    );
  }

  return <RouterProvider router={router} />;
}

export default App;
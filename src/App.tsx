import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './Routers/index';
import { supabase } from '@/supabase/createClient';
import { useLikeStore } from '@/stores/useLikeStore';
import './App.css';

function App() {
  useEffect(() => {
    const initUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        console.log(" 유저 감지됨:", user.id);
        useLikeStore.getState().setUserId(user.id);
        await useLikeStore.getState().fetchLikesFromServer();
      } else {
        console.log("로그인된 유저 없음");
      }
    };

    initUser();
  }, []);

  return <RouterProvider router={router} />;
}

export default App;
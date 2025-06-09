import { createBrowserRouter } from 'react-router-dom';
import Home from '@/home';
import SignupPage from '@/pages/SignupPage';
import Callback from '@/pages/auth/Callback';
import Mypage from '@/pages/MyPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/signup',
    element: <SignupPage />,
  },
  {
    path: '/auth/callback',
    element: <Callback />,
  },
  {
    path: '/mypage',
    element: <Mypage />,
  },
]);
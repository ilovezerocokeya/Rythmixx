import { createBrowserRouter } from 'react-router-dom';
import SignupPage from '@/pages/SignupPage';
import Callback from '@/pages/auth/Callback';
import Mypage from '@/pages/MyPage';
import EditCurationPage from '@/pages/EditCurationPage';
import Home from '@/pages/Home';

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
  {
    path: '/edit',
    element: <EditCurationPage />,
  },
]);
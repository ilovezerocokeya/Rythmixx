import { createBrowserRouter } from 'react-router-dom';
import Home from '@/home';
import SignupPage from '@/pages/SignupPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/signup',
    element: <SignupPage />,
  },
]);
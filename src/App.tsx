import PWABadge from './PWABadge.tsx';
import './App.css';
import AuthPage from './Routers/auth/AuthPage.tsx';

function App() {
  return (
    <>
      <div className="w-[320px] h-[598px] border mx-auto flex flex-col justify-center text-center">
        <PWABadge />
        <AuthPage />
      </div>
    </>
  );
}

export default App;

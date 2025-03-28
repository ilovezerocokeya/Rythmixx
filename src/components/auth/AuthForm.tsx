import { Button } from '@/components/ui/button';
import { useUser } from '@/stores/useUser';
import { supabase } from '@/supabase/createClient';
import { Provider } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const AuthForm = () => {
  const [isPorltalOpen, setIsPortalOpen] = useState<boolean>(false);
  //NOTE: currentUser 기반으로 유저 프로필 항목이 보였다 말았다 함
  const currentUser = useUser((state) => state.user);
  const setUser = useUser((state) => state.setUser);
  const resetUser = useUser((state) => state.resetUser);

  const handleSignIn = async (provider: Provider) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) console.error('로그인 실패');

    getUser();
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    resetUser();

    if (error) console.error('로그아웃 실패');
  };

  const getUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const metadata = user.user_metadata;
      setUser(metadata);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <>
      <div className="flex flex-col mx-auto">
        {!currentUser && (
          <div className="mx-auto flex flex-col justify-center items-center mb-8">
            <div className="w-full py-2 transition duration-300 ease-in-out transform hover:scale-105 active:scale-95">
              <button
                onClick={() => handleSignIn('google')}
                className="shared-button-google flex items-center space-x-4"
              >
                <div className="w-[34.84px] h-[34.84px] rounded-full flex justify-center items-center">
                  <img src="/logo/google.svg" alt="Goggle Icon" width={24} height={24} />
                </div>
                <span className="font-semibold text-[#2B2B2B]">Google로 시작하기</span>
              </button>
            </div>
            <div className="w-full py-2 transition duration-300 ease-in-out transform hover:scale-105 active:scale-95">
              <button onClick={() => handleSignIn('kakao')} className="shared-button-kakao flex items-center space-x-4">
                <div className="w-[34.84px] h-[34.84px] rounded-full flex justify-center items-center">
                  <img src="/logo/kakao.svg" alt="Kakao Icon" width={44} height={44} />
                </div>
                <span className="font-semibold text-[#2B2B2B]">Kakao로 시작하기</span>
              </button>
            </div>
          </div>
        )}
        {currentUser && (
          <>
            <Button onClick={handleSignOut}>로그아웃</Button>
            {/* TODO: 메인 페이지 하단바로 옮겨 삽입해야함 */}
            <Button onClick={() => setIsPortalOpen(true)}>유저 프로필</Button>
          </>
        )}
        {/* TODO: 메인 페이지 하단바로 옮겨 삽입해야함 */}
        {isPorltalOpen && createPortal(<div onClick={() => setIsPortalOpen(false)}>포탈임</div>, document.body)}
      </div>
    </>
  );
};

export default AuthForm;

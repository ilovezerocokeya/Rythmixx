import { Button } from '@/components/ui/button';
import { supabase } from '@/supabase/createClient';
import { Provider } from '@supabase/supabase-js';

const AuthForm = () => {
  const handleSignIn = async (provider: Provider) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) alert('로그인 실패');
    else console.log(data);
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) alert('로그아웃 실패');
  };

  return (
    <>
      <div className="flex flex-col mx-auto">
        <div className="flex flex-col justify-center items-center mb-8">
          <div className="w-full py-2 transition duration-300 ease-in-out transform hover:scale-105 active:scale-95">
            <button onClick={() => handleSignIn('google')} className="shared-button-google flex items-center space-x-4">
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
        <Button onClick={handleSignOut}>로그아웃</Button>
      </div>
    </>
  );
};

export default AuthForm;

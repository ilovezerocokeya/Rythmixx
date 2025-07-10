import { supabase } from '@/supabase/createClient';
import { useModalStore } from '@/stores/useModalStore';

const LoginModal = () => {
  const close = useModalStore((state) => state.close);

  const handleSocialLogin = async (provider: 'google' | 'kakao') => {
    console.log(`🟡 [START] handleSocialLogin 호출 - provider: ${provider}`);

    try {
      console.log('🔵 Supabase OAuth 요청 준비 중...');

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: 'http://localhost:5173/auth/callback',
          queryParams: {
            prompt: 'select_account',
          },
        },
      });

      console.log('🟢 Supabase 응답 수신 완료');
      console.log('📦 data:', data);

      if (error) {
        console.error('❌ OAuth 로그인 에러:', error.message);
        alert(`${provider} 로그인 실패: ${error.message}`);
        return;
      }

      console.log('✅ [SUCCESS] OAuth 로그인 요청 성공 - 브라우저가 자동으로 리디렉션됩니다');
    } catch (err) {
      console.error('🔥 [UNEXPECTED ERROR] 로그인 중 예외 발생:', err);
    }
  };

  const handleOverlayClick = () => close();
  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-xs z-50"
      onClick={handleOverlayClick}
    >
      <div
        onClick={stopPropagation}
        className="bg-white w-[320px] px-6 py-8 rounded-2xl shadow-xl border border-gray-200 space-y-2 relative"
      >
        <button
          onClick={close}
          aria-label="모달 닫기"
          className="absolute top-3 right-4 text-gray-400 hover:text-black text-xl font-bold"
        >
          ×
        </button>

        <h2 className="text-xl font-semibold text-gray-900 text-center">간단하게 시작해보세요</h2>
        <p className="text-sm text-gray-500 text-center">소셜 로그인을 통해 바로 시작할 수 있어요</p>

        {/* Google 로그인 */}
        <button
          onClick={() => handleSocialLogin('google')}
          className="w-full py-2 rounded-md bg-white border border-gray-300 text-sm font-semibold hover:bg-gray-100 transition flex items-center justify-center space-x-2"
        >
          <img src="/logo/google.svg" alt="Google" className="w-5 h-5" />
          <span className="text-gray-700">Google로 로그인</span>
        </button>

        {/* Kakao 로그인 */}
        <button
          onClick={() => handleSocialLogin('kakao')}
          className="w-full py-2 rounded-md bg-[#FEE500] text-sm font-semibold hover:brightness-95 transition flex items-center justify-center space-x-2"
        >
          <img src="/logo/kakao.svg" alt="Kakao" className="w-6 h-6" />
          <span className="text-[#3C1E1E]">Kakao로 로그인</span>
        </button>
      </div>
    </div>
  );
};

export default LoginModal;
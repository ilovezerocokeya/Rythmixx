import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/supabase/createClient';
import { useAuthStore } from '@/stores/useAuthStore';
import Header from '@/components/ui/Header';

const Callback = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  useEffect(() => {
    const processAuth = async () => {
      // Supabase가 세션을 처리할 수 있도록 약간의 시간 대기
      await new Promise((res) => setTimeout(res, 500));

      // 현재 세션 정보 확인
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

      if (!sessionData?.session || sessionError) {
        // 세션이 없거나 에러가 발생한 경우 홈으로 이동
        navigate('/');
        return;
      }

      const user = sessionData.session.user;

      // 전역 상태에 로그인 정보 저장
      login({
        id: user.id,
        email: user.email ?? '',
        nickname: null,
      });

      // 세션을 sessionStorage에도 저장
      sessionStorage.setItem('user', JSON.stringify(user));

      // Supabase users 테이블에서 유저 정보 조회
      const { data: existingUser, error: selectError } = await supabase
        .from('users')
        .select('nickname')
        .eq('user_id', user.id)
        .maybeSingle();

      if (selectError) {
        // 조회 중 에러 발생 시 홈으로 이동
        navigate('/');
        return;
      }

      if (!existingUser) {
        // 최초 로그인 유저라면 users 테이블에 새로 삽입
        const { error: insertError } = await supabase.from('users').insert([
          {
            user_id: user.id,
            email: user.email,
            nickname: null,
          },
        ]);

        if (insertError) {
          // 삽입 실패 시 홈으로 이동
          navigate('/');
          return;
        }

        // 가입 이후 nickname 설정 페이지로 이동
        navigate('/signup');
        return;
      }

      if (!existingUser.nickname) {
        // 닉네임이 아직 없는 유저는 signup 페이지로 이동
        navigate('/signup');
      } else {
        // 닉네임이 있는 기존 유저는 전역 상태 갱신 후 홈으로 이동
        login({
          id: user.id,
          email: user.email ?? '',
          nickname: existingUser.nickname,
        });
        navigate('/');
      }
    };

    processAuth();
  }, [navigate, login]);

  return (
    <main className="flex justify-center items-center min-h-screen bg-gray-900">
      <section className="relative w-full max-w-[360px] h-[640px] bg-white rounded-3xl shadow-lg border border-gray-200 flex flex-col overflow-hidden">
        {/* Header 고정 */}
        <div className="z-10">
          <Header />
        </div>

        {/* 본문 */}
        <div className="flex-1 flex items-center justify-center px-4 text-lg text-gray-700">
          ⏳ 로그인 처리 중입니다...⌛️
        </div>
      </section>
    </main>
  );
};

export default Callback;
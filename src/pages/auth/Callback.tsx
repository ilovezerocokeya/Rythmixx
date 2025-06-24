import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/supabase/createClient';
import { useAuthStore } from '@/stores/useAuthStore';

const Callback = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  useEffect(() => {
    const processAuth = async () => {
      console.log('[🔁] Callback 진입');
      console.log('[📍] 현재 URL:', window.location.href);
      console.log('[🔎] location.search:', window.location.search);
      console.log('[🔎] location.hash:', window.location.hash);

      // Supabase가 세션을 처리할 시간을 주기
      await new Promise((res) => setTimeout(res, 500));
      console.log('[⏳] 500ms 대기 후 getSession 호출');

      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      console.log('[📡] getSession 응답:', sessionData, sessionError);

      if (!sessionData?.session || sessionError) {
        console.warn('[⚠️] 세션 없음 또는 에러 발생');
        if (sessionError) console.error('[❌] getSession 에러:', sessionError.message);
        navigate('/');
        return;
      }

      const user = sessionData.session.user;
      console.log('[✅] 세션 확보됨, 유저 정보:', user);

      // Zustand에 초기 로그인 정보 저장 (nickname은 null)
      login({
        id: user.id,
        email: user.email ?? '',
        nickname: null,
      });

      sessionStorage.setItem('user', JSON.stringify(user));

      // users 테이블에서 조회
      const { data: existingUser, error: selectError } = await supabase
        .from('users')
        .select('nickname')
        .eq('user_id', user.id)
        .maybeSingle();

      if (selectError) {
        console.error('[❌] 유저 조회 중 에러:', selectError.message);
        navigate('/');
        return;
      }

      // users 테이블에 데이터가 없으면 insert
      if (!existingUser) {
        const { error: insertError } = await supabase.from('users').insert([
          {
            user_id: user.id,
            email: user.email,
            nickname: null, // 기본값
          },
        ]);

        if (insertError) {
          console.error('[❌] users 테이블 insert 실패:', insertError.message);
          navigate('/');
          return;
        }

        console.log('[✅] users 테이블 최초 유저 등록 완료');
        navigate('/signup');
        return;
      }

      // 닉네임 존재 여부에 따라 분기
      if (!existingUser.nickname) {
        console.log('[➡️] nickname 없음 → /signup 이동');
        navigate('/signup');
      } else {
        console.log('[➡️] nickname 있음 → 홈 이동');
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

  return <div className="text-center mt-20 text-lg">로그인 처리 중입니다...</div>;
};

export default Callback;
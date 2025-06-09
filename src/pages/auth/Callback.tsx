import { useEffect } from 'react';
import { supabase } from '@/supabase/createClient';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';

const Callback = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  useEffect(() => {
    const handleOAuthRedirect = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        console.error('인증 유저 정보 불러오기 실패:', error);
        navigate('/');
        return;
      }

      const { user } = data;

      const { data: existingUser, error: selectError } = await supabase
        .from('users')
        .select('user_id, nickname')
        .eq('user_id', user.id)
        .maybeSingle();

      if (selectError) {
        console.error('유저 정보 조회 실패:', selectError.message);
      }

      console.log('유저 닉네임 확인:', existingUser?.nickname);

      login({
        id: user.id,
        email: user.email!,
        nickname: existingUser?.nickname ?? '',
      });

      if (!existingUser || !existingUser.nickname) {
        navigate('/signup');
      } else {
        navigate('/');
      }
    };

    handleOAuthRedirect();
  }, []);

  return <div className="text-center mt-20 text-lg">로그인 중입니다...</div>;
};

export default Callback;
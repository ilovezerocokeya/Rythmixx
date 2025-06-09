import { supabase } from '@/supabase/createClient';

export const validateNickname = async (nickname: string): Promise<string | null> => {
  const trimmed = nickname.trim();

  if (!trimmed) return '닉네임을 입력해주세요.';
  if (/[^a-zA-Z0-9가-힣]/.test(trimmed)) return '특수문자는 사용할 수 없어요.';
  if (/^\d+$/.test(trimmed)) return '숫자만으로는 사용할 수 없어요.';
  if (/^\d/.test(trimmed)) return '숫자로 시작할 수 없어요.';
  if (trimmed.length < 2 || trimmed.length > 6) return '닉네임은 2~6글자여야 해요.';

  const { data, error } = await supabase
    .from('users')
    .select('nickname')
    .eq('nickname', trimmed)
    .maybeSingle();

  if (error) {
    console.error('닉네임 중복 확인 에러:', error.message);
    return '서버 오류가 발생했습니다.';
  }

  if (data) return '이미 사용 중인 닉네임입니다.';

  return null;
};
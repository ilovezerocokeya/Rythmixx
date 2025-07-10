import { supabase } from '@/supabase/createClient';

export const validateNickname = async (nickname: string): Promise<string | null> => {
  const trimmed = nickname.trim();

  // 1. 완전 공백
  if (!trimmed) return '닉네임을 입력해주세요.';

  // 2. 중간에 공백 포함 여부 확인
  if (/\s/.test(trimmed)) return '닉네임에는 공백을 포함할 수 없어요.';

  // 3. 특수문자 검사
  if (/[^a-zA-Z0-9가-힣]/.test(trimmed)) return '특수문자는 사용할 수 없어요.';

  // 4. 숫자만
  if (/^\d+$/.test(trimmed)) return '숫자만으로는 사용할 수 없어요.';

  // 5. 숫자로 시작
  if (/^\d/.test(trimmed)) return '숫자로 시작할 수 없어요.';

  // 6. 길이 검사
  if (trimmed.length < 2 || trimmed.length > 6) return '닉네임은 2~6글자여야 해요.';

  // 7. 중복 검사
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
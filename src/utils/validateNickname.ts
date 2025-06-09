export const validateNickname = (nickname: string): string | null => {
  const trimmed = nickname.trim();

  if (!trimmed) {
    return "닉네임을 입력해주세요.";
  }

  // 특수문자 포함 여부
  if (/[^a-zA-Z0-9가-힣]/.test(trimmed)) {
    return "특수문자는 사용할 수 없어요.";
  }

  // 숫자만
  if (/^\d+$/.test(trimmed)) {
    return "숫자만으로는 사용할 수 없어요.";
  }

  // 숫자로 시작
  if (/^\d/.test(trimmed)) {
    return "숫자로 시작할 수 없어요.";
  }

  // 길이 제한
  if (trimmed.length < 2 || trimmed.length > 6) {
    return "닉네임은 2~6글자여야 해요.";
  }

  return null; // 유효함
};
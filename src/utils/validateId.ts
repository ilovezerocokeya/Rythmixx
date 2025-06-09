export const validateUserId = (userId: string): string | null => {
  const trimmed = userId.trim();

  if (!trimmed) {
    return "아이디를 입력해주세요.";
  }

  // 특수문자 또는 한글 포함 여부
  if (/[^a-zA-Z0-9]/.test(trimmed)) {
    return "영문 또는 숫자만 사용할 수 있어요.";
  }

  // 숫자로 시작하는 경우
  if (/^\d/.test(trimmed)) {
    return "숫자로 시작할 수 없어요.";
  }

  // 길이 제한
  if (trimmed.length < 4 || trimmed.length > 12) {
    return "아이디는 4~12글자여야 해요.";
  }

  return null; // 유효함
};
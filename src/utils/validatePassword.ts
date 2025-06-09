export const validatePassword = (password: string): string | null => {
  const trimmed = password.trim();

  if (!trimmed) {
    return "비밀번호를 입력해주세요.";
  }

  if (/\s/.test(trimmed)) {
    return "공백은 사용할 수 없어요.";
  }

  if (trimmed.length < 8 || trimmed.length > 20) {
    return "비밀번호는 8~20자여야 해요.";
  }

  if (!/[a-z]/.test(trimmed)) {
    return "소문자를 포함해야 해요.";
  }

  if (!/[A-Z]/.test(trimmed)) {
    return "대문자를 포함해야 해요.";
  }

  if (!/\d/.test(trimmed)) {
    return "숫자를 포함해야 해요.";
  }

  return null; // 유효함
};
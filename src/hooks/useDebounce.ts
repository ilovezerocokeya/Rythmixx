import { useState, useEffect } from "react";

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // delay 이후에 value를 반영
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // delay 내 재입력 발생 시 타이머 초기화
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
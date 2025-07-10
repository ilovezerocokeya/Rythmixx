/**
 * 유튜브 링크나 ID에서 videoId를 추출하는 유틸 함수
 */
export const extractVideoId = (input: string): string => {
  const match = input.match(/(?:v=)([\w-]{11})/);
  return match ? match[1] : input; // 이미 id만 입력된 경우 그대로 반환
};
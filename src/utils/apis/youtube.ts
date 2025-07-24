const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

export const fetchVideoInfo = async (videoId: string) => {

  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${YOUTUBE_API_KEY}`;
  const res = await fetch(url); // fetch로 API 요청

  // 요청 실패 시 에러 처리
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`동영상 정보 불러오기 실패: ${res.status} ${errorText}`);
  }

  // JSON 형태로 응답 데이터 파싱
  const data = await res.json();

  // items 배열이 없거나 비어 있으면 에러 처리
  if (!data.items || data.items.length === 0) {
    throw new Error("해당 동영상을 찾을 수 없습니다.");
  }

  // 첫 번째 동영상 정보 반환
  return data.items[0];
};
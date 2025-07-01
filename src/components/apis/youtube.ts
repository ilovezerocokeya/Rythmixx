const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

export const fetchVideoInfo = async (videoId: string) => {
  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${YOUTUBE_API_KEY}`;

  const res = await fetch(url);
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`동영상 정보 불러오기 실패: ${res.status} ${errorText}`);
  }

  const data = await res.json();

  if (!data.items || data.items.length === 0) {
    throw new Error("해당 동영상을 찾을 수 없습니다.");
  }

  return data.items[0]; 
};
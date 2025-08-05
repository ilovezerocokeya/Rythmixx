
import { CategoryType } from "@/constants/curation";
import { supabase } from "@/supabase/createClient";

// 큐레이션에 사용할 비디오 타입 정의 (user_id 제외)
type CurationVideo = {
  id: string;
  title: string;
  thumbnail_url: string;
  youtube_url: string;
  category: CategoryType;
}

// 큐레이션 영상 추가
export const insertCurationVideo = async (
  category: CategoryType,
  video: CurationVideo
) => {
  // 동일 카테고리에 이미 존재하는 영상인지 확인
  const { data: existing, error: selectError } = await supabase
    .from("curation")
    .select("video_id")
    .eq("video_id", video.id)
    .eq("category", category)
    .maybeSingle();

  if (selectError) throw selectError;
  if (existing) return; // 중복 영상일 경우 삽입하지 않음

  // 해당 카테고리의 가장 높은 order_index 조회
  const { data: maxOrderData, error: maxError } = await supabase
    .from("curation")
    .select("order_index")
    .eq("category", category)
    .order("order_index", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (maxError) throw maxError;

  // 새 영상의 order_index 계산
  const nextOrderIndex = maxOrderData?.order_index !== undefined
    ? maxOrderData.order_index + 1
    : 0;

  // 새로운 큐레이션 영상 삽입
  const { error: insertError } = await supabase.from("curation").insert({
    category,
    video_id: video.id,
    title: video.title,
    thumbnail_url: video.thumbnail_url,
    youtube_url: video.youtube_url,
    order_index: nextOrderIndex,
  });

  if (insertError) throw insertError;
};

// 큐레이션 영상 삭제
export const deleteCurationVideo = async (
  category: CategoryType,
  videoId: string
): Promise<void> => {
  const { error } = await supabase
    .from("curation")
    .delete()
    .eq("category", category)
    .eq("video_id", videoId);

  if (error) {
    console.error("[deleteCurationVideo]", error.message);
    throw new Error("큐레이션 삭제 실패");
  }
};

// 카테고리별 큐레이션 영상 조회
export const fetchCurationVideosByCategory = async (category: CategoryType) => {
  const { data, error } = await supabase
    .from("curation")
    .select("video_id, title, thumbnail_url, youtube_url, order_index, category")
    .eq("category", category)
    .order("order_index", { ascending: true });

  if (error) {
    console.error("[fetchCurationVideosByCategory]", error.message);
    return [];
  }

  // Zustand 상태에서 사용할 수 있도록 imageUrl 포함 반환
  return data.map((item) => ({
    id: item.video_id,
    title: item.title,
    thumbnail_url: item.thumbnail_url,
    youtube_url: item.youtube_url,
    imageUrl: item.thumbnail_url,
    category: item.category as CategoryType,
  }));
};
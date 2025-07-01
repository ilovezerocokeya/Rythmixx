import { CategoryType } from "@/stores/curationStore";
import { supabase } from "@/supabase/createClient";

// 🔹 CurationVideo 타입에서 user_id 제거
interface CurationVideo {
  id: string;
  title: string;
  thumbnail_url: string;
  youtube_url: string;
}

// 🔹 큐레이션 삽입
export const insertCurationVideo = async (
  category: CategoryType,
  video: CurationVideo
) => {
  // 이미 존재하는지 확인
  const { data: existing, error: selectError } = await supabase
    .from("curation")
    .select("video_id")
    .eq("video_id", video.id)
    .eq("category", category)
    .maybeSingle();

  if (selectError) throw selectError;
  if (existing) return; // 이미 존재 → insert 생략

  // 🔸 현재 category에서 가장 높은 order_index 가져오기
  const { data: maxOrderData, error: maxError } = await supabase
    .from("curation")
    .select("order_index")
    .eq("category", category)
    .order("order_index", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (maxError) throw maxError;

  const nextOrderIndex = maxOrderData?.order_index !== undefined
    ? maxOrderData.order_index + 1
    : 0;

  // 🔸 새 큐레이션 삽입
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


// 🔹 큐레이션 삭제
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
    throw new Error("❌ 큐레이션 삭제에 실패했습니다.");
  }
};

export const fetchCurationVideosByCategory = async (category: CategoryType) => {
  const { data, error } = await supabase
    .from("curation")
    .select("video_id, title, thumbnail_url, youtube_url, order_index")
    .eq("category", category)
    .order("order_index", { ascending: true });

  if (error) {
    console.error("❌ fetch 실패:", error.message);
    return [];
  }

  return data.map((item) => ({
    id: item.video_id,
    title: item.title,
    thumbnail_url: item.thumbnail_url,
    youtube_url: item.youtube_url,
    imageUrl: item.thumbnail_url, // Zustand에서는 imageUrl로 써야 하니까
  }));
};
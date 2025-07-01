'use client';

import { useState, useEffect, useMemo } from 'react';
import { fetchVideoInfo } from '@/components/apis/youtube';
import {
  useCurationStore,
  CategoryType,
  CurationVideo,
} from '@/stores/curationStore';
import {
  insertCurationVideo,
  deleteCurationVideo,
  fetchCurationVideosByCategory,
} from '@/components/apis/supabaseCuration';
import { extractVideoId } from '@/utils/youtube';
import { Link } from 'react-router-dom';
import PlaylistSlider from '@/components/playlist/PlaylistSlider';

const CATEGORY_LABELS: Record<CategoryType, string> = {
  mood: '기분별',
  weather: '날씨별',
  genre: '장르별',
  situation: '상황별',
  place: '장소별',
};

const EditCurationPage = () => {
  const [videoId, setVideoId] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('mood');

  const {
    curationVideosByCategory,
    addCurationVideo,
    removeCurationVideo,
    setCurationVideos,
  } = useCurationStore();

  // 🔹 카테고리 변경 시 DB에서 불러와 Zustand에 세팅
  useEffect(() => {
    const loadVideos = async () => {
      const fetched = await fetchCurationVideosByCategory(selectedCategory);
      setCurationVideos(selectedCategory, fetched);
    };
    loadVideos();
  }, [selectedCategory]);

  // 🔹 영상 추가
  const handleAdd = async () => {
    if (!videoId.trim()) return;

    const videoIdOnly = extractVideoId(videoId.trim());

    try {
      const data = await fetchVideoInfo(videoIdOnly);
      if (!data) return alert('잘못된 ID입니다.');

      const title = data.snippet.title;
      const thumbnail = data.snippet.thumbnails?.medium?.url || '';

      const newItem: CurationVideo = {
        id: videoIdOnly,
        title,
        imageUrl: thumbnail,
        thumbnail_url: thumbnail,
        youtube_url: `https://www.youtube.com/watch?v=${videoIdOnly}`,
      };

      addCurationVideo(selectedCategory, newItem);
      setVideoId('');
    } catch (err) {
      console.error(err);
      alert('불러오기 실패');
    }
  };

  // 🔹 영상 삭제
  const handleDelete = async (videoId: string) => {
    try {
      removeCurationVideo(selectedCategory, videoId);
      await deleteCurationVideo(selectedCategory, videoId);
    } catch (err) {
      console.error(err);
      alert('삭제 실패');
    }
  };

  // 🔹 저장하기
  const handleSave = async () => {
    const videos = curationVideosByCategory[selectedCategory];

    if (!videos || videos.length === 0) {
      alert('저장할 영상이 없습니다.');
      return;
    }

    try {
      for (const video of videos) {
        await insertCurationVideo(selectedCategory, video);
      }
      alert('✅ 저장이 완료되었습니다.');
    } catch (err) {
      console.error(err);
      alert('❌ 저장 실패');
    }
  };

  // 🔹 슬라이더에 넘길 props로 변환
  const sliderData = useMemo(
    () =>
      curationVideosByCategory[selectedCategory]?.map((item) => ({
        id: item.id,
        title: item.title,
        imageUrl: item.imageUrl,
        onClick: () => window.open(item.youtube_url, '_blank'),
        onDelete: () => handleDelete(item.id),
      })) ?? [],
    [curationVideosByCategory, selectedCategory]
  );

  return (
    <main className="flex items-center justify-center w-full min-h-screen bg-gray-900 px-4">
      <div className="relative w-full max-w-[360px] min-h-[640px] bg-white rounded-3xl shadow-lg border border-gray-200 flex flex-col">
        {/* 🔹 헤더 */}
        <div className="flex items-center justify-between px-6 pt-6">
          <Link to="/" className="text-base font-bold text-blue-600 hover:underline">
            Rythmixx
          </Link>
          <h1 className="text-base font-semibold text-gray-800 text-center w-full -ml-14">
            🎵큐레이션 관리자 페이지
          </h1>
        </div>

        {/* 🔸 콘텐츠 */}
        <div className="flex flex-col flex-1 px-6 pt-3 space-y-4">
          {/* 🔸 입력 영역 */}
          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-medium text-gray-700">카테고리 선택</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as CategoryType)}
                className="w-full p-2 border rounded-md"
              >
                {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <input
              type="text"
              placeholder="유튜브 영상 URL 또는 ID"
              value={videoId}
              onChange={(e) => setVideoId(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
            <button
              onClick={handleAdd}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 active:scale-95 transition-transform duration-150"
            >
              추가하기
            </button>
          </div>

          {/* 🔸 PlaylistSlider 적용 */}
          <div className="mt-10">
            <PlaylistSlider
              title={`🎬 ${CATEGORY_LABELS[selectedCategory]} 추천 미리보기`}
              playlists={sliderData}
            />
          </div>

          {/* 저장 버튼 */}
          <button
            onClick={handleSave}
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 active:scale-95 transition-transform duration-150"
          >
            저장하기
          </button>
        </div>
      </div>
    </main>
  );
};

export default EditCurationPage;
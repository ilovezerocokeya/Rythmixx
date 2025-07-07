'use client';

import { useState, useEffect, useMemo } from 'react';
import { fetchVideoInfo } from '@/components/apis/youtube';
import {
  useCurationStore,
  CurationVideo,
  CategoryType,
} from '@/stores/useCurationStore';
import {
  deleteCurationVideo,
  fetchCurationVideosByCategory,
} from '@/components/apis/supabaseCuration';
import { extractVideoId } from '@/utils/youtube';
import { supabase } from '@/supabase/createClient';
import { useNavigate } from 'react-router-dom';
import PlaylistSlider from '@/components/slider/PlaylistSlider';
import MainCurationPlaylistSlider from '@/components/slider/MainCurationPlaylistSlider';
import {
  CATEGORY_LABELS,
  CATEGORY_ORDER,
} from '@/constants/curation'; 

type ExtendedCategoryType = CategoryType | 'all';

const EditCurationPage = () => {
  const [videoId, setVideoId] = useState('');
  const [selectedCategory, setSelectedCategory] =
    useState<ExtendedCategoryType>('all');
  const navigate = useNavigate();
  const [hasLoadedAll, setHasLoadedAll] = useState(false);


  const {
    curationVideosByCategory,
    addCurationVideo,
    removeCurationVideo,
    setCurationVideos,
  } = useCurationStore();

  useEffect(() => {
    const checkAdmin = async () => {
      const { data, error } = await supabase.auth.getUser();
      const email = data?.user?.email;

      if (error || email !== 'ilovezerocokeya@gmail.com') {
        alert('접근 권한이 없습니다.');
        navigate('/');
      }
    };

    checkAdmin();
  }, []);

  useEffect(() => {
    const loadVideos = async () => {
      if (selectedCategory === 'all') {
        if (hasLoadedAll) return;

        try {
          const results = await Promise.all(
            CATEGORY_ORDER.map((key) => fetchCurationVideosByCategory(key))
          );
          results.forEach((fetched, index) => {
            const key = CATEGORY_ORDER[index];
            setCurationVideos(key, fetched);
          });
          setHasLoadedAll(true);
        } catch (error) {
          console.error('전체 카테고리 데이터 로딩 실패:', error);
        }
      } else {
        const targetList = curationVideosByCategory[selectedCategory];
        if (targetList && targetList.length > 0) return;

        try {
          const fetched = await fetchCurationVideosByCategory(selectedCategory);
          setCurationVideos(selectedCategory, fetched);
        } catch (error) {
          console.error(`"${selectedCategory}" 카테고리 로딩 실패:`, error);
        }
      }
    };

    loadVideos();
  }, [selectedCategory]);

  const handleAdd = async () => {
    const trimmed = videoId.trim();
    if (!trimmed || selectedCategory === 'all') return;

    const videoIdOnly = extractVideoId(trimmed);
    if (!videoIdOnly) {
      alert('유효한 유튜브 링크 또는 ID를 입력해주세요.');
      return;
    }

    const isAlreadyAdded = curationVideosByCategory[selectedCategory]?.some(
      (v) => v.id === videoIdOnly
    );
    if (isAlreadyAdded) {
      alert('이미 추가된 영상입니다.');
      return;
    }

    try {
      const data = await fetchVideoInfo(videoIdOnly);
      if (!data) return alert('잘못된 영상입니다.');

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
      alert('영상 불러오기 실패');
    }
  };

  const handleDelete = async (videoId: string) => {
    if (selectedCategory === 'all') return;

    try {
      removeCurationVideo(selectedCategory, videoId);
      await deleteCurationVideo(selectedCategory, videoId);
    } catch (err) {
      console.error(err);
      alert('삭제 실패');
    }
  };

  const handleSave = async () => {
    if (selectedCategory === 'all') return;

    const videos = curationVideosByCategory[selectedCategory];
    if (videos.length === 0) {
      alert('저장할 영상이 없습니다.');
      return;
    }

    try {
      const payload = videos.map((video) => ({
        video_id: video.id,
        title: video.title,
        thumbnail_url: video.thumbnail_url,
        youtube_url: video.youtube_url,
        category: selectedCategory,
      }));

      const { error } = await supabase
        .from('curation')
        .upsert(payload, {
          onConflict: 'video_id,category',
        });

      if (error) throw error;

      alert('저장되었습니다.');
    } catch (err) {
      console.error(err);
      alert('저장 실패');
    }
  };

  const sliders = useMemo(() => {
    if (selectedCategory === 'all') {
      return CATEGORY_ORDER.filter(
        (key) => curationVideosByCategory[key]?.length > 0
      ).map((category) => ({
        category,
        title: `${CATEGORY_LABELS[category]} 추천 미리보기`,
        playlists: curationVideosByCategory[category].map((item) => ({
          id: item.id,
          title: item.title,
          imageUrl: item.imageUrl,
          onClick: () => window.open(item.youtube_url, '_blank'),
          onDelete: undefined,
        })),
      }));
    }

    return [
      {
        category: selectedCategory,
        title: `${CATEGORY_LABELS[selectedCategory]} 추천 미리보기`,
        playlists:
          curationVideosByCategory[selectedCategory]?.map((item) => ({
            id: item.id,
            title: item.title,
            imageUrl: item.imageUrl,
            onClick: () => window.open(item.youtube_url, '_blank'),
            onDelete: () => handleDelete(item.id),
          })) ?? [],
      },
    ];
  }, [curationVideosByCategory, selectedCategory]);

  return (
  <main className="flex items-center justify-center w-full min-h-screen bg-gray-900 px-4">
    <div className="relative w-full max-w-[400px] h-[640px] bg-white rounded-3xl shadow-lg border border-gray-200 flex flex-col overflow-hidden">
      <div className="relative flex items-center justify-between px-6 pt-6 shrink-0">
        <button
          onClick={() => navigate('/')}
          className="text-base font-bold text-blue-600 hover:text-blue-700"
        >
          Rythmixx
        </button>
        <h1 className="absolute left-1/2 -translate-x-1/2 text-base font-semibold text-gray-800 text-center pointer-events-none">
          큐레이션 관리자
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pt-4 pb-6 space-y-4 scroll-container">
        <div className="space-y-3">
          <label className="block font-medium text-gray-700">
            카테고리 선택
          </label>
          <select
            value={selectedCategory}
            onChange={(e) =>
              setSelectedCategory(e.target.value as ExtendedCategoryType)
            }
            className="w-full p-2 border rounded-md"
          >
            {(['all', ...CATEGORY_ORDER] as ExtendedCategoryType[]).map(
              (key) => (
                <option key={key} value={key}>
                  {CATEGORY_LABELS[key]}
                </option>
              )
            )}
          </select>
        </div>

        {selectedCategory !== 'all' && (
          <>
            <input
              type="text"
              placeholder="유튜브 영상 URL 또는 ID 입력"
              value={videoId}
              onChange={(e) => setVideoId(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
            <button
              onClick={handleAdd}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 active:scale-95 transition-transform duration-150"
            >
              영상 추가
            </button>
          </>
        )}

        {/* 슬라이더 분기 처리 */}
        {selectedCategory === 'all' ? (
          <>
            {curationVideosByCategory['thisWeek']?.length > 0 && (
              <MainCurationPlaylistSlider
                playlists={curationVideosByCategory['thisWeek'].map((item) => ({
                  id: item.id,
                  title: item.title,
                  imageUrl: item.imageUrl,
                  onDelete: () => handleDelete(item.id),
                  onClick: () => window.open(item.youtube_url, '_blank'),
                }))}
              />
            )}
            {sliders
              .filter((slider) => slider.category !== 'thisWeek')
              .map((slider) => (
                <PlaylistSlider
                  key={slider.category}
                  title={slider.title}
                  playlists={slider.playlists}
                />
              ))}
          </>
        ) : selectedCategory === 'thisWeek' ? (
          <MainCurationPlaylistSlider
            playlists={
              curationVideosByCategory['thisWeek']?.map((item) => ({
                id: item.id,
                title: item.title,
                imageUrl: item.imageUrl,
                onDelete: () => handleDelete(item.id),
                onClick: () => window.open(item.youtube_url, '_blank'),
              })) ?? []
            }
          />
        ) : (
          sliders.map((slider) => (
            <PlaylistSlider
              key={slider.category}
              title={slider.title}
              playlists={slider.playlists}
            />
          ))
        )}

        {selectedCategory !== 'all' && (
          <button
            onClick={handleSave}
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 active:scale-95 transition-transform duration-150 mt-6"
          >
            저장하기
          </button>
        )}
      </div>
    </div>
  </main>
);
};

export default EditCurationPage;
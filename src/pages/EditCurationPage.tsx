'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/supabase/createClient';
import { fetchVideoInfo } from '@/utils/apis/youtube';
import { extractVideoId } from '@/utils/youtube';
import { useCurationStore, CurationVideo } from '@/stores/useCurationStore';
import { deleteCurationVideo, fetchCurationVideosByCategory } from '@/utils/apis/supabaseCuration';
import { CATEGORY_ORDER, CategoryType } from '@/constants/curation';
import EditCurationHeader from '@/components/Edit/EditCurationHeader';
import ControlPanel from '@/components/Edit/EditCurationControlPanel';
import EditCurationSlider from '@/components/Edit/EditCurationSlider';

export type ExtendedCategoryType = CategoryType | 'all';

type YoutubeAPIResponse = {
  snippet: {
    title: string;
    thumbnails?: {
      medium?: { url: string };
    };
  };
};

const EditCurationPage = () => {
  const [videoId, setVideoId] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ExtendedCategoryType>('all');
  const [hasLoadedAll, setHasLoadedAll] = useState(false);
  const navigate = useNavigate();

  const {
    curationVideosByCategory,
    addCurationVideo,
    removeCurationVideo,
    setCurationVideos,
  } = useCurationStore();

  useEffect(() => {
    const verifyUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || data?.user?.email !== 'ilovezerocokeya@gmail.com') {
        alert('접근 권한이 없습니다.');
        navigate('/');
      }
    };
    verifyUser();
  }, [navigate]);

  useEffect(() => {
    if (selectedCategory !== 'all' || hasLoadedAll) return;

    const loadAll = async () => {
      try {
        const results = await Promise.all(
          CATEGORY_ORDER.map((key) => fetchCurationVideosByCategory(key))
        );
        results.forEach((videos, i) => {
          setCurationVideos(CATEGORY_ORDER[i], videos);
        });
        setHasLoadedAll(true);
      } catch (e) {
        console.error('전체 카테고리 로딩 실패:', e);
      }
    };

    loadAll();
  }, [selectedCategory, hasLoadedAll, setCurationVideos]);

  useEffect(() => {
    if (selectedCategory === 'all') return;

    // 해당 카테고리가 store에 존재하지 않으면 빈 배열로 세팅 
    if (!(selectedCategory in curationVideosByCategory)) {
      setCurationVideos(selectedCategory, []);
      return;
    }

    if (curationVideosByCategory[selectedCategory]?.length) return;

    const loadCategory = async () => {
      try {
        const fetched = await fetchCurationVideosByCategory(selectedCategory);
        setCurationVideos(selectedCategory, fetched);
      } catch (err) {
        console.error(`${selectedCategory} 카테고리 로딩 실패:`, err);
      }
    };

    loadCategory();
  }, [selectedCategory, curationVideosByCategory, setCurationVideos]);

  const currentCategoryVideos = useMemo(
    () => (selectedCategory !== 'all' ? curationVideosByCategory[selectedCategory] ?? [] : []),
    [curationVideosByCategory, selectedCategory]
  );

  const handleAdd = useCallback(async () => {
    const trimmed = videoId.trim();
    if (!trimmed || selectedCategory === 'all') return;

    const videoIdOnly = extractVideoId(trimmed);
    if (!videoIdOnly) {
      alert('유효한 유튜브 링크 또는 ID를 입력해주세요.');
      return;
    }

    const alreadyExists = currentCategoryVideos.some((v) => v.id === videoIdOnly);
    if (alreadyExists) {
      alert('이미 추가된 영상입니다.');
      return;
    }

    try {
      const data = await fetchVideoInfo(videoIdOnly) as YoutubeAPIResponse | null;
      if (!data) throw new Error();

      const { title } = data.snippet;
      const thumbnail = data.snippet.thumbnails?.medium?.url ?? '';

      const newItem: CurationVideo = {
        id: videoIdOnly,
        title,
        imageUrl: thumbnail,
        thumbnail_url: thumbnail,
        youtube_url: `https://www.youtube.com/watch?v=${videoIdOnly}`,
        category: selectedCategory,
      };

      addCurationVideo(selectedCategory, newItem);
      setVideoId('');
    } catch {
      alert('영상 정보를 불러오는 데 실패했습니다.');
    }
  }, [videoId, selectedCategory, currentCategoryVideos, addCurationVideo]);

  const handleDelete = useCallback(
    async (videoId: string) => {
      // 로컬 상태 제거 + Supabase 삭제
      if (selectedCategory === 'all') return;
      removeCurationVideo(selectedCategory, videoId);
      await deleteCurationVideo(selectedCategory, videoId);
    },
    [selectedCategory, removeCurationVideo]
  );

  const handleSave = useCallback(async () => {
    if (selectedCategory === 'all') return;
    if (!currentCategoryVideos.length) {
      alert('저장할 영상이 없습니다.');
      return;
    }

    const payload = currentCategoryVideos.map(({ id, title, thumbnail_url, youtube_url }) => ({
      video_id: id,
      title,
      thumbnail_url,
      youtube_url,
      category: selectedCategory,
    }));

    const { error } = await supabase.from('curation').upsert(payload, {
      onConflict: 'video_id,category',
    });

    if (error) {
      alert('저장 실패');
    } else {
      alert('저장되었습니다.');
    }
  }, [selectedCategory, currentCategoryVideos]);

  return (
    <main className="flex items-center justify-center w-full min-h-screen bg-gray-900 px-4">
      <div className="relative w-full max-w-[360px] h-[640px] bg-white rounded-3xl shadow-lg border border-gray-200 flex flex-col overflow-hidden">
        <EditCurationHeader />
        <div className="flex-1 overflow-y-auto px-6 pt-4 pb-6 space-y-4 scroll-container">
          <ControlPanel
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            videoId={videoId}
            setVideoId={setVideoId}
            handleAdd={handleAdd}
          />
          <EditCurationSlider
            selectedCategory={selectedCategory}
            curationVideosByCategory={curationVideosByCategory}
            handleDelete={handleDelete}
          />
          {selectedCategory !== 'all' && (
            <button
              onClick={handleSave}
              className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 active:scale-95 transition-transform duration-150"
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
'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { fetchVideoInfo } from '@/utils/apis/youtube';
import { useCurationStore, CurationVideo } from '@/stores/useCurationStore';
import { deleteCurationVideo, fetchCurationVideosByCategory } from '@/utils/apis/supabaseCuration';
import { extractVideoId } from '@/utils/youtube';
import { supabase } from '@/supabase/createClient';
import { useNavigate } from 'react-router-dom';
import { CATEGORY_LABELS, CATEGORY_ORDER, CategoryType } from '@/constants/curation';
import EditCurationSlider from '@/components/Edit/EditCurationSlider';
import EditCurationControlPanel from '@/components/Edit/EditCurationControlPanel';
import EditCurationHeader from '@/components/Edit/EditCurationHeader';

type ExtendedCategoryType = CategoryType | 'all';

const EditCurationPage = () => {
  const [videoId, setVideoId] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ExtendedCategoryType>('all');
  const navigate = useNavigate();
  const [hasLoadedAll, setHasLoadedAll] = useState(false);

  const {
    curationVideosByCategory,
    addCurationVideo,
    removeCurationVideo,
    setCurationVideos,
  } = useCurationStore();

  // 관리자 체크
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

  // 카테고리별 데이터 로딩
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

  // 뒤로가기
  const handleBack = useCallback(() => {
    navigate('/');
  }, [navigate]);

  // 유튜브 열기
  const openYoutube = useCallback((url: string) => {
    window.open(url, '_blank');
  }, []);

  // 영상 추가 핸들러
  const handleAdd = useCallback(async () => {
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
        category: selectedCategory,
      };

      addCurationVideo(selectedCategory, newItem);
      setVideoId('');
    } catch (err) {
      console.error(err);
      alert('영상 불러오기 실패');
    }
  }, [videoId, selectedCategory, curationVideosByCategory, addCurationVideo]);

  // 삭제 핸들러
  const handleDelete = useCallback(
    async (videoId: string) => {
      if (selectedCategory === 'all') return;

      try {
        removeCurationVideo(selectedCategory, videoId);
        await deleteCurationVideo(selectedCategory, videoId);
      } catch (err) {
        console.error(err);
        alert('삭제 실패');
      }
    },
    [removeCurationVideo, selectedCategory]
  );

  // 저장 핸들러
  const handleSave = useCallback(async () => {
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
        .upsert(payload, { onConflict: 'video_id,category' });

      if (error) throw error;

      alert('저장되었습니다.');
    } catch (err) {
      console.error(err);
      alert('저장 실패');
    }
  }, [curationVideosByCategory, selectedCategory]);

  // all 화면에서 아이템별 onClick 핸들러 맵
  const clickHandlerMapAll = useMemo(() => {
    const map = new Map<string, () => void>();
    for (const key of CATEGORY_ORDER) {
      const list = curationVideosByCategory[key] ?? [];
      for (const item of list) map.set(item.id, () => openYoutube(item.youtube_url));
    }
    return map;
  }, [curationVideosByCategory, openYoutube]);

  // 현재 선택된 카테고리 아이템
  const currentItems = useMemo(
    () => (selectedCategory === 'all' ? [] : curationVideosByCategory[selectedCategory] ?? []),
    [selectedCategory, curationVideosByCategory]
  );

  // 현재 카테고리용 onClick / onDelete 핸들러 맵
  const clickHandlerMapCurrent = useMemo(() => {
    const map = new Map<string, () => void>();
    for (const item of currentItems) map.set(item.id, () => openYoutube(item.youtube_url));
    return map;
  }, [currentItems, openYoutube]);

  const deleteHandlerMapCurrent = useMemo(() => {
    const map = new Map<string, () => void>();
    for (const item of currentItems) map.set(item.id, () => handleDelete(item.id));
    return map;
  }, [currentItems, handleDelete]);

  // sliders
  const sliders = useMemo(() => {
    if (selectedCategory === 'all') {
      return CATEGORY_ORDER
        .filter((key) => curationVideosByCategory[key]?.length > 0)
        .map((category) => ({
          category,
          title: `${CATEGORY_LABELS[category]} 추천 미리보기`,
          playlists: (curationVideosByCategory[category] ?? []).map((item) => ({
            id: item.id,
            title: item.title,
            imageUrl: item.imageUrl,
            onClick: clickHandlerMapAll.get(item.id),
            onDelete: undefined,
          })),
        }));
    }

    return [
      {
        category: selectedCategory,
        title: `${CATEGORY_LABELS[selectedCategory]} 추천 미리보기`,
        playlists: (curationVideosByCategory[selectedCategory] ?? []).map((item) => ({
          id: item.id,
          title: item.title,
          imageUrl: item.imageUrl,
          onClick: clickHandlerMapCurrent.get(item.id),
          onDelete: deleteHandlerMapCurrent.get(item.id),
        })),
      },
    ];
  }, [
    selectedCategory,
    curationVideosByCategory,
    clickHandlerMapAll,
    clickHandlerMapCurrent,
    deleteHandlerMapCurrent,
  ]);

  return (
    <main className="flex items-center justify-center w-full min-h-screen bg-gray-900 px-4">
      <div className="relative w-full max-w-[360px] h-[640px] bg-white rounded-3xl shadow-lg border border-gray-200 flex flex-col overflow-hidden">
        <EditCurationHeader onBack={handleBack} />

        <div className="flex-1 overflow-y-auto px-6 pt-4 pb-6 space-y-4 scroll-container">
  
          <EditCurationControlPanel
            selectedCategory={selectedCategory}
            onChangeCategory={setSelectedCategory}
            videoId={videoId}
            onChangeVideoId={setVideoId}
            onAdd={handleAdd}
          />
          <EditCurationSlider
            selectedCategory={selectedCategory}
            sliders={sliders}
            curationVideosByCategory={
              curationVideosByCategory as Record<
                CategoryType,
                { id: string; title: string; imageUrl: string; youtube_url: string }[]
              >
            }
            onDelete={handleDelete}
            onSave={handleSave}
          />
        </div>
      </div>
    </main>
  );
};

export default EditCurationPage;
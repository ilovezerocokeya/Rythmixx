'use client';

import { useState, useEffect, useMemo } from 'react';
import { fetchVideoInfo } from '@/components/apis/youtube';
import { useCurationStore, CategoryType, CurationVideo } from '@/stores/curationStore';
import { deleteCurationVideo, fetchCurationVideosByCategory } from '@/components/apis/supabaseCuration';
import { extractVideoId } from '@/utils/youtube';
import { supabase } from '@/supabase/createClient';
import { useNavigate } from 'react-router-dom';
import PlaylistSlider from '@/components/slider/PlaylistSlider';

type ExtendedCategoryType = CategoryType | 'all';

const CATEGORY_LABELS: Record<ExtendedCategoryType, string> = {
  all: '전체',
  mood: '기분별',
  weather: '날씨별',
  genre: '장르별',
  situation: '상황별',
  place: '장소별',
};

const EditCurationPage = () => {
  const [videoId, setVideoId] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ExtendedCategoryType>('mood');
  const navigate = useNavigate();

  const {
    curationVideosByCategory,
    addCurationVideo,
    removeCurationVideo,
    setCurationVideos,
  } = useCurationStore();

  // 컴포넌트 마운트 시 관리자 계정만 접근 허용, 아니면 홈으로 리디렉션
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

  // 선택된 카테고리에 따라 해당 카테고리의 영상 목록을 Supabase에서 불러오기
  useEffect(() => {
    const loadVideos = async () => {
      if (selectedCategory === 'all') {
        const allKeys: CategoryType[] = ['mood', 'weather', 'genre', 'situation', 'place'];

        // 이미 모든 카테고리의 영상이 로딩되었으면 중단
        const alreadyLoaded = allKeys.every((key) => curationVideosByCategory[key]?.length > 0);
        if (alreadyLoaded) return;

        try {
          const results = await Promise.all(
            allKeys.map((key) => fetchCurationVideosByCategory(key))
          );
          results.forEach((fetched, index) => {
            const key = allKeys[index];
            setCurationVideos(key, fetched);
          });
        } catch (error) {
          console.error('전체 카테고리 데이터 로딩 실패:', error);
        }
      } else {
        // 단일 카테고리: 이미 로드된 경우 생략
        if (curationVideosByCategory[selectedCategory]?.length > 0) return;

        try {
          const fetched = await fetchCurationVideosByCategory(selectedCategory);
          setCurationVideos(selectedCategory, fetched);
        } catch (error) {
          console.error(`"${selectedCategory}" 카테고리 로딩 실패:`, error);
        }
      }
    };

    loadVideos();
  }, [selectedCategory, curationVideosByCategory]);

  // 유튜브 영상 추가 처리
  const handleAdd = async () => {
    const trimmed = videoId.trim();
    if (!trimmed || selectedCategory === 'all') return;

    const videoIdOnly = extractVideoId(trimmed);
    if (!videoIdOnly) {
      alert('유효한 유튜브 링크 또는 ID를 입력해주세요.');
      return;
    }

    // 중복 체크
    const isAlreadyAdded = curationVideosByCategory[selectedCategory]?.some(v => v.id === videoIdOnly);
    if (isAlreadyAdded) {
      alert('이미 추가된 영상입니다.');
      return;
    }

    try {
      // 유튜브 API로 영상 정보 조회
      const data = await fetchVideoInfo(videoIdOnly);
      if (!data) return alert('잘못된 영상입니다.');

      const title = data.snippet.title;
      const thumbnail = data.snippet.thumbnails?.medium?.url || '';

      // 전역 스토어에 추가
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

  // 영상 삭제 처리 (스토어와 Supabase 동시 반영)
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

  // 영상 저장 처리: 현재 카테고리의 영상들을 Supabase에 업서트
  const handleSave = async () => {
    if (selectedCategory === 'all') return;

    const videos = curationVideosByCategory[selectedCategory];
    if (videos.length === 0) {
      alert('저장할 영상이 없습니다.');
      return;
    }

    try {
      const { error } = await supabase
        .from('curation_videos')
        .upsert(
          videos.map((video) => ({
            ...video,
            category: selectedCategory,
          })),
          { onConflict: "video_id,category" }
        );

      if (error) throw error;

      alert('저장되었습니다.');
    } catch (err) {
      console.error(err);
      alert('저장 실패');
    }
  };

  // 카테고리별 슬라이더 구성 정보 생성
  const sliders = useMemo(() => {
    if (selectedCategory === 'all') {
      // 전체 카테고리: 비어있는 카테고리는 제외하고 슬라이더 생성
      return (Object.entries(curationVideosByCategory) as [CategoryType, CurationVideo[]][])
        .filter(([, videos]) => videos.length > 0)
        .map(([category, videos]) => ({
          category,
          title: `${CATEGORY_LABELS[category]} 추천 미리보기`,
          playlists: videos.map((item) => ({
            id: item.id,
            title: item.title,
            imageUrl: item.imageUrl,
            onClick: () => window.open(item.youtube_url, '_blank'),
            onDelete: undefined,
          })),
        }));
    }

    // 단일 카테고리: 삭제 버튼 포함
    return [
      {
        category: selectedCategory,
        title: `${CATEGORY_LABELS[selectedCategory]} 추천 미리보기`,
        playlists: curationVideosByCategory[selectedCategory]?.map((item) => ({
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

        {/* 상단 헤더 */}
        <div className="relative flex items-center justify-between px-6 pt-6 shrink-0">
          {/* 홈 이동 버튼 */}
          <button
            onClick={() => navigate('/')}
            className="text-base font-bold text-blue-600 hover:text-blue-700"
          >
            Rythmixx
          </button>

          {/* 중앙 타이틀 (이벤트 방해 방지) */}
          <h1 className="absolute left-1/2 -translate-x-1/2 text-base font-semibold text-gray-800 text-center pointer-events-none">
            큐레이션 관리자
          </h1>
        </div>

        {/* 본문 영역 */}
        <div className="flex-1 overflow-y-auto px-6 pt-4 pb-6 space-y-4 scroll-container">

          {/* 카테고리 선택 드롭다운 */}
          <div className="space-y-3">
            <label className="block font-medium text-gray-700">카테고리 선택</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as ExtendedCategoryType)}
              className="w-full p-2 border rounded-md"
            >
              {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* 영상 추가 입력 영역 (all 카테고리일 때는 숨김) */}
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

          {/* 슬라이더 리스트 (빈 플레이리스트는 제외) */}
          {sliders
            .filter((slider) => slider.playlists.length > 0)
            .map((slider) => (
              <PlaylistSlider
                key={slider.category}
                title={slider.title}
                playlists={slider.playlists}
              />
            ))}

          {/* 저장 버튼 (단일 카테고리에서만 노출) */}
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
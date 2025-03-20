import useGeolocation from "./hooks/useGeolocation";
import useWeather from "./hooks/useWeather";
import PlaylistSlider from "./components/playlist/playlistSlider";
import { usePlaylistStore } from "./stores/usePlaylistStore";
import WeatherPlaylistSlider from "./components/playlist/weatherPlaylistSlider";
import { useEffect, useState, useMemo } from "react";
import SearchBar from "./components/search/searchBar";
import SearchModal from "./components/search/searchModal";

// ✅ Playlist 타입 정의 (없다면 추가)
type Playlist = {
  id: string;
  title: string;
  imageUrl: string;
  onClick: () => void;
};

const Home = () => {
  useGeolocation();
  useWeather();
  
  const { preferredPlaylists, weatherPlaylists, genrePlaylists } = usePlaylistStore();
  const nickname = "ilovezerocokeya";

  const [searchTerm, setSearchTerm] = useState<string>(""); // ✅ 검색어 타입 명시
  const [filteredPlaylists, setFilteredPlaylists] = useState<Playlist[]>([]); // ✅ Playlist[] 타입 추가
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // ✅ boolean 타입 명시

  // ✅ Zustand 상태에서 모든 플레이리스트를 검색 대상으로 설정 (최적화)
  const allPlaylists = useMemo<Playlist[]>(() => [
    ...preferredPlaylists,
    ...weatherPlaylists,
    ...genrePlaylists
  ], [preferredPlaylists, weatherPlaylists, genrePlaylists]); // ✅ 상태 변경 시만 재계산

  // ✅ 검색어 입력 시 필터링 (최적화 + Debounce 적용)
  useEffect(() => {
    if (!searchTerm) {
      setFilteredPlaylists([]); // ✅ 즉시 빈 배열로 설정 (타입 오류 해결)
      return;
    }

    const timer = setTimeout(() => {
      setFilteredPlaylists(
        allPlaylists.filter((playlist) =>
          playlist.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }, 300); // ✅ 300ms 후 실행 (Debounce)

    return () => clearTimeout(timer); // ✅ cleanup 함수 추가
  }, [searchTerm, allPlaylists]);

  return (
    <div className="flex justify-center items-center w-screen h-screen">
      <div className="relative flex flex-col items-center w-[320px] h-[568px] bg-black text-xs bg-opacity-40 text-white overflow-hidden">
        {/* 날씨 추천 플레이리스트 */}
        <div className="relative w-full h-[150px]">
          <WeatherPlaylistSlider playlists={weatherPlaylists} nickname={nickname} />
        </div>

        {/* 추천 플레이리스트 */}
        <div className="relative flex flex-col pt-12 items-center w-full max-w-[340px] pb-14"> {/* ✅ 검색바 높이 고려해서 padding 추가 */}
          <PlaylistSlider title="😊 기분에 따라 골라보세요!" playlists={preferredPlaylists} />
          <PlaylistSlider title="🎸 장르별 추천 플레이리스트" playlists={genrePlaylists} />
        </div>

        {/* ✅ 검색창 (하단 고정) */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[320px]">
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} openModal={() => setIsModalOpen(true)} />
        </div>

        {/* 검색 결과 모달 */}
        <SearchModal isOpen={isModalOpen} closeModal={() => setIsModalOpen(false)} filteredPlaylists={filteredPlaylists} />
      </div>
    </div>
  );
};

export default Home;
import useGeolocation from "./hooks/useGeolocation";
import useWeather from "./hooks/useWeather";
import PlaylistSlider from "./components/playlist/playlistSlider";
import { usePlaylistStore } from "./stores/usePlaylistStore";
import WeatherPlaylistSlider from "./components/playlist/weatherPlaylistSlider";

const Home = () => {
  useGeolocation();
  useWeather();
  
  const { preferredPlaylists, weatherPlaylists, genrePlaylists } = usePlaylistStore();
  const nickname = "zerocokeya";

  return (
    <div className="relative flex flex-col items-center w-screen min-h-screen bg-black bg-opacity-40 text-white">
      {/* 날씨 추천 플레이리스트 (상단 고정) */}
      <div className="relative w-full h-[85vh]">
        <WeatherPlaylistSlider 
          playlists={weatherPlaylists} 
          nickname={nickname}
        />
      </div>

      {/* 추천 플레이리스트 */}
      <div className="relative flex flex-col pt-10 items-center w-full max-w-[1200px]">
        <PlaylistSlider 
          title="😊 기분에 따라 골라보세요!" 
          playlists={preferredPlaylists} 
        />

        <PlaylistSlider 
          title="🎸 장르별 추천 플레이리스트" 
          playlists={genrePlaylists} 
        />
      </div>
    </div>
  );
};

export default Home;
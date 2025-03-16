import useGeolocation from "./hooks/useGeolocation";
import useWeather from "./hooks/useWeather";
import { useWeatherStore } from "./stores/useWeatherStore";
import PlaylistSlider from "./components/playlist/playlistSlider";
import { usePlaylistStore } from "./stores/usePlaylistStore";
import WeatherPlaylistSlider from "./components/playlist/weatherPlaylistSlider";

const Home = () => {
  useGeolocation();
  useWeather();
  
  const { weather, timeOfDay } = useWeatherStore();
  const { preferredPlaylists, weatherPlaylists, genrePlaylists } = usePlaylistStore();
  const nickname = "zerocokeya";

  // 날씨와 시간대에 따른 글자색 반환
  const getTextColor = (weather: string | null, timeOfDay: string) => {
    if (timeOfDay === "night") return "#ffffff"; // 밤에는 흰색
    if (weather === "Rain" || weather === "Snow" || weather === "Clouds") return "#222"; // 비/눈/흐림은 어두운 색
    return "#000"; // 맑을 때 검정색
  };

  return (
    <div className="relative flex flex-col items-center w-screen min-h-screen bg-black bg-opacity-40 text-white">
      {/* 🔹 날씨 추천 플레이리스트 (상단 고정) */}
      <div className="relative w-full h-[85vh]">
        <WeatherPlaylistSlider 
          playlists={weatherPlaylists} 
          nickname={nickname} 
          weather={weather} 
          timeOfDay={timeOfDay} 
          getTextColor={getTextColor} 
        />
      </div>

      {/* 🔹 추천 플레이리스트 */}
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
      
      <div>
        
      </div>
    </div>
  );
};

export default Home;
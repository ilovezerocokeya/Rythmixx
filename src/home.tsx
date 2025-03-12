import useGeolocation from "./hooks/useGeolocation";
import LocationDisplay from "./components/location/locationDisplay";
import WeatherDisplay from "./components/weather/weatherDisplay";
import useWeather from "./hooks/useWeather";
import WeatherBackground from "./components/ui/weatherBackground";
import { useWeatherStore } from "./stores/useWeatherStore";
import PlaylistSlider from "./components/playlist/playlistSlider";
import { usePlaylistStore } from "./stores/usePlaylistStore";

const Home = () => {
  useGeolocation();
  useWeather();
  
  const { weather, timeOfDay } = useWeatherStore();
  const { preferredPlaylists, weatherPlaylists } = usePlaylistStore();
  const nickname = "zerocokeya";

  // 날씨와 시간대에 따른 글자색 반환
  const getTextColor = (weather: string | null, timeOfDay: string) => {
    if (timeOfDay === "night") return "#ffffff"; // 밤에는 흰색
    if (weather === "Rain" || weather === "Snow" || weather === "Clouds") return "#222"; // 비/눈/흐림은 어두운 색
    return "#000"; // 맑을 때 검정색
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100vw", minHeight: "100vh" }}>
      <WeatherBackground />
  
      {/* 중앙 정렬을 위한 래퍼 */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", width: "100%" }}>
        {/* 상단 정보 (닉네임, 날씨, 위치) */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
          <h1 style={{ color: getTextColor(weather, timeOfDay) }}>
            Hello! {nickname}
          </h1>
          <WeatherDisplay />
          <span style={{ color: getTextColor(weather, timeOfDay) }}>|</span>
          <LocationDisplay />
        </div>

        {/* 플레이리스트 섹션 */}
        <div className="flex flex-col items-center w-full max-w-[1600px]">
          {/* 선호 장르별 플레이리스트 */}
          <div className="mt-20"> 
            <PlaylistSlider 
              title={
                <span style={{ color: getTextColor(weather, timeOfDay) }}>
                  🎵 선호 장르별 추천
                </span>
              } 
              playlists={preferredPlaylists} 
            />
          </div>

          {/* 오늘 날씨 기반 플레이리스트 */}
          <div className="mt-20"> 
            <PlaylistSlider 
              title={
                <span style={{ color: getTextColor(weather, timeOfDay) }}>
                  오늘의 날씨 맞춤 선곡
                </span>
              } 
              playlists={weatherPlaylists} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
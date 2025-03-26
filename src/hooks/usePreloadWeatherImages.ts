import { useEffect } from "react";
import { mockWeatherPlaylists } from "@/mocks/mockPlaylists";

const usePreloadWeatherImages = () => {
  useEffect(() => {
    mockWeatherPlaylists.forEach((playlist) => {
      const img = new Image();
      img.src = playlist.imageUrl;
    });
  }, []);
};

export default usePreloadWeatherImages;
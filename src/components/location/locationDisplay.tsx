import { useLocationStore } from "@/stores/useLocationStore";


const LocationDisplay = () => {
  const { lat, lon, error } = useLocationStore();

  return (
    <div>
      <h1>현재 위치</h1>
      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <p>위도: {lat}, 경도: {lon}</p>
      )}
    </div>
  );
};

export default LocationDisplay;
import useReverseGeocoding from "@/hooks/useReverseGeocoding";


const LocationDisplay = () => {
  const city = useReverseGeocoding(); // 위도·경도를 기반으로 도시명 변환

  return (
    <div>
      <h1>현재 위치</h1>
      <p>{city ? ` ${city}` : "위치 정보를 가져오는 중..."}</p>
    </div>
  );
};

export default LocationDisplay;
import useReverseGeocoding from '../../hooks/useReverseGeocoding';

const LocationDisplay = () => {
  const city = useReverseGeocoding(); // 위치 정보 가져오기

  return (
    <div className="text-xs font-bold transition-colors scale-90 duration-500 ease-in-out">
      <p>{city ? city : "위치 정보를 가져오는 중..."}</p>
    </div>
  );
};

export default LocationDisplay;
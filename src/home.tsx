import useGeolocation from "./hooks/useGeolocation";
import LocationDisplay from "./components/location/locationDisplay";



const Home = () => {
  useGeolocation();

  return (
    <div className="home-container">
        <LocationDisplay />
    </div>
  );
};


export default Home;
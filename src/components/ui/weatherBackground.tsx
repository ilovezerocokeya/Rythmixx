import "../../styles/WeatherBackground.css";

type WeatherBackgroundProps = {
  weatherType: string;
};

const WeatherBackground: React.FC<WeatherBackgroundProps> = ({ weatherType }) => {

  let backgroundImage = "";

  switch (weatherType) {
    case "rainy":
      backgroundImage = "/images/rain.webp";
      break;
    case "snowy":
      backgroundImage = "/images/snow.webp";
      break;
    case "sunny":
      backgroundImage = "/images/sunny.webp";
      break;
    case "cloudy":
      backgroundImage = "/images/cloud.webp";
      break;
    case "thunder":
      backgroundImage = "/images/thunder.webp";
      break;
  }

  return (
    <div
      className="absolute inset-0 bg-cover bg-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        zIndex: "-10",
      }}
    />
  );
};

export default WeatherBackground;










  

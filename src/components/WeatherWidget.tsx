import { useState, useEffect } from "react";
import { FaRegSun } from "react-icons/fa6";
import { CiCloudSun } from "react-icons/ci";
import { IoCloudyNight } from "react-icons/io5";
import { MdModeNight } from "react-icons/md";
import { LuCloudy } from "react-icons/lu";
import { MdFoggy } from "react-icons/md";
import { WiNightFog } from "react-icons/wi";
import { FaCloudSunRain } from "react-icons/fa6";
import { FaCloudMoonRain } from "react-icons/fa";
import { IoRainy } from "react-icons/io5";
import { BsFillCloudLightningRainFill } from "react-icons/bs";
import { IoSnow } from "react-icons/io5";
import { PiFlowerTulipBold } from "react-icons/pi";
import { IoLeafOutline } from "react-icons/io5";
import { TbSunHigh } from "react-icons/tb";
import { FaWind } from "react-icons/fa";

interface WeatherData {
  temperature: number;
  weatherCode: number;
  isDay: boolean;
  location: string;
  loading: boolean;
  error: string | null;
  permissionDenied: boolean;
}

interface SeasonInfo {
  name: string;
  icon: React.ReactNode;
  description: string;
}

const getSeason = (): SeasonInfo => {
  const month = new Date().getMonth();

  if (month >= 2 && month <= 4) {
    return {
      name: "Spring",
      icon: <PiFlowerTulipBold className="text-pink-300" size={52} />,
      description: "Perfect for light layers!",
    };
  } else if (month >= 5 && month <= 7) {
    return {
      name: "Summer",
      icon: <TbSunHigh className="text-yellow-300" size={52} />,
      description: "Time for breezy outfits!",
    };
  } else if (month >= 8 && month <= 10) {
    return {
      name: "Autumn",
      icon: <IoLeafOutline className="text-orange-300" size={52} />,
      description: "Great for cozy sweaters!",
    };
  } else {
    return {
      name: "Winter",
      icon: <IoSnow className="text-blue-200" size={52} />,
      description: "Bundle up warmly!",
    };
  }
};

const weatherCodes: Record<number, string> = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  56: "Light freezing drizzle",
  57: "Dense freezing drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  66: "Light freezing rain",
  67: "Heavy freezing rain",
  71: "Slight snow fall",
  73: "Moderate snow fall",
  75: "Heavy snow fall",
  77: "Snow grains",
  80: "Slight rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  85: "Slight snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm with slight hail",
  99: "Thunderstorm with heavy hail",
};

const getWeatherIcon = (
  code: number,
  isDay: boolean,
  windSpeed?: number,
): React.ReactNode => {
  // Strong wind override
  if (windSpeed && windSpeed > 35) {
    return <FaWind size={64} className="text-white" />;
  }

  // Clear
  if (code === 0 || code === 1) {
    return isDay ? (
      <FaRegSun size={64} className="text-yellow-300" />
    ) : (
      <MdModeNight size={64} className="text-indigo-200" />
    );
  }

  // Partly cloudy
  if (code === 2) {
    return isDay ? (
      <CiCloudSun size={64} className="text-yellow-200" />
    ) : (
      <IoCloudyNight size={64} className="text-slate-200" />
    );
  }

  // Overcast
  if (code === 3) {
    return <LuCloudy size={64} className="text-gray-200" />;
  }

  // Fog
  if (code >= 45 && code <= 48) {
    return isDay ? (
      <MdFoggy size={64} className="text-gray-300" />
    ) : (
      <WiNightFog size={64} className="text-gray-300" />
    );
  }

  // Rain / drizzle
  if (code >= 51 && code <= 67) {
    return isDay ? (
      <FaCloudSunRain size={64} className="text-blue-200" />
    ) : (
      <FaCloudMoonRain size={64} className="text-blue-200" />
    );
  }

  // Snow
  if (code >= 71 && code <= 77) {
    return <IoSnow size={64} className="text-blue-100" />;
  }

  // Rain showers
  if (code >= 80 && code <= 82) {
    return <IoRainy size={64} className="text-blue-300" />;
  }

  // Snow showers
  if (code >= 85 && code <= 86) {
    return <IoSnow size={64} className="text-blue-100" />;
  }

  // Thunderstorm
  if (code >= 95) {
    return (
      <BsFillCloudLightningRainFill size={64} className="text-yellow-200" />
    );
  }

  return <FaRegSun size={64} className="text-white" />;
};

export default function WeatherWidget() {
  const season = getSeason();
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 0,
    weatherCode: 0,
    isDay: true,
    location: "Detecting...",
    loading: true,
    error: null,
    permissionDenied: false,
  });

  useEffect(() => {
    const fetchWeather = async (latitude: number, longitude: number) => {
      try {
        // Get location name from reverse geocoding (using a simple approach)
        let locationName = "Local Weather";
        try {
          const geoRes = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
          );
          const geoData = await geoRes.json();
          locationName =
            geoData.city ||
            geoData.locality ||
            geoData.principalSubdivision ||
            "Local Weather";
        } catch {
          // Fallback to coordinates if geocoding fails
          locationName = `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
        }

        // Fetch weather from Open-Meteo API
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch weather data");
        }

        const data = await response.json();
        const current = data.current_weather;

        setWeather({
          temperature: current.temperature,
          weatherCode: current.weathercode,
          isDay: current.is_day === 1,
          location: locationName,
          loading: false,
          error: null,
        });
      } catch (err) {
        setWeather((prev) => ({
          ...prev,
          loading: false,
          error: "Failed to load weather",
        }));
      }
    };

    const getLocation = () => {
      if (!navigator.geolocation) {
        // Fallback: Use a default location (e.g., New York)
        fetchWeather(40.7128, -74.006);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error("Geolocation error:", error);
          // User denied permission - show season fallback
          setWeather({
            temperature: 0,
            weatherCode: 0,
            isDay: true,
            location: "",
            loading: false,
            error: null,
            permissionDenied: true,
          });
        },
      );
    };

    getLocation();
  }, []);

  if (weather.loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mb-3"></div>
        <p className="text-white/80 text-sm animate-pulse">
          Detecting location...
        </p>
      </div>
    );
  }

  // Show Season fallback when permission denied
  if (weather.permissionDenied) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-6 px-100 text-center">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 w-full min-w-[200px] max-w-[400px]">
          <div className="text-5xl mb-3 animate-bounce flex justify-center">
            {season.icon}
          </div>
          <h3 className="text-xl font-bold text-white mb-1">{season.name}</h3>
          <p className="text-white/80 text-sm">{season.description}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 text-xs bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-full transition-colors"
          >
            Enable Location
          </button>
        </div>
      </div>
    );
  }

  if (weather.error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <div className="bg-red-500/20 backdrop-blur-sm rounded-2xl p-4">
          <div className="text-4xl mb-2">⚠️</div>
          <p className="text-red-300 text-sm">{weather.error}</p>
        </div>
      </div>
    );
  }

  const weatherDescription = weatherCodes[weather.weatherCode] || "Unknown";
  const icon = getWeatherIcon(weather.weatherCode, weather.isDay);

  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <div className="flex flex-col items-center justify-center bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl py-4 px-20 w-full h-full min-h-[250px] max-w-[800px] shadow-lg">
        {/* Location */}
        <div className="flex items-center justify-center gap-1 mb-2">
          <svg
            className="w-4 h-4 text-white/70 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-white/80 text-sm font-medium">
            {weather.location}
          </span>
        </div>

        {/* Weather Icon */}
        <div className="text-6xl mb-2 text-center">{icon}</div>

        {/* Temperature */}
        <div className="text-center mb-2">
          <span className="text-4xl font-bold text-white">
            {Math.round(weather.temperature)}°
          </span>
          <span className="text-2xl text-white/60">C</span>
        </div>

        {/* Description */}
        <p className="text-center text-white/90 text-sm font-medium bg-white/10 rounded-full py-1.5 px-3">
          {weatherDescription}
        </p>

        {/* Season hint */}
        <div className="mt-3 pt-3 border-t border-white/10 text-center">
          <p className="text-xs text-white/60">{season.name} season</p>
        </div>
      </div>
    </div>
  );
}

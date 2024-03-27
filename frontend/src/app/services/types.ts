export interface WeatherReport {
  visibility: number;
  timezone: number;
  main: {
    temp: number;
    temp_min: number;
    humidity: number;
    pressure: number;
    feels_like: number;
    temp_max: number;
  };
  clouds: { all: number };
  sys: {
    country: 'US';
    sunrise: number;
    sunset: number;
    id: number;
    type: number;
  };
  dt: number;
  coord: { lon: number; lat: number };
  weather: { icon: string; description: string; main: string; id: number }[];
  name: string;
  cod: number;
  id: number;
  base: string;
  wind: { deg: number; speed: number; gust: number };
  timestamp: string;
}

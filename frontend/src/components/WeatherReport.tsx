import { useGetCurrentWeatherQuery } from '@/app/services/weatherApiSlice';

const WeatherReport = () => {
  const { data } = useGetCurrentWeatherQuery({});
  return (
    <pre style={{ whiteSpace: 'pre-wrap' }}>
      {JSON.stringify(data, null, 4)}
    </pre>
  );
};

export default WeatherReport;

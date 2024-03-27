import { Box, SvgIcon } from '@mui/material';
import { useGetCurrentWeatherQuery } from '@/app/services/weatherApiSlice';
import SunIcon from './icons/SunIcon';

const WeatherReport = () => {
  const { data } = useGetCurrentWeatherQuery({});
  return (
    <Box sx={{ display: 'flex' }}>
      <pre style={{ whiteSpace: 'pre-wrap' }}>
        {JSON.stringify(data, null, 4)}
      </pre>
      <SunIcon />
    </Box>
  );
};

export default WeatherReport;

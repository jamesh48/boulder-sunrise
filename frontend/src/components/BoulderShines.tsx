import { Box, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { useRef } from 'react';
import SunDial from './SunDial/Index';
import {
  useGetCurrentTimeZoneQuery,
  useGetCurrentWeatherQuery,
} from '@/app/services/weatherApiSlice';
import DataView from './DataView';
import UserPreferences from './UserPreferences';
import { useSelector } from 'react-redux';
import { getUserLocation } from '@/app/appSlice';

const BoulderShines = () => {
  const userLocation = useSelector(getUserLocation);
  const isLoggedIn = Boolean(userLocation);
  const { data: timeZone } = useGetCurrentTimeZoneQuery(
    { city: userLocation },
    { skip: !isLoggedIn }
  );

  const { data: weatherReport } = useGetCurrentWeatherQuery(
    {
      location: userLocation,
    },
    { skip: !isLoggedIn }
  );

  const dataContainerRef = useRef<HTMLDivElement>();

  const theme = createTheme({
    palette: {
      primary: {
        main: '#3f51b5',
      },
      secondary: {
        main: '#f50057',
      },
      background: {
        default: '#f0f0f0',
      },
      text: {
        primary: '#333',
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: 'flex',
          height: '100vh',
          overflowY: 'hidden',
        }}
      >
        <DataView
          weatherReport={weatherReport}
          dataContainerRef={dataContainerRef}
        />
        <SunDial
          isLoggedIn={isLoggedIn}
          weatherReport={weatherReport}
          dataContainerRef={dataContainerRef}
        />

        <UserPreferences />
      </Box>
    </ThemeProvider>
  );
};

export default BoulderShines;

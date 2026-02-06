import { useRef } from 'react';
import { useSelector } from 'react-redux';
import { Box, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';

import SwipeWheelProvider from './Providers/SwipeWheelProvider';
import { useGetCurrentWeatherQuery } from '@/app/services/weatherApiSlice';
import { getUserLocation } from '@/app/appSlice';

import SunDial from './SunDial/SunDial';
import WeatherView from './WeatherView/WeatherView';
import UserPreferences from './UserPreferences/UserPreferences';

const BoulderShines = () => {
  const userLocation = useSelector(getUserLocation);
  const isLoggedIn = Boolean(userLocation);
  const dataContainerRef = useRef<HTMLDivElement>();

  const { data: weatherReport } = useGetCurrentWeatherQuery(
    {
      location: userLocation,
    },
    { skip: !isLoggedIn },
  );

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
      <SwipeWheelProvider>
        <Box
          sx={{
            display: 'flex',
            overflowY: 'hidden',
            overflowX: 'hidden',
          }}
        >
          <WeatherView dataContainerRef={dataContainerRef} />
          <SunDial
            isLoggedIn={isLoggedIn}
            weatherReport={weatherReport}
            dataContainerRef={dataContainerRef}
          />
          <UserPreferences />
        </Box>
      </SwipeWheelProvider>
    </ThemeProvider>
  );
};

export default BoulderShines;

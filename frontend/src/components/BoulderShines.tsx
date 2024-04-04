import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import ReactScrollWheelHandler from 'react-scroll-wheel-handler';

import { useGetCurrentWeatherQuery } from '@/app/services/weatherApiSlice';
import {
  getWeatherView,
  getUserLocation,
  getUserView,
  toggleWeatherView,
  toggleUserView,
} from '@/app/appSlice';

import SunDial from './SunDial/SunDial';
import WeatherView from './WeatherView/WeatherView';
import UserPreferences from './UserPreferences/UserPreferences';

const BoulderShines = () => {
  const userLocation = useSelector(getUserLocation);
  const isLoggedIn = Boolean(userLocation);

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

  const dispatch = useDispatch();
  const userView = useSelector(getUserView);
  const weatherView = useSelector(getWeatherView);
  return (
    <ThemeProvider theme={theme}>
      <ReactScrollWheelHandler
        upHandler={(event) => {
          if (Math.abs(event.deltaY) < Math.abs(event.deltaX)) {
            if (userView) {
              dispatch(toggleUserView());
            } else if (!weatherView) {
              dispatch(toggleWeatherView());
            }
          }
        }}
        downHandler={(event) => {
          if (Math.abs(event.deltaY) < Math.abs(event.deltaX)) {
            if (weatherView) {
              dispatch(toggleWeatherView());
            } else if (!userView) {
              dispatch(toggleUserView());
            }
          }
        }}
      >
        <Box
          sx={{
            display: 'flex',
            height: '100vh',
            overflowY: 'hidden',
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
      </ReactScrollWheelHandler>
    </ThemeProvider>
  );
};

export default BoulderShines;

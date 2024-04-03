import { useRef } from 'react';
import { Box, ThemeProvider } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import ReactScrollWheelHandler from 'react-scroll-wheel-handler';
import { createTheme } from '@mui/material/styles';
import SunDial from './SunDial/Index';
import { useGetCurrentWeatherQuery } from '@/app/services/weatherApiSlice';
import WeatherView from './WeatherView/WeatherView';
import UserPreferences from './UserPreferences';
import {
  getDataView,
  getUserLocation,
  getUserView,
  toggleDataView,
  toggleUserView,
} from '@/app/appSlice';

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
  const weatherView = useSelector(getDataView);
  return (
    <ThemeProvider theme={theme}>
      <ReactScrollWheelHandler
        upHandler={(event) => {
          if (Math.abs(event.deltaX) > 3) {
            if (userView) {
              dispatch(toggleUserView());
            } else if (!weatherView) {
              dispatch(toggleDataView());
            }
          }
        }}
        downHandler={(event) => {
          if (Math.abs(event.deltaX) > 3) {
            if (weatherView) {
              dispatch(toggleDataView());
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

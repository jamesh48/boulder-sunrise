import { Box, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { useEffect, useRef, useState } from 'react';
import SunDial from './SunDial';
import {
  useGetCurrentTimeZoneQuery,
  useGetCurrentWeatherQuery,
} from '@/app/services/weatherApiSlice';
import DataView from './DataView';
import UserPreferences from './UserPreferences';

const BoulderShines = () => {
  const [location, setLocation] = useState('Boulder,CO,USA');

  const { data: timeZone } = useGetCurrentTimeZoneQuery({ city: location });

  const { data: weatherReport } = useGetCurrentWeatherQuery({
    location: location,
  });

  const [dataView, setDataView] = useState(false);
  const [userView, setUserView] = useState(false);
  const dataContainerRef = useRef<HTMLDivElement>();

  const handleDataView = (flag: boolean) => {
    setDataView(flag);
  };

  const handleSetLocation = (str: string) => {
    setLocation(str);
  };

  const handleUserView = (flag: boolean) => {
    setUserView(flag);
  };

  useEffect(() => {
    if (userView) {
      setDataView(false);
    }
  }, [userView]);

  useEffect(() => {
    if (dataView) {
      setUserView(false);
    }
  }, [dataView]);

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
          dataView={dataView}
          handleDataView={handleDataView}
          weatherReport={weatherReport}
          dataContainerRef={dataContainerRef}
        />
        <SunDial
          dataView={dataView}
          weatherReport={weatherReport}
          dataContainerRef={dataContainerRef}
          location={location}
          timeZone={timeZone?.result || 'America/Denver'}
        />
        <UserPreferences
          userView={userView}
          handleUserView={handleUserView}
          handleSetLocation={handleSetLocation}
        />
      </Box>
    </ThemeProvider>
  );
};

export default BoulderShines;

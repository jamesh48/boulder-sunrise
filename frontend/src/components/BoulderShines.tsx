import { Box, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { useRef, useState } from 'react';
import SunDial from './SunDial';
import { useGetCurrentWeatherQuery } from '@/app/services/weatherApiSlice';
import DataView from './DataView';
import DevInfo from './DevInfo';

const BoulderShines = () => {
  const { data: weatherReport } = useGetCurrentWeatherQuery({});

  const [dataView, setDataView] = useState(false);
  const [devView, setDevView] = useState(false);
  const dataContainerRef = useRef<HTMLDivElement>();

  const handleDataView = (flag: boolean) => {
    setDataView(flag);
  };

  const handleDevView = (flag: boolean) => {
    setDevView(flag);
  };

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
        />
        <DevInfo devView={devView} handleDevView={handleDevView} />
      </Box>
    </ThemeProvider>
  );
};

export default BoulderShines;

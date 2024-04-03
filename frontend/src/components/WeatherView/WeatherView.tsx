import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import { getDataView, getUserLocation, toggleDataView } from '@/app/appSlice';
import { useGetCurrentWeatherQuery } from '@/app/services/weatherApiSlice';
import { ExpandLessTwoTone, ExpandMoreTwoTone } from '@mui/icons-material';
import { Box, Collapse, IconButton, Typography } from '@mui/material';
import { SkeletonIndicators, WeatherIndicators } from './WeatherIndicators';

interface WeatherViewProps {
  dataContainerRef: React.MutableRefObject<HTMLDivElement | undefined>;
}

const WeatherView = (props: WeatherViewProps) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const userLocation = useSelector(getUserLocation);
  const dataView = useSelector(getDataView);

  const {
    data: weatherReport,
    isLoading,
    isFetching,
  } = useGetCurrentWeatherQuery({
    location: userLocation,
  });

  return (
    <Box
      sx={{
        display: 'flex',
        flex: dataView ? 0.25 : 0,
        alignItems: 'center',
        height: '100%',
        justifyContent: 'center',
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
      }}
      ref={props.dataContainerRef}
    >
      <Collapse
        in={dataView}
        orientation="horizontal"
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '90%',
          paddingX: dataView ? '.5rem' : 0,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            overflowY: 'auto',
            height: '100%',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
          }}
        >
          <Typography
            variant="h6"
            sx={{
              borderBottom: `3px solid ${theme.palette.primary.main}`,
              marginBottom: '1rem',
              textAlign: 'center',
            }}
          >
            {weatherReport?.name} Weather
          </Typography>

          {isLoading || isFetching ? (
            <SkeletonIndicators />
          ) : weatherReport ? (
            <WeatherIndicators weatherReport={weatherReport} />
          ) : null}
        </Box>
      </Collapse>
      <Box
        sx={{
          borderLeft: `3px solid ${theme.palette.primary.main}`,
          height: '100%',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <IconButton
          sx={{
            padding: '.5rem',
            color: theme.palette.primary.main,
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
          }}
          onClick={() => {
            dispatch(toggleDataView());
          }}
        >
          {dataView ? (
            <ExpandLessTwoTone sx={{ transform: 'rotate(-90deg)' }} />
          ) : (
            <ExpandMoreTwoTone sx={{ transform: 'rotate(-90deg)' }} />
          )}
        </IconButton>
      </Box>
    </Box>
  );
};

export default WeatherView;

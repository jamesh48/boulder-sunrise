import { useDispatch, useSelector } from 'react-redux';
import { ExpandLessTwoTone, ExpandMoreTwoTone } from '@mui/icons-material';
import { Box, Collapse, IconButton, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  getWeatherView,
  getUserLocation,
  toggleWeatherView,
  toggleStateSwitch,
} from '@/app/appSlice';
import {
  useGetCurrentTimeZoneQuery,
  useGetCurrentWeatherQuery,
} from '@/app/services/weatherApiSlice';
import { SkeletonIndicators, WeatherIndicators } from './WeatherIndicators';
import { useGetCurrentMeetupsQuery } from '@/app/services/meetupApiSlice';
import Image from 'next/image';

interface WeatherViewProps {
  dataContainerRef: React.MutableRefObject<HTMLDivElement | undefined>;
}

interface LocalEventProps {
  title: string;
  imageUrl: string;
  eventUrl: string;
}
const LocalEvent = (props: LocalEventProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        cursor: 'pointer',
        borderRadius: '1rem',
        border: '1px solid black',
        marginY: '1rem',
      }}
      onClick={() => window.open(props.eventUrl)}
    >
      <Typography variant="h5" sx={{ marginTop: '.5rem', textAlign: 'center' }}>
        {props.title}
      </Typography>
      <Box sx={{ margin: '.5rem' }}>
        <Image
          src={props.imageUrl}
          width={100}
          height={100}
          alt={props.title}
          layout="responsive"
        />
      </Box>
    </Box>
  );
};

const WeatherView = (props: WeatherViewProps) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const userLocation = useSelector(getUserLocation);
  const weatherView = useSelector(getWeatherView);

  const { data: locationData } = useGetCurrentTimeZoneQuery({
    city: userLocation,
  });

  const { data: meetups } = useGetCurrentMeetupsQuery(
    {
      lat: locationData?.lat,
      lon: locationData?.lng,
      query: 'party',
    },
    { skip: !locationData }
  );
  const {
    data: weatherReport,
    isLoading,
    isFetching,
  } = useGetCurrentWeatherQuery(
    {
      location: userLocation,
    },
    {
      skip: !userLocation,
    }
  );

  return (
    <Box
      sx={{
        display: 'flex',
        flex: weatherView ? 0.25 : 0,
        alignItems: 'center',
        height: '100%',
        justifyContent: 'center',
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
      }}
      ref={props.dataContainerRef}
    >
      <Collapse
        onExited={() => dispatch(toggleStateSwitch())}
        in={weatherView}
        orientation="horizontal"
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '95%',
          paddingX: weatherView ? '.5rem' : 0,
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            overflowY: 'auto',
            flex: 1,
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
              width: '15rem',
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
        <Box
          sx={{
            display: 'flex',
            flex: 1,
            width: '100%',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {/* <pre>{JSON.stringify(meetups, null, 4)}</pre> */}
          <Typography
            variant="h6"
            sx={{
              borderBottom: `3px solid ${theme.palette.primary.main}`,
              marginBottom: '.5rem',
              textAlign: 'center',
              width: '15rem',
            }}
          >
            {weatherReport?.name} Local Events
          </Typography>
          <Box
            sx={{
              overflowY: 'scroll',
              maxHeight: '60rem',
            }}
          >
            {meetups?.edges?.map(({ node: { result } }, idx) => (
              <LocalEvent
                key={idx}
                title={result.title}
                imageUrl={result.imageUrl}
                eventUrl={result.eventUrl}
              />
            ))}
          </Box>
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
            dispatch(toggleWeatherView());
          }}
        >
          {weatherView ? (
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

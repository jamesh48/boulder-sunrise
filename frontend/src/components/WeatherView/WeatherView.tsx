import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Close,
  ExpandLessTwoTone,
  ExpandMoreTwoTone,
} from '@mui/icons-material';
import {
  Box,
  Collapse,
  IconButton,
  Typography,
  Skeleton,
  OutlinedInput,
  Chip,
} from '@mui/material';
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
import { getTodayWithTZ } from '@/app/utils/getTodayWithTZ';
import LocalEvent from './LocalEvent';
import BlockingTooltip from '../CustomComponents/BlockingTooltip';

interface WeatherViewProps {
  dataContainerRef: React.MutableRefObject<HTMLDivElement | undefined>;
}

const WeatherView = (props: WeatherViewProps) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const userLocation = useSelector(getUserLocation);
  const weatherView = useSelector(getWeatherView);
  const [eventQuery, setEventQuery] = useState('party');
  const [debouncedEventQuery, setDebouncedEventQuery] = useState('party');
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
    null
  );
  const [searchAdditionalOptionsOpen, setSearchAdditionalOptionsOpen] =
    useState(false);
  const [searchRadius, setSearchRadius] = useState(5);
  const [confirmedSearchRadius, setConfirmedSearchRadius] = useState(5);
  const { data: locationData } = useGetCurrentTimeZoneQuery({
    city: userLocation,
  });

  const outerScrollComponent = useRef<HTMLDivElement>();
  const todayWithTZ = getTodayWithTZ(locationData?.timezone);

  const {
    data: meetups,
    isLoading: isLoadingMeetups,
    isFetching: isFetchingMeetups,
  } = useGetCurrentMeetupsQuery(
    {
      lat: locationData?.lat,
      lon: locationData?.lng,
      query: debouncedEventQuery,
      endDateRange: todayWithTZ.endDateRange,
      radius: confirmedSearchRadius,
    },
    { skip: !locationData }
  );

  const {
    data: weatherReport,
    isLoading: isLoadingWeather,
    isFetching: isFetchingWeather,
  } = useGetCurrentWeatherQuery(
    {
      location: userLocation,
    },
    {
      skip: !userLocation,
    }
  );

  useEffect(() => {
    if (searchAdditionalOptionsOpen) {
      handleOpenIndex(-1);
    }
  }, [searchAdditionalOptionsOpen]);

  useEffect(() => {
    const debounceDelay = 1000;
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    const timer = setTimeout(() => {
      setDebouncedEventQuery(eventQuery);
    }, debounceDelay);
    setDebounceTimer(timer);

    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventQuery]);

  const [indexOpen, setIndexOpen] = useState(-1);
  const handleOpenIndex = (idx: number) => {
    setIndexOpen(idx);
  };

  const anchorRef = useRef(null);
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
          height: '90%',
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
            {weatherReport?.name ? (
              `${weatherReport.name} Weather`
            ) : (
              <Skeleton />
            )}
          </Typography>

          {isLoadingWeather || isFetchingWeather ? (
            <SkeletonIndicators />
          ) : weatherReport ? (
            <WeatherIndicators weatherReport={weatherReport} />
          ) : null}
        </Box>
        <Box
          sx={{
            display: 'flex',
            flex: 1,
            height: '100%',
            flexDirection: 'column',
            justifyContent: 'flex-start',
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
              width: '20rem',
            }}
          >
            {weatherReport?.name ? (
              `${weatherReport?.name} Local Events Today`
            ) : (
              <Skeleton />
            )}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <Box
              sx={{
                flex: 0.1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <OutlinedInput
                sx={{ height: '2rem' }}
                name="eventQuery"
                value={eventQuery}
                onChange={(ev) => setEventQuery(ev.currentTarget.value)}
                placeholder="Event Search Query"
                inputProps={{ sx: { textAlign: 'center' } }}
              />
              <Chip
                label="Additional Search Options"
                variant="filled"
                onClick={() => setSearchAdditionalOptionsOpen(true)}
                sx={{
                  border: '.5px solid blue',
                  mt: '.25rem',
                  cursor: 'pointer',
                }}
                ref={anchorRef}
              />
              {eventQuery ? (
                <BlockingTooltip
                  open={searchAdditionalOptionsOpen}
                  anchorRef={anchorRef}
                >
                  <Box sx={{ padding: '.5rem' }}>
                    <Box
                      sx={{
                        width: '100%',
                        borderBottom: '1px solid black',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        mb: '.5rem',
                      }}
                    >
                      <Close
                        onClick={() => setSearchAdditionalOptionsOpen(false)}
                      />
                    </Box>
                    <form
                      onSubmit={(ev) => {
                        ev.preventDefault();
                        setSearchAdditionalOptionsOpen(false);
                        setConfirmedSearchRadius(searchRadius);
                      }}
                    >
                      <Box
                        sx={{
                          width: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                        }}
                      >
                        <Typography>
                          Radius from {userLocation} (miles)
                        </Typography>
                        <OutlinedInput
                          fullWidth
                          value={searchRadius}
                          onChange={(ev) => {
                            setSearchRadius(Number(ev.currentTarget.value));
                          }}
                          autoFocus
                        />
                        <Box sx={{ marginTop: '.5rem' }}>
                          <OutlinedInput
                            type="submit"
                            value="Ok"
                            fullWidth
                            inputProps={{ sx: { cursor: 'pointer' } }}
                          />
                        </Box>
                      </Box>
                    </form>
                  </Box>
                </BlockingTooltip>
              ) : null}
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto',
                height: '75%',
                width: '100%',
                alignItems: 'center',
              }}
              ref={outerScrollComponent}
            >
              {isLoadingMeetups || isFetchingMeetups ? (
                <Box>
                  <Box sx={{ mt: '1rem' }}>
                    <Skeleton variant="rectangular" width={400} height={250} />
                  </Box>
                  <Box sx={{ mt: '1rem' }}>
                    <Skeleton variant="rectangular" width={400} height={250} />
                  </Box>
                  <Box sx={{ mt: '1rem' }}>
                    <Skeleton variant="rectangular" width={400} height={250} />
                  </Box>
                </Box>
              ) : meetups?.edges?.length ? (
                meetups.edges.map(({ node: { result } }, idx) => (
                  // Leave this box wrapper or the events jump upwards when being hovered on
                  <Box key={idx}>
                    <LocalEvent
                      timezone={locationData?.timezone}
                      openIndex={idx}
                      outerScrollComponent={outerScrollComponent}
                      handleOpenIndex={handleOpenIndex}
                      eventOpen={indexOpen === idx}
                      searchAdditionalOptionsOpen={searchAdditionalOptionsOpen}
                      {...result}
                    />
                  </Box>
                ))
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    width: '100%',
                  }}
                >
                  <Typography>
                    {debouncedEventQuery
                      ? '~ No More Events Today ~'
                      : '^^ Search for Events ^^'}
                  </Typography>
                </Box>
              )}
            </Box>
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

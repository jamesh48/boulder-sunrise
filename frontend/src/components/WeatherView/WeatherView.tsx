import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Collapse, Typography, Skeleton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  getWeatherView,
  getUserLocation,
  toggleStateSwitch,
  getUserView,
  getSearchAdditionalOptionsOpen,
} from '@/app/appSlice';
import {
  useGetCurrentTimeZoneQuery,
  useGetCurrentWeatherQuery,
} from '@/app/services/weatherApiSlice';
import { SkeletonIndicators, WeatherIndicators } from './WeatherIndicators';
import { useGetCurrentMeetupsQuery } from '@/app/services/meetupApiSlice';
import { getTodayWithTZ } from '@/app/utils/getTodayWithTZ';
import LocalEvent from './LocalEvent';
import useSortOrder from '@/app/customHooks/useSortOrder';
import useSearchRadius from '@/app/customHooks/useSearchRadius';
import useSortBy from '@/app/customHooks/useSortBy';
import useIsMobile from '@/app/customHooks/useIsMobile';
import TrayHandle from '../TrayHandle';
import useHandleInputBlur from '@/app/customHooks/useHandleInputBlur';
import LocalEventsSkeleton from './LocalEventsSkeleton';
import SearchAdditionalOptions from './SearchAdditionalOptions';

interface WeatherViewProps {
  dataContainerRef: React.MutableRefObject<HTMLDivElement | undefined>;
}

const WeatherView = (props: WeatherViewProps) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const isMobile = useIsMobile();
  const outerScrollComponent = useRef<HTMLDivElement>();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const userLocation = useSelector(getUserLocation);
  const weatherView = useSelector(getWeatherView);
  const [eventQuery, setEventQuery] = useState('party');
  const [debouncedEventQuery, setDebouncedEventQuery] = useState('party');
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
    null
  );
  const searchAdditionalOptionsOpen = useSelector(
    getSearchAdditionalOptionsOpen
  );

  const {
    getters: { confirmedSearchRadius },
    setters: { setConfirmedSearchRadius },
  } = useSearchRadius();

  const {
    getters: { confirmedSortOrder },
    setters: { setConfirmedSortOrder },
  } = useSortOrder();

  const {
    getters: { confirmedSortBy },
    setters: { setConfirmedSortBy },
  } = useSortBy();

  const handleEventQueryChange = (input: string) => {
    setEventQuery(input);
  };

  const handleInputFocus = () => {
    setIsInputFocused(true);
  };

  const handleInputBlur = () => {
    setIsInputFocused(false);
  };

  const { data: locationData } = useGetCurrentTimeZoneQuery({
    city: userLocation,
  });

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
      sortOrder: confirmedSortOrder,
      sortBy: confirmedSortBy,
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
    const debounceDelay = 750;
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

  const handleSubmit = (radius: number, sortBy: string, sortOrder: string) => {
    setConfirmedSearchRadius(radius);
    setConfirmedSortBy(sortBy);
    setConfirmedSortOrder(sortOrder);
  };

  useHandleInputBlur(inputRef, isInputFocused);

  return (
    <Box
      sx={{
        display: 'flex',
        flex: (() => {
          if (!weatherView) {
            return 0;
          }
          return isMobile ? 'unset' : 0.5;
        })(),
        alignItems: 'center',
        height: '100%',
        width: '100%',
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
          {isInputFocused ? (
            <Box
              sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 1500,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            />
          ) : null}
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
            <SearchAdditionalOptions
              eventQuery={eventQuery}
              isInputFocused={isInputFocused}
              handleInputFocus={handleInputFocus}
              handleInputBlur={handleInputBlur}
              handleEventQueryChange={handleEventQueryChange}
              handleSubmit={handleSubmit}
              inputRef={inputRef}
              debouncedEventQuery={debouncedEventQuery}
            />
            <hr
              style={{
                width: '70%',
                margin: '.5rem',
                border: '2px solid ' + theme.palette.primary.main,
              }}
            />
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto',
                height: '50vh',
                width: '100%',
                alignItems: 'center',
              }}
              ref={outerScrollComponent}
            >
              {isLoadingMeetups || isFetchingMeetups ? (
                <LocalEventsSkeleton />
              ) : meetups?.edges?.length ? (
                meetups.edges.map(({ node: { result } }, idx) => (
                  // Leave this box wrapper or the events jump upwards when being hovered on
                  <Box
                    key={idx}
                    sx={{
                      width: '100%',
                    }}
                  >
                    <LocalEvent
                      timezone={locationData?.timezone}
                      currentIndex={idx}
                      openIndex={indexOpen}
                      outerScrollComponent={outerScrollComponent}
                      handleOpenIndex={handleOpenIndex}
                      eventOpen={indexOpen === idx && !isInputFocused}
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
      <TrayHandle side="l" />
    </Box>
  );
};

export default WeatherView;

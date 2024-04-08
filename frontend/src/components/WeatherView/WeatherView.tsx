import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { ExpandLessTwoTone, ExpandMoreTwoTone } from '@mui/icons-material';
import {
  Box,
  Collapse,
  IconButton,
  Typography,
  Chip,
  Skeleton,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  getWeatherView,
  getUserLocation,
  toggleWeatherView,
  toggleStateSwitch,
  accuateDisabledTraySwipe,
} from '@/app/appSlice';
import {
  useGetCurrentTimeZoneQuery,
  useGetCurrentWeatherQuery,
} from '@/app/services/weatherApiSlice';
import { SkeletonIndicators, WeatherIndicators } from './WeatherIndicators';
import {
  LocalEvent as LocalEventProps,
  useGetCurrentMeetupsQuery,
} from '@/app/services/meetupApiSlice';
import HtmlTooltip from '../CustomComponents/HTMLTooltip';
import useIsMobile from '@/app/customHooks/useIsMobile';
import { getTodayWithTZ } from '@/app/utils/getTodayWithTZ';

interface LocalEventDescriptionProps {
  formattedDateRange: string;
  venue: { name: string; address: string } | undefined;
  topics: { edges: { cursor: string; node: { name: string } }[] };
  description: string;
  scrollComponent: React.MutableRefObject<HTMLElement | undefined>;
  scrollXComponent: React.MutableRefObject<HTMLElement | undefined>;
}

const LocalEventDescription = (props: LocalEventDescriptionProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '1rem',
      }}
    >
      <Typography
        className="Venue"
        variant="h5"
        sx={{
          textDecoration: 'underline',
          padding: '.5rem',
          paddingBottom: 0,
        }}
      >
        Venue: {props.venue?.name || props.venue?.address || 'See Event'}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          alignItems: 'center',
          paddingY: '.5rem',
        }}
      >
        <Typography>{props.formattedDateRange}</Typography>
      </Box>
      <Box
        sx={{
          maxHeight: '15rem',
          overflowY: 'auto',
          border: '1px solid white',
          borderRadius: '5px',
          width: '100%',
        }}
        ref={props.scrollComponent}
      >
        <Typography sx={{ padding: '.25rem', display: 'flex', width: '100%' }}>
          {props.description || 'No Description Provided'}
        </Typography>
      </Box>

      <Box
        sx={{
          width: '100%',
          display: 'flex',
          paddingTop: '1rem',
          overflowX: 'auto',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
        }}
        ref={props.scrollXComponent}
      >
        {props.topics.edges.map((edge, idx) => (
          <Box key={idx} sx={{ display: 'flex', width: '100%' }}>
            <Chip
              label={edge.node.name}
              variant="filled"
              color="success"
              sx={{ flex: 1, marginX: '.15rem' }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};
interface WeatherViewProps {
  dataContainerRef: React.MutableRefObject<HTMLDivElement | undefined>;
}

interface LocalEventPropsWithRef extends LocalEventProps {
  outerScrollComponent: React.MutableRefObject<HTMLDivElement | undefined>;
  mobileIndex: number;
  handleMobileIndex: (idx: number) => void;
  mobileOpen: boolean;
  timezone: string | undefined;
}

const LocalEvent = (props: LocalEventPropsWithRef) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const scrollComponent = useRef<HTMLElement>();
  const scrollXComponent = useRef<HTMLElement>();
  const activeEventRef = useRef<HTMLDivElement>();

  const isMobile = useIsMobile();

  const handleToolTipScroll = useCallback((e: WheelEvent) => {
    scrollComponent.current?.scrollTo({
      top: scrollComponent.current?.scrollTop + e.deltaY,
      behavior: 'auto',
    });

    scrollXComponent.current?.scrollTo({
      left: scrollXComponent.current?.scrollLeft + e.deltaX,
      behavior: 'auto',
    });
  }, []);

  useEffect(() => {
    dispatch(accuateDisabledTraySwipe(open));
  }, [open, dispatch]);

  const cachedMouseWheelHandler = useMemo(
    () => props.outerScrollComponent.current?.onwheel,
    [props.outerScrollComponent]
  );

  useEffect(() => {
    if (props.outerScrollComponent?.current) {
      if (open) {
        props.outerScrollComponent.current.onwheel = (e) => {
          e.preventDefault();
        };
        window.addEventListener('wheel', handleToolTipScroll, true);
      }
      return () => {
        window.removeEventListener('wheel', handleToolTipScroll, true);
        if (props.outerScrollComponent.current) {
          props.outerScrollComponent.current.onwheel = cachedMouseWheelHandler!;
        }
      };
    }
  }, [
    open,
    handleToolTipScroll,
    props.outerScrollComponent,
    cachedMouseWheelHandler,
  ]);

  const startDateTime = new Date(new Date(props.dateTime));

  const endDateTime = new Date(props.endTime);

  const formattedDateRange = `${startDateTime.toLocaleDateString(
    'en-US'
  )} ${startDateTime.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: props.timezone,
  })} - ${endDateTime.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: props.timezone,
  })}`;

  return (
    <HtmlTooltip
      placement="right"
      open={!isMobile && open}
      description={
        <LocalEventDescription
          formattedDateRange={formattedDateRange}
          venue={props.venue}
          topics={props.topics}
          description={props.description}
          scrollComponent={scrollComponent}
          scrollXComponent={scrollXComponent}
        />
      }
      divOrSpan="div"
      opacity={1}
      backgroundColor={theme.palette.primary.main}
      textColor="white"
    >
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
        ref={activeEventRef}
        onClick={() => {
          if (isMobile) {
            props.handleMobileIndex(props.mobileIndex);
            // Reset Scroll Position of Active Element after another one Closes
            setTimeout(() => {
              if (activeEventRef.current) {
                activeEventRef.current.scrollIntoView({
                  behavior: 'instant',
                  block: 'start',
                });
              }
            }, 0);
          } else {
            window.open(props.eventUrl);
          }
        }}
        onMouseOver={() => {
          if (!isMobile) {
            setOpen(true);
          }
        }}
        onMouseLeave={() => {
          if (!isMobile) {
            setOpen(false);
          }
        }}
      >
        <Typography
          variant="h5"
          sx={{ marginTop: '.5rem', textAlign: 'center' }}
        >
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
        {props.mobileOpen ? (
          <LocalEventDescription
            formattedDateRange={formattedDateRange}
            venue={props.venue}
            topics={props.topics}
            description={props.description}
            scrollComponent={scrollComponent}
            scrollXComponent={scrollXComponent}
          />
        ) : null}
      </Box>
    </HtmlTooltip>
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
      query: 'party',
      endDateRange: todayWithTZ.endDateRange,
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

  const [mobileIndexOpen, setMobileIndexOpen] = useState(-1);
  const handleMobileIndex = (idx: number) => {
    setMobileIndexOpen(idx);
  };

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
            width: '100%',
            height: '70%',
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
            ref={outerScrollComponent}
            sx={{
              overflowY: 'scroll',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {isLoadingMeetups || isFetchingMeetups ? (
              <Skeleton />
            ) : meetups?.edges?.length ? (
              meetups.edges.map(({ node: { result } }, idx) => (
                <LocalEvent
                  timezone={locationData?.timezone}
                  key={idx}
                  mobileIndex={idx}
                  outerScrollComponent={outerScrollComponent}
                  handleMobileIndex={handleMobileIndex}
                  mobileOpen={mobileIndexOpen === idx}
                  {...result}
                />
              ))
            ) : (
              <Box>
                <Typography>~ No More Events Today ~</Typography>
              </Box>
            )}
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

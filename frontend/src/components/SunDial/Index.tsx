import { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { Box, useTheme } from '@mui/material';
import { WeatherReport } from '@/app/services/types';
import {
  constructLocalDate,
  useCurrentPlacements,
  useCurrentWindowPercentages,
} from '@/app/customHooks';
import TimeMarkers from './TimeMarkers';
import WeatherIconContainer from './IconContainer';
import { getUserLocation } from '@/app/appSlice';
import { useGetCurrentTimeZoneQuery } from '@/app/services/weatherApiSlice';
import SunriseSunset from './SunriseSunset';
interface SunDialProps {
  isLoggedIn: boolean;
  weatherReport: WeatherReport | undefined;
  dataContainerRef: React.MutableRefObject<HTMLDivElement | undefined>;
}

const SunDial = (props: SunDialProps) => {
  const theme = useTheme();
  const userLocation = useSelector(getUserLocation);
  const { data: timeZone } = useGetCurrentTimeZoneQuery({ city: userLocation });

  const sunsetLineRef = useRef<HTMLHRElement>(null);
  const sunriseLineRef = useRef<HTMLHRElement>(null);
  const sunContainerRef = useRef<HTMLDivElement>();

  const [sunPlacement, sunriseLinePlacement, sunsetLinePlacement] =
    useCurrentPlacements(props.weatherReport, timeZone?.result);

  const sunrise = constructLocalDate(
    props.weatherReport?.sys.sunrise || 0,
    timeZone?.result
  );
  const sunriseStr = `Sunrise: ${sunrise.getHours()}:${
    sunrise.getMinutes().toString().length === 1 ? '0' : ''
  }${sunrise.getMinutes()}am`;

  const sunset = constructLocalDate(
    props.weatherReport?.sys.sunset || 0,
    timeZone?.result
  );
  const sunsetStr = `Sunset: ${
    sunset.getHours() - 12
  }:${sunset.getMinutes()}pm`;

  const now = moment();
  const isMoonTime = now.isBefore(sunrise) || now.isAfter(sunset);

  useEffect(() => {
    if (sunsetLineRef.current && sunsetLinePlacement !== undefined) {
      sunsetLineRef.current.style.top = `${sunsetLinePlacement}px`;
    }
    if (sunriseLineRef.current && sunriseLinePlacement !== undefined) {
      sunriseLineRef.current.style.top = `${sunriseLinePlacement}px`;
    }
    if (
      sunPlacement &&
      sunContainerRef.current &&
      props.dataContainerRef.current &&
      props.weatherReport?.weather.length
    ) {
      sunContainerRef.current.style.top =
        sunPlacement - sunContainerRef.current.clientHeight / 2 + 'px';
    }
  }, [
    sunPlacement,
    sunriseLinePlacement,
    sunsetLinePlacement,
    props.weatherReport,
    props.dataContainerRef,
    isMoonTime,
  ]);

  const [sunrisePercentage, sunsetPercentage] = useCurrentWindowPercentages(
    sunriseLinePlacement,
    sunsetLinePlacement
  );

  return (
    <Box
      sx={{
        borderLeft: `1px solid ${theme.palette.text.primary}`,
        borderRight: `1px solid ${theme.palette.text.primary}`,
        flexDirection: 'row',
        flex: 1,
        position: 'relative',
        display: 'flex',
      }}
    >
      <TimeMarkers
        sunset={sunset}
        sunrise={sunrise}
        sunrisePercentage={sunrisePercentage}
        sunsetPercentage={sunsetPercentage}
        timeZoneLoaded={!!timeZone?.result}
        isLoggedIn={props.isLoggedIn}
      />
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 25, 0.5) ${
            sunsetPercentage - 3
          }%, transparent ${sunsetPercentage}%, transparent ${sunrisePercentage}%, rgba(0, 0, 25, 0.5) ${
            sunrisePercentage + 3
          }%)`,
          transition: 'opacity 2s ease',
          opacity: timeZone?.result ? 1 : 0,
        }}
      >
        {!!props.weatherReport && !!timeZone?.result ? (
          <Box>
            <WeatherIconContainer
              timeZone={timeZone?.result}
              sunContainerRef={sunContainerRef}
              isMoonTime={isMoonTime}
              currentWeather={props.weatherReport?.weather[0].main}
            />

            <SunriseSunset
              isMoonTime={isMoonTime}
              tooltipTitle={sunsetStr}
              lineRef={sunsetLineRef}
            />

            <SunriseSunset
              isMoonTime={isMoonTime}
              tooltipTitle={sunriseStr}
              lineRef={sunriseLineRef}
            />
          </Box>
        ) : null}
      </Box>
    </Box>
  );
};

export default SunDial;

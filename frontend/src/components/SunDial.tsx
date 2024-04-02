import { useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Tooltip,
  useTheme,
  tooltipClasses,
  styled,
  TooltipProps,
} from '@mui/material';
import moment from 'moment';

import { WeatherReport } from '@/app/services/types';
import {
  constructLocalDate,
  useCurrentPlacements,
  useCurrentWindowPercentages,
} from '@/app/customHooks';
import {
  MoonIcon,
  SunIcon,
  PartlyCloudyIcon,
  MoonCloudsIcon,
  DayRainIcon,
  MoonRainIcon,
  HazeIcon,
} from './icons';

interface SunDialProps {
  weatherReport: WeatherReport | undefined;
  dataContainerRef: React.MutableRefObject<HTMLDivElement | undefined>;
  timeZone: string;
}

interface CustomTooltipProps extends TooltipProps {
  ismoontime: boolean;
}

const CustomTooltip = styled(
  ({ className, children, title, ...props }: CustomTooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} title={title}>
      {children}
    </Tooltip>
  )
)(({ theme, ismoontime }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: ismoontime ? theme.palette.primary.light : 'yellow',
    color: ismoontime ? 'white' : 'black',
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
}));

const SunDial = (props: SunDialProps) => {
  const theme = useTheme();
  const sunsetLineRef = useRef<HTMLHRElement>(null);
  const sunriseLineRef = useRef<HTMLHRElement>(null);
  const sunContainerRef = useRef<HTMLDivElement>();

  const [sunPlacement, sunriseLinePlacement, sunsetLinePlacement] =
    useCurrentPlacements(props.weatherReport, props.timeZone);

  const sunrise = constructLocalDate(
    props.weatherReport?.sys.sunrise || 0,
    props.timeZone
  );
  const sunriseStr = `Sunrise: ${sunrise.getHours()}:${
    sunrise.getMinutes().toString().length === 1 ? '0' : ''
  }${sunrise.getMinutes()}am`;

  const sunset = constructLocalDate(
    props.weatherReport?.sys.sunset || 0,
    props.timeZone
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
  // alert(props.weatherReport?.weather[0].main);
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
        borderLeft: `1px solid ${theme.palette.text.primary}`,
        borderRight: `1px solid ${theme.palette.text.primary}`,
        position: 'relative',
        backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 25, 0.5) ${
          sunsetPercentage - 3
        }%, transparent ${sunsetPercentage}%, transparent ${sunrisePercentage}%, rgba(0, 0, 25, 0.5) ${
          sunrisePercentage + 3
        }%)`,
      }}
    >
      <Box
        sx={{
          paddingLeft: '.5rem',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        {Array.from({ length: 24 }, (_x, i) => {
          return (
            <Box
              key={i}
              sx={{
                flex: 1,
                display: 'flex',
                justifyContent: 'flex-end',
                flexDirection: 'column',
                color:
                  i > sunset.getHours() || i <= sunrise.getHours()
                    ? 'white'
                    : 'black',
              }}
            >
              <Typography sx={{ lineHeight: 0 }}>
                {i === 0
                  ? 12 + 'am'
                  : i === 12
                  ? '12pm'
                  : i > 12
                  ? i - 12 + 'pm'
                  : i + 'am'}
              </Typography>
            </Box>
          );
        }).reverse()}
      </Box>

      <Box
        ref={sunContainerRef}
        sx={{
          position: 'absolute',
          transition: 'opacity .2s ease-in-out',
          left: '50%',
          transform: 'translate(-50%)',
        }}
      >
        <CustomTooltip
          title={new Date().toLocaleTimeString(undefined, {
            timeZone: props.timeZone,
          })}
          open={true}
          placement="right"
          ismoontime={isMoonTime}
        >
          <Box>
            {isMoonTime ? (
              props.weatherReport?.weather[0].main === 'Clouds' ? (
                <MoonCloudsIcon />
              ) : props.weatherReport?.weather[0].main === 'Rain' ? (
                <MoonRainIcon />
              ) : (
                <MoonIcon />
              )
            ) : props.weatherReport?.weather[0].main === 'Haze' ? (
              <HazeIcon />
            ) : props.weatherReport?.weather[0].main === 'Clouds' ? (
              <PartlyCloudyIcon />
            ) : props.weatherReport?.weather[0].main === 'Rain' ? (
              <DayRainIcon />
            ) : (
              <SunIcon />
            )}
          </Box>
        </CustomTooltip>
      </Box>

      <CustomTooltip title={sunsetStr} placement="top" ismoontime={isMoonTime}>
        <hr
          ref={sunsetLineRef}
          style={{
            position: 'absolute',
            width: '100%',
            top: 0,
            left: 0,
            cursor: 'help',
            opacity: 0.05,
          }}
        />
      </CustomTooltip>

      <CustomTooltip title={sunriseStr} placement="top" ismoontime={isMoonTime}>
        <hr
          ref={sunriseLineRef}
          style={{
            position: 'absolute',
            width: '100%',
            bottom: 0,
            left: 0,
            cursor: 'help',
            opacity: '0.05',
          }}
        />
      </CustomTooltip>
    </Box>
  );
};

export default SunDial;

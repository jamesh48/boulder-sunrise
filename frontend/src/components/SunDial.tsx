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
  constructMountainDate,
  useCurrentPlacements,
  useCurrentWindowPercentages,
} from '@/app/customHooks';
import { MoonIcon, SunIcon, PartlyCloudyIcon } from './icons';

interface SunDialProps {
  dataView: boolean;
  weatherReport: WeatherReport | undefined;
  dataContainerRef: React.MutableRefObject<HTMLDivElement | undefined>;
}

interface CustomTooltipProps extends TooltipProps {
  isMoonTime: boolean;
}

const CustomTooltip = styled(
  ({ className, children, title, ...props }: CustomTooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} title={title}>
      {children}
    </Tooltip>
  )
)(({ theme, isMoonTime }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: isMoonTime ? theme.palette.primary.light : 'yellow',
    color: 'white',
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
    useCurrentPlacements(props.weatherReport);

  const sunrise = constructMountainDate(props.weatherReport?.sys.sunrise || 0);
  const sunriseStr = `Sunrise: ${sunrise.getHours()}:${sunrise.getMinutes()}`;

  const sunset = constructMountainDate(props.weatherReport?.sys.sunset || 0);
  const sunsetStr = `Sunset: ${sunset.getHours()}:${sunset.getMinutes()}`;

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
    props.dataView,
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
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
        borderLeft: `1px solid ${theme.palette.text.primary}`,
        position: 'relative',
        backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.5) ${
          sunsetPercentage - 3
        }%, transparent ${sunsetPercentage}%, transparent ${sunrisePercentage}%, rgba(0, 0, 0, 0.5) ${
          sunrisePercentage + 3
        }%)`,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '100%',
        }}
      >
        {Array.from({ length: 24 }, (_x, i) => (
          <Box
            key={i}
            sx={{
              flex: 1,
              display: 'flex',
              justifyContent: 'flex-end',
              flexDirection: 'column',
            }}
          >
            <Typography sx={{ lineHeight: 0 }}>
              {' '}
              {i > 12 ? 12 - i + 'pm' : i + 'am'} -{' '}
            </Typography>
          </Box>
        )).reverse()}
      </Box>

      <Tooltip title={sunsetStr} placement="top">
        <hr
          ref={sunsetLineRef}
          style={{
            position: 'absolute',
            width: '150%',
            height: '2px',
            top: 0,
            left: 0,
            border: 'none',
            borderTop: `2px solid ${theme.palette.text.primary}`,
            cursor: 'help',
            opacity: 0.05,
          }}
        />
      </Tooltip>
      <Box
        ref={sunContainerRef}
        sx={{
          position: 'absolute',
          transition: 'opacity .2s ease-in-out',
          left: '10%',
          transform: 'translate(-50%)',
        }}
      >
        <CustomTooltip
          title={new Date().toLocaleTimeString()}
          open={true}
          placement="right"
          isMoonTime={isMoonTime}
        >
          <Box>
            {isMoonTime ? (
              <MoonIcon />
            ) : props.weatherReport?.weather[0].main === 'Clouds' ? (
              <PartlyCloudyIcon />
            ) : (
              <SunIcon />
            )}
          </Box>
        </CustomTooltip>
      </Box>

      <Tooltip title={sunriseStr} placement="top">
        <hr
          ref={sunriseLineRef}
          style={{
            position: 'absolute',
            width: '150%',
            height: '2px',
            bottom: 0,
            left: 0,
            border: 'none',
            borderBottom: `2px solid ${theme.palette.text.primary}`,
            cursor: 'help',
            opacity: '0.05',
          }}
        />
      </Tooltip>
    </Box>
  );
};

export default SunDial;

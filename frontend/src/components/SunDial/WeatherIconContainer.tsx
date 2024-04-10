import { useSelector } from 'react-redux';
import { Box, useTheme } from '@mui/material';
import moment from 'moment';
import {
  DayRainIcon,
  HazeIcon,
  MoonCloudsIcon,
  MoonIcon,
  MoonRainIcon,
  PartlyCloudyIcon,
  SunIcon,
} from '../icons';
import { CurrentWeather } from '@/app/services/types';
import HtmlTooltip from '../CustomComponents/HTMLTooltip';
import { getShowSunDial } from '@/app/appSlice';

interface WeatherIconContainerProps {
  timeZone: string | undefined;
  sunContainerRef: React.MutableRefObject<HTMLDivElement | undefined>;
  isMoonTime: boolean;
  currentWeather: CurrentWeather;
  timestamp: Date;
}

const weatherIconMap = {
  Clouds: {
    day: <PartlyCloudyIcon />,
    night: <MoonCloudsIcon />,
  },
  Rain: {
    day: <DayRainIcon />,
    night: <MoonRainIcon />,
  },
  Smoke: {
    day: <HazeIcon />,
    night: <HazeIcon />,
  },
  Haze: {
    day: <HazeIcon />,
    night: <HazeIcon />,
  },
  Clear: {
    day: <SunIcon />,
    night: <MoonIcon />,
  },
};

export default function WeatherIconContainer(props: WeatherIconContainerProps) {
  const theme = useTheme();
  const ind = props.isMoonTime ? 'night' : 'day';
  const localDateTime = moment.utc(props.timestamp).tz(props.timeZone!);
  const formattedTime = localDateTime.format('h:mm:ss A');
  const showSunDial = useSelector(getShowSunDial);
  return (
    <Box
      ref={props.sunContainerRef}
      sx={{
        position: 'absolute',
        transition: 'opacity .2s ease-in-out',
        left: '50%',
        transform: 'translate(-50%)',
      }}
    >
      <HtmlTooltip
        description={formattedTime}
        divOrSpan="div"
        open={!!props.timeZone && showSunDial}
        placement="right"
        borderColor={props.isMoonTime ? 'white' : 'black'}
        textColor={props.isMoonTime ? 'white' : 'black'}
        backgroundColor={
          props.isMoonTime ? theme.palette.primary.light : 'yellow'
        }
      >
        <Box
          sx={{
            opacity: showSunDial ? 1 : 0,
          }}
        >
          {weatherIconMap[props.currentWeather][ind]}
        </Box>
      </HtmlTooltip>
    </Box>
  );
}

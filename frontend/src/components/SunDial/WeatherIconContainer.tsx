import { Box, useTheme } from '@mui/material';
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
import { useSelector } from 'react-redux';
import { getStateSwitch } from '@/app/appSlice';

interface WeatherIconContainerProps {
  timeZone: string | undefined;
  sunContainerRef: React.MutableRefObject<HTMLDivElement | undefined>;
  isMoonTime: boolean;
  currentWeather: CurrentWeather;
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

const WeatherIconContainer = (props: WeatherIconContainerProps) => {
  const theme = useTheme();
  // state switch to rerender the tooltip when trays open/close
  useSelector(getStateSwitch);
  const ind = props.isMoonTime ? 'night' : 'day';

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
        description={new Date().toLocaleTimeString(undefined, {
          timeZone: props.timeZone,
        })}
        divOrSpan="div"
        open={!!props.timeZone}
        placement="right"
        borderColor={props.isMoonTime ? 'white' : 'black'}
        textColor={props.isMoonTime ? 'white' : 'black'}
        backgroundColor={
          props.isMoonTime ? theme.palette.primary.light : 'yellow'
        }
      >
        <Box>{weatherIconMap[props.currentWeather][ind]}</Box>
      </HtmlTooltip>
    </Box>
  );
};

export default WeatherIconContainer;

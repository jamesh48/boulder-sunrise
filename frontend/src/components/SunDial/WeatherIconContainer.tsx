import { Box } from '@mui/material';
import {
  DayRainIcon,
  HazeIcon,
  MoonCloudsIcon,
  MoonIcon,
  MoonRainIcon,
  PartlyCloudyIcon,
  SunIcon,
} from '../icons';
import { CustomTooltip } from '../CustomComponents/CustomTooltip';
import { CurrentWeather } from '@/app/services/types';

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
      <CustomTooltip
        title={new Date().toLocaleTimeString(undefined, {
          timeZone: props.timeZone,
        })}
        open={!!props.timeZone}
        placement="right"
        ismoontime={props.isMoonTime}
      >
        <Box>{weatherIconMap[props.currentWeather][ind]}</Box>
      </CustomTooltip>
    </Box>
  );
};

export default WeatherIconContainer;

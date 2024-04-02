import { Box, Typography } from '@mui/material';

interface TimeMarkersProps {
  sunset: Date;
  sunrise: Date;
  sunrisePercentage: number;
  sunsetPercentage: number;
  timeZoneLoaded: boolean;
  isLoggedIn: boolean;
}

interface ComponentProps {
  sunset: Date;
  sunrise: Date;
}
const Component = (props: ComponentProps) =>
  Array.from({ length: 24 }, (_x, i) => {
    return (
      <Box
        key={i}
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'flex-end',
          flexDirection: 'column',
          color:
            i > props.sunset.getHours() || i <= props.sunrise.getHours()
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
  }).reverse();

const TimeMarkers = (props: TimeMarkersProps) => {
  if (!props.isLoggedIn) {
    return (
      <Box
        sx={{
          paddingLeft: '.5rem',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        <Component sunset={props.sunset} sunrise={props.sunrise} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        paddingLeft: '.5rem',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        transition: 'opacity 2s ease',
        opacity: props.timeZoneLoaded ? 1 : 0,
        backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 25, 0.5) ${
          props.sunsetPercentage - 3
        }%, transparent ${props.sunsetPercentage}%, transparent ${
          props.sunrisePercentage
        }%, rgba(0, 0, 25, 0.5) ${props.sunrisePercentage + 3}%)`,
      }}
    >
      <Component sunset={props.sunset} sunrise={props.sunrise} />
    </Box>
  );
};

export default TimeMarkers;

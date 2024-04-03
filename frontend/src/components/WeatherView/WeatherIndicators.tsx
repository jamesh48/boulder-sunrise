import { Box, Skeleton, Typography } from '@mui/material';
import { WeatherReport } from '@/app/services/types';

interface WeatherIndicatorProps {
  title: string;
  value: string;
  additional?: string;
}

const WeatherIndicator = (props: WeatherIndicatorProps) => {
  return (
    <Box
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <Typography variant="subtitle1">
        {props.title}
        {props.value}
        {props.additional}
      </Typography>
    </Box>
  );
};

interface SkeletonIndicatorProps {
  title: string;
}

const SkeletonIndicator = (props: SkeletonIndicatorProps) => {
  return (
    <Box
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <Typography variant="subtitle1">{props.title}</Typography>
      <Skeleton variant="rectangular" width={50} height={25} />
    </Box>
  );
};

export const SkeletonIndicators = () => {
  return (
    <Box sx={{ textAlign: 'center' }}>
      <SkeletonIndicator title="Current Temp: " />
      <SkeletonIndicator title="High: " />
      <SkeletonIndicator title="Low: " />
      <SkeletonIndicator title="Humidity: " />
      <SkeletonIndicator title="Pressure: " />
      <SkeletonIndicator title="Cloudiness: " />
      <SkeletonIndicator title="Wind Speed: " />
    </Box>
  );
};

interface WeatherIndicatorsProps {
  weatherReport: WeatherReport;
}

export const WeatherIndicators = (props: WeatherIndicatorsProps) => (
  <Box sx={{ textAlign: 'center' }}>
    <WeatherIndicator
      title="Current Temp: "
      value={props.weatherReport.main.temp.toString()}
      additional="°F"
    />
    <WeatherIndicator
      title="High: "
      value={props.weatherReport.main.temp_max.toString()}
      additional="°F"
    />
    <WeatherIndicator
      title="Low: "
      value={props.weatherReport.main.temp_min.toString()}
      additional="°F"
    />
    <WeatherIndicator
      title="Humidity: "
      value={props.weatherReport.main.humidity.toString()}
      additional="%"
    />
    <WeatherIndicator
      title="Pressure: "
      value={props.weatherReport.main.pressure.toString()}
      additional=" hPa"
    />
    <WeatherIndicator
      title="Cloudiness: "
      value={props.weatherReport.clouds.all.toString()}
      additional="%"
    />
    <WeatherIndicator
      title="Wind Speed: "
      value={props.weatherReport.wind.speed.toString()}
      additional=" m/s"
    />
  </Box>
);

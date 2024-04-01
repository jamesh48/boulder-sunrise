import { WeatherReport } from '@/app/services/types';
import { ExpandLessTwoTone, ExpandMoreTwoTone } from '@mui/icons-material';
import { Box, Collapse, IconButton, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface DataViewProps {
  dataView: boolean;
  handleDataView: (flag: boolean) => void;
  weatherReport: WeatherReport | undefined;
  dataContainerRef: React.MutableRefObject<HTMLDivElement | undefined>;
}

const DataView = (props: DataViewProps) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flex: props.dataView ? 0.25 : 0,
        alignItems: 'center',
        height: '100%',
        justifyContent: 'center',
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
      }}
      ref={props.dataContainerRef}
    >
      <Collapse
        in={props.dataView}
        orientation="horizontal"
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '90%',
          paddingX: props.dataView ? '.5rem' : 0,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            overflowY: 'auto',
            height: '100%',
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
            }}
          >
            {props.weatherReport?.name} Weather
          </Typography>
          {props.weatherReport && (
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle1">
                Current Temp: {props.weatherReport.main.temp}°F
              </Typography>
              <Typography variant="subtitle1">
                Low: {props.weatherReport.main.temp_min}°F
              </Typography>
              <Typography variant="subtitle1">
                High: {props.weatherReport.main.temp_max}°F
              </Typography>
              <Typography variant="subtitle1">
                Humidity: {props.weatherReport.main.humidity}%
              </Typography>
              <Typography variant="subtitle1">
                Pressure: {props.weatherReport.main.pressure} hPa
              </Typography>
              <Typography variant="subtitle1">
                Cloudiness: {props.weatherReport.clouds.all}%
              </Typography>
              <Typography variant="subtitle1">
                Wind Speed: {props.weatherReport.wind.speed} m/s
              </Typography>
            </Box>
          )}
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
            props.handleDataView(!props.dataView);
          }}
        >
          {props.dataView ? (
            <ExpandLessTwoTone sx={{ transform: 'rotate(-90deg)' }} />
          ) : (
            <ExpandMoreTwoTone sx={{ transform: 'rotate(-90deg)' }} />
          )}
        </IconButton>
      </Box>
    </Box>
  );
};

export default DataView;

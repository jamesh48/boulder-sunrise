import { Box, Tooltip, Typography } from '@mui/material';
import { useGetCurrentWeatherQuery } from '@/app/services/weatherApiSlice';
import SunIcon from './icons/SunIcon';
import { useEffect, useRef, useState } from 'react';
import { WeatherReport } from '@/app/services/types';
import PartlyCloudyIcon from './icons/PartlyCloudy';
import useCurrentPlacements from '@/app/customHooks/useCurrentPlacements';

const constructMountainDate = (rawTimestamp: number) => {
  const adjustedTimestamp = rawTimestamp * 1000;
  const utcDate = new Date(adjustedTimestamp);
  const mountainDate = new Date(
    utcDate.toLocaleString('en-US', {
      timeZone: 'America/Denver',
    })
  );
  return mountainDate;
};

const calculateIconOffset = (
  position: number,
  weather: WeatherReport['weather'][number]
) => {
  if (weather.main === 'Clear') {
    return position / 2;
  }
  if (weather.main === 'Clouds') {
    return position / 1.55;
  }
  return position / 2;
};

const WeatherReport = () => {
  const { data } = useGetCurrentWeatherQuery({});
  const sunsetLineRef = useRef<HTMLHRElement>(null);
  const sunContainerRef = useRef<HTMLDivElement>();
  const sunriseLineRef = useRef<HTMLHRElement>(null);
  const dataContainerRef = useRef<HTMLDivElement>();

  const [sunPlacement, sunriseLinePlacement, sunsetLinePlacement] =
    useCurrentPlacements(data);

  useEffect(() => {
    if (sunPlacement && sunContainerRef.current && data?.weather.length) {
      sunContainerRef.current.style.top =
        calculateIconOffset(
          sunPlacement + sunContainerRef.current?.clientHeight,
          data?.weather[0]
        ) + 'px';
    }
  }, [sunPlacement, data]);

  useEffect(() => {
    if (sunsetLineRef.current) {
      sunsetLineRef.current.style.top = `${sunsetLinePlacement}px`;
    }
  }, [sunsetLinePlacement]);

  useEffect(() => {
    if (sunriseLineRef.current) {
      sunriseLineRef.current.style.top = `${sunriseLinePlacement}px`;
    }
  }, [sunriseLinePlacement]);

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Box
        ref={dataContainerRef}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          flex: 0.25,
        }}
      >
        <pre style={{ whiteSpace: 'pre-wrap' }}>
          {JSON.stringify(data, null, 4)}
        </pre>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          borderLeft: '1px solid black',
        }}
      >
        <Box
          sx={{ display: 'flex', flexDirection: 'column', maxHeight: '100%' }}
        >
          {Array.from({ length: 24 }, (_x, i) => (
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                justifyContent: 'flex-end',
                flexDirection: 'column',
              }}
              key={i}
            >
              <Typography
                sx={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                -
              </Typography>
              <Typography>{i}</Typography>
            </Box>
          )).reverse()}
        </Box>
        <hr
          ref={sunsetLineRef}
          style={{
            position: 'absolute',
            width: '100%',
            height: '2px',
          }}
        />
        <Tooltip title={new Date().toLocaleTimeString()} open={true}>
          <Box
            sx={{
              position: 'absolute',
              display: 'flex',
              left: dataContainerRef.current?.clientWidth! + 40 + 'px',
            }}
            ref={sunContainerRef}
          >
            {data?.weather[0].main === 'Clouds' ? (
              <PartlyCloudyIcon />
            ) : (
              <SunIcon />
            )}
          </Box>
        </Tooltip>

        <hr
          ref={sunriseLineRef}
          style={{
            position: 'absolute',
            width: '100%',
            height: '2px',
          }}
        />
      </Box>
    </Box>
  );
};

export default WeatherReport;

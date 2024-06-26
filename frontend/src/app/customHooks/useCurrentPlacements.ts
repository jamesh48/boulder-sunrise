import { useEffect, useState } from 'react';

import { WeatherReport } from '../services/types';

export const constructLocalDate = (
  rawTimestamp: number,
  timeZone: string | undefined,
  ind?: boolean
) => {
  const adjustedTimestamp = ind ? rawTimestamp : rawTimestamp * 1000;
  const utcDate = new Date(adjustedTimestamp);
  const localDate = new Date(utcDate.toLocaleString(undefined, { timeZone }));

  return localDate;
};

export const useCurrentPlacements = (
  data: WeatherReport | undefined,
  timeZone: string | undefined
) => {
  const [windowHeight, setWindowHeight] = useState<number>(0);
  const [iconPosition, setIconPosition] = useState<number>();
  const [sunriseLinePosition, setSunriseLinePosition] = useState<number>();
  const [sunsetLinePosition, setSunsetLinePosition] = useState<number>();

  useEffect(() => {
    setWindowHeight(window.innerHeight);
  }, []);
  useEffect(() => {
    if (timeZone) {
      const now = constructLocalDate(Date.now(), timeZone, true);
      const windowHeight = window.innerHeight;
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const position = windowHeight - (currentMinutes / 1440) * windowHeight;
      setIconPosition(position);
    }
  }, [data?.timestamp, timeZone]);

  useEffect(() => {
    if (data && data.sys && data.sys.sunrise && timeZone) {
      const sunriseDate = constructLocalDate(data.sys.sunrise, timeZone);
      const startHour = 0;
      const startMinute = 0;
      const currentHour = sunriseDate.getHours();
      const currentMinute = sunriseDate.getMinutes();
      const totalElapsedMinutes =
        (currentHour - startHour) * 60 + (currentMinute - startMinute);
      const percentageElapsed = totalElapsedMinutes / 1440;
      const windowHeight = window.innerHeight;
      setSunriseLinePosition(windowHeight - percentageElapsed * windowHeight);
    }
  }, [data, timeZone]);

  useEffect(() => {
    if (data && data.sys && data.sys.sunset && timeZone) {
      const sunsetDate = constructLocalDate(data.sys.sunset, timeZone);
      const startHour = 0;
      const startMinute = 0;
      const currentHour = sunsetDate.getHours();
      const currentMinute = sunsetDate.getMinutes();
      const totalElapsedMinutes =
        (currentHour - startHour) * 60 + (currentMinute - startMinute);
      const percentageElapsed = totalElapsedMinutes / 1440;
      const windowHeight = window.innerHeight;
      setSunsetLinePosition(windowHeight - percentageElapsed * windowHeight);
    }
  }, [data, timeZone]);

  const sunrisePercentage = sunriseLinePosition
    ? (sunriseLinePosition / windowHeight) * 100
    : 0;
  const sunsetPercentage = sunsetLinePosition
    ? (sunsetLinePosition / windowHeight) * 100
    : 0;

  return {
    iconPosition,
    sunriseLinePosition,
    sunsetLinePosition,
    sunrisePercentage,
    sunsetPercentage,
  };
};

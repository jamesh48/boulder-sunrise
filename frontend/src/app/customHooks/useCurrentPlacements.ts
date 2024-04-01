import { useEffect, useState } from 'react';

import { WeatherReport } from '../services/types';

export const constructLocalDate = (rawTimestamp: number, timeZone: string) => {
  const adjustedTimestamp = rawTimestamp * 1000;
  const utcDate = new Date(adjustedTimestamp);
  const localDate = new Date(utcDate.toLocaleString(undefined, { timeZone }));
  return localDate;
};

export const useCurrentPlacements = (
  data: WeatherReport | undefined,
  timeZone: string
) => {
  const [sunPosition, setSunPosition] = useState<number>();
  const [sunriseLinePosition, setSunriseLinePosition] = useState<number>();
  const [sunsetLinePosition, setSunsetLinePosition] = useState<number>();

  useEffect(() => {
    const now = new Date(Date.now());
    const windowHeight = window.innerHeight;
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const position = windowHeight - (currentMinutes / 1440) * windowHeight;
    setSunPosition(position);
  }, [data]);

  useEffect(() => {
    if (data && data.sys && data.sys.sunrise) {
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
    if (data && data.sys && data.sys.sunset) {
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
  }, [data]);

  return [sunPosition, sunriseLinePosition, sunsetLinePosition];
};

import { useEffect, useState } from 'react';
import { WeatherReport } from '../services/types';

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

const useCurrentPlacements = (data: WeatherReport | undefined) => {
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
      const mountainSunriseDate = constructMountainDate(data.sys.sunrise);
      const startHour = 0;
      const startMinute = 0;
      const currentHour = mountainSunriseDate.getHours();
      const currentMinute = mountainSunriseDate.getMinutes();
      const totalElapsedMinutes =
        (currentHour - startHour) * 60 + (currentMinute - startMinute);
      const percentageElapsed = totalElapsedMinutes / 1440;
      const windowHeight = window.innerHeight;
      setSunriseLinePosition(windowHeight - percentageElapsed * windowHeight);
    }
  }, [data]);

  useEffect(() => {
    if (data && data.sys && data.sys.sunset) {
      const mountainSunsetDate = constructMountainDate(data.sys.sunset);
      const startHour = 0;
      const startMinute = 0;
      const currentHour = mountainSunsetDate.getHours();
      const currentMinute = mountainSunsetDate.getMinutes();
      const totalElapsedMinutes =
        (currentHour - startHour) * 60 + (currentMinute - startMinute);
      const percentageElapsed = totalElapsedMinutes / 1440;
      const windowHeight = window.innerHeight;
      setSunsetLinePosition(windowHeight - percentageElapsed * windowHeight);
    }
  }, [data]);

  return [sunPosition, sunriseLinePosition, sunsetLinePosition];
};

export default useCurrentPlacements;

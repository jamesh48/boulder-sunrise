import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { WeatherReport } from './types';
import { RootState } from '../store';

const weatherApiSlice = createApi({
  tagTypes: ['Weather'],
  reducerPath: 'weatherApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getCurrentTimeZone: builder.query<{ result: string }, { city: string }>({
      query: (options) => ({
        url: `/timezone?city=${options.city}`,
      }),
    }),
    getCurrentWeather: builder.query<WeatherReport, { location: string }>({
      providesTags: ['Weather'],
      query: (options) => ({
        url: `/bss-weather?location=${encodeURIComponent(options.location)}`,
      }),
      onCacheEntryAdded: async (
        arg,
        { cacheDataLoaded, updateCachedData, getState }
      ) => {
        await cacheDataLoaded;

        const websocketEndpoint = (() => {
          if ((getState() as RootState).app.nodeEnv === 'production') {
            return 'wss://data.bertramcappuccino.com/websocket-endpoint';
          }
          return 'ws://localhost:8080/websocket-endpoint';
        })();

        const ws = new WebSocket(websocketEndpoint);

        ws.onopen = () => {
          console.log('WebSocket connected');
          ws.send(
            JSON.stringify({
              locationVal: arg.location,
            })
          );
        };

        ws.onmessage = (event) => {
          // Handle incoming messages from the WebSocket server
          updateCachedData((draft) => {
            const data = JSON.parse(event.data);
            draft.name = data.name;
            draft.main = {
              ...data.main,
              temp: data.main.temp.toFixed(0),
              feels_like: data.main.feels_like.toFixed(0),
              temp_min: data.main.temp_min.toFixed(0),
              temp_max: data.main.temp_max.toFixed(0),
            };
            draft.weather = data.weather;
            draft.timestamp = data.timestamp;
          });
        };

        ws.onclose = () => {
          console.log('WebSocket disconnected');
        };
      },
    }),
  }),
});

export const { useGetCurrentWeatherQuery, useGetCurrentTimeZoneQuery } =
  weatherApiSlice;

export default weatherApiSlice;

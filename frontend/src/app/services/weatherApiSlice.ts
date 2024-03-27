import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { UnitConverter, TemperatureUnits } from 'd4m-unit-converter';
import { WeatherReport } from './types';

const unitConverter = new UnitConverter();
const converter = unitConverter.TemperatureConverter;

const weatherApiSlice = createApi({
  tagTypes: ['Weather'],
  reducerPath: 'weatherApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getCurrentWeather: builder.query<WeatherReport, {}>({
      providesTags: ['Weather'],
      query: (options) => ({ url: `/bss-weather` }),
      onCacheEntryAdded: async (
        _arg,
        {
          cacheDataLoaded,
          cacheEntryRemoved,
          updateCachedData,
          getState,
          dispatch,
        }
      ) => {
        await cacheDataLoaded;

        const websocketEndpoint = 'ws://localhost:8080/websocket-endpoint';
        const ws = new WebSocket(websocketEndpoint);

        ws.onopen = () => {
          console.log('WebSocket connected');
        };

        ws.onmessage = (event) => {
          // console.log('Message received:', event.data);
          // Handle incoming messages from the WebSocket server
          updateCachedData((draft) => {
            const data = JSON.parse(event.data);
            draft.name = data.name;
            draft.main = {
              ...data.main,
              temp: converter
                .convert(
                  data.main.temp,
                  TemperatureUnits.kelvin,
                  TemperatureUnits.fahrenheit
                )
                .toFixed(0),
              feels_like: converter
                .convert(
                  data.main.feels_like,
                  TemperatureUnits.kelvin,
                  TemperatureUnits.fahrenheit
                )
                .toFixed(0),
              temp_min: converter
                .convert(
                  data.main.temp_min,
                  TemperatureUnits.kelvin,
                  TemperatureUnits.fahrenheit
                )
                .toFixed(0),
              temp_max: converter
                .convert(
                  data.main.temp_max,
                  TemperatureUnits.kelvin,
                  TemperatureUnits.fahrenheit
                )
                .toFixed(0),
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

export const { useGetCurrentWeatherQuery } = weatherApiSlice;

export default weatherApiSlice;

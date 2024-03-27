import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import SockJS from 'sockjs-client';
import { Client, type Message } from '@stomp/stompjs';

const weatherApiSlice = createApi({
  tagTypes: ['Weather'],
  reducerPath: 'weatherApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getCurrentWeather: builder.query<{ message: {} }, {}>({
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
            draft.message = JSON.parse(event.data);
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

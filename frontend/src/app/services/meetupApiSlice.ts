import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { MeetupResponse } from '../../shared/types';

const meetupApiSlice = createApi({
  tagTypes: ['Meetup'],
  reducerPath: 'meetupApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getCurrentMeetups: builder.query<
      MeetupResponse,
      {
        lat: number | undefined;
        lon: number | undefined;
        query: string;
        endDateRange: string;
        radius: number;
        sortOrder: string;
        sortBy: string;
      }
    >({
      query: (options) => ({
        url: `/meetups?lat=${options.lat}&lon=${options.lon}&query=${options.query}&endDateRange=${options.endDateRange}&radius=${options.radius}&keywordSortField=${options.sortBy}&sortOrder=${options.sortOrder}`,
      }),
    }),
  }),
});

export const { useGetCurrentMeetupsQuery } = meetupApiSlice;

export default meetupApiSlice;

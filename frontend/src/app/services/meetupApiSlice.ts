import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface MeetupResponse {
  count: number;
  edges: {
    cursor: string;
    node: {
      id: string;
      result: {
        title: string;
        imageUrl: string;
        eventUrl: string;
        image: { baseUrl: string };
        going: boolean;
        howToFindUs: string;
        description: string;
      };
    };
  }[];
}
const meetupApiSlice = createApi({
  tagTypes: ['Meetup'],
  reducerPath: 'meetupApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getCurrentMeetups: builder.query<
      MeetupResponse,
      { lat: number | undefined; lon: number | undefined; query: string }
    >({
      query: (options) => ({
        url: `/meetups?lat=${options.lat}&lon=${options.lon}&query=${options.query}`,
      }),
    }),
  }),
});

export const { useGetCurrentMeetupsQuery } = meetupApiSlice;

export default meetupApiSlice;

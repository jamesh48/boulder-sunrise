import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Venue {
  name: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
}
export interface LocalEvent {
  title: string;
  imageUrl: string;
  eventUrl: string;
  image: { baseUrl: string };
  going: boolean;
  howToFindUs: string;
  description: string;
  shortDescription: string;
  dateTime: string;
  endTime: string;
  topics: {
    count: number;
    edges: { cursor: string; node: { name: string } }[];
  };
  venue?: Venue;
}

interface MeetupResponse {
  count: number;
  edges?: {
    cursor: string;
    node: {
      id: string;
      result: LocalEvent;
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
      {
        lat: number | undefined;
        lon: number | undefined;
        query: string;
        endDateRange: string;
        radius: number;
      }
    >({
      query: (options) => ({
        url: `/meetups?lat=${options.lat}&lon=${options.lon}&query=${options.query}&endDateRange=${options.endDateRange}&radius=${options.radius}`,
      }),
    }),
  }),
});

export const { useGetCurrentMeetupsQuery } = meetupApiSlice;

export default meetupApiSlice;

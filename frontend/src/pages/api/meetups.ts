import { LocalEvent } from '@/app/services/meetupApiSlice';
import { NextApiRequest, NextApiResponse } from 'next';

interface MeetupResponse {
  edges: {
    node: {
      id: string;
      result: LocalEvent;
    };
  }[];
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query,
    lat,
    lon,
    endDateRange,
    radius,
    sortBy: keywordSortField,
    sortOrder,
  } = req.query;

  const params = {
    query,
    lat,
    lon,
    endDateRange,
    radius,
    keywordSortField,
  } as { [key: string]: string };

  const queryString = Object.keys(params)
    .map(
      (key) => encodeURIComponent(key) + '=' + encodeURIComponent(params[key])
    )
    .join('&');

  const baseUrl =
    process.env.NODE_ENV === 'production'
      ? 'https://data.bertramcappuccino.com/meetups'
      : 'http://localhost:8080/meetups';

  const endpoint = baseUrl + '?' + queryString;

  const response = await fetch(endpoint);
  const data: MeetupResponse = await response.json();

  if (sortOrder === 'DESC') {
    data.edges.sort((a, b) => {
      const dateA = new Date(a.node.result.dateTime).getTime();
      const dateB = new Date(b.node.result.dateTime).getTime();
      return dateB - dateA;
    });
  }
  return res.send(data);
};

export default handler;

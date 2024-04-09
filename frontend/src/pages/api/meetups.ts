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
  const endpoint = (() => {
    if (process.env.NODE_ENV === 'production') {
      return `https://data.bertramcappuccino.com/meetups?query=${query}&lat=${lat}&lon=${lon}&endDateRange=${endDateRange}&radius=${radius}&keywordSortField=${keywordSortField}`;
    }
    return `http://localhost:8080/meetups?query=${query}&lat=${lat}&lon=${lon}&endDateRange=${endDateRange}&radius=${radius}&keywordSortField=${keywordSortField}`;
  })();

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

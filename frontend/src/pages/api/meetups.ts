import { NextApiRequest, NextApiResponse } from 'next';
import { MeetupResponse } from '../../shared/types';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { sortOrder, ...params } = req.query as { [key: string]: string };
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
    data.edges?.sort((a, b) => {
      const dateA = new Date(a.node.result.dateTime).getTime();
      const dateB = new Date(b.node.result.dateTime).getTime();
      return dateB - dateA;
    });
  }
  return res.send(data);
};

export default handler;

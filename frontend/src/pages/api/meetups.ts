import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query, lat, lon } = req.query;
  const endpoint = (() => {
    if (process.env.NODE_ENV === 'production') {
      return `https://data.bertramcappuccino.com/meetups?query=${query}&lat=${lat}&lon=${lon}`;
    }
    return `http://localhost:8080/meetups?query=party&lat=${lat}&lon=${lon}`;
  })();

  const response = await fetch(endpoint);
  const data = await response.json();

  return res.send(data);
};

export default handler;

import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query, lat, lon, endDateRange, radius } = req.query;
  const endpoint = (() => {
    if (process.env.NODE_ENV === 'production') {
      return `https://data.bertramcappuccino.com/meetups?query=${query}&lat=${lat}&lon=${lon}&endDateRange=${endDateRange}&radius=${radius}`;
    }
    return `http://localhost:8080/meetups?query=${query}&lat=${lat}&lon=${lon}&endDateRange=${endDateRange}&radius=${radius}`;
  })();

  const response = await fetch(endpoint);
  const data = await response.json();

  return res.send(data);
};

export default handler;

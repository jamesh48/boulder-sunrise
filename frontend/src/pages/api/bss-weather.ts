import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const endpoint = (() => {
    if (process.env.NODE_ENV === 'production') {
      return `https://data.bertramcappuccino.com/bss-weather?location=${req.query.location}`;
    }
    return 'http://localhost:8080/bss-weather?location=' + req.query.location;
  })();

  const response = await fetch(endpoint);
  const data = await response.json();
  data.main = {
    ...data.main,
    temp: data.main.temp.toFixed(0),
    feels_like: data.main.feels_like.toFixed(0),
    temp_min: data.main.temp_min.toFixed(0),
    temp_max: data.main.temp_max.toFixed(0),
  };
  return res.send(data);
};

export default handler;

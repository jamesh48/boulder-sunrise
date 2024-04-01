import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
  const response = await fetch(
    // 'https://data.bertramcappuccino.com/bss-weather?location=Boulder,CO,USA'
    'http://localhost:8080/bss-weather?location=Boulder,CO,USA'
  );
  const data = await response.json();
  return res.send(data);
};

export default handler;

import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
  const response = await fetch('http://localhost:8080/bss-weather');
  const data = await response.json();
  return res.send(data);
};

export default handler;

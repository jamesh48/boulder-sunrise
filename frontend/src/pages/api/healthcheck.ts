import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
  return res.send({ message: 'Healthy!' });
};

export default handler;

import { NextApiRequest, NextApiResponse } from 'next';

const { MEETUP_CLIENT_KEY } = process.env;
// update with production url
const CLIENT_RDR_URL = 'http://localhost:8080/api/oauthrdr';

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
  if (!MEETUP_CLIENT_KEY) {
    throw new Error('MEETUP_CLIENT_KEY env is undefined!');
  }
  return res.redirect(
    `https://secure.meetup.com/oauth2/authorize?client_id=${MEETUP_CLIENT_KEY}&response_type=code&redirect_uri=${CLIENT_RDR_URL}`
  );
};

export default handler;

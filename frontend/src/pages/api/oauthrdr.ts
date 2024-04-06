import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';
const { MEETUP_CLIENT_KEY, MEETUP_CLIENT_SECRET } = process.env;

const MEETUP_CLIENT_RDR_URL = 'www.bertramcappuccino.com/api/oauthrdr';

async function requestAccessToken(
  clientId: string,
  clientSecret: string,
  redirectUri: string,
  code: string
) {
  const url = 'https://secure.meetup.com/oauth2/access';
  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'authorization_code',
    redirect_uri: redirectUri,
    code: code,
  });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body,
    });

    if (!response.ok) {
      console.log(response.body);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const json = await response.json();
    return json;
  } catch (error) {
    console.error('Error fetching access token:', error);
    throw error;
  }
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const code = req.query.code as string;
  if (!MEETUP_CLIENT_KEY) {
    return res.status(500).send({ error: 'MEETUP_CLIENT_KEY is undefined' });
  }

  if (!MEETUP_CLIENT_SECRET) {
    return res.status(500).send({ error: 'MEETUP_CLIENT_SECRET is undefined' });
  }
  const accessToken = await requestAccessToken(
    MEETUP_CLIENT_KEY,
    MEETUP_CLIENT_SECRET,
    code,
    MEETUP_CLIENT_RDR_URL
  );
  console.log(accessToken);
  return res.send({ message: 'OK' });
};

export default handler;

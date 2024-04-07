import { NextApiRequest, NextApiResponse } from 'next';

const apiKey = process.env.GOOGLEMAPS_APIKEY;

const getLatLngFromCity = async (cityName: string) => {
  const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    cityName
  )}&key=${apiKey}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      return {
        lat: location.lat,
        lng: location.lng,
      };
    } else {
      throw new Error('No results found');
    }
  } catch (error) {
    console.error('Error getting latitude and longitude:', error);
    return null;
  }
};

const getTimeZoneFromLatLng = async (lat: string, lng: string) => {
  const apiUrl = `https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${lng}&timestamp=${
    Date.now() / 1000
  }&key=${apiKey}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    if (data.status === 'OK') {
      return data.timeZoneId;
    } else {
      throw new Error(data.status);
    }
  } catch (error) {
    console.error('Error getting time zone:', error);
    return null;
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const userLocation = req.query.city as string;
  const coords = await getLatLngFromCity(userLocation);
  if (coords) {
    const timezone = await getTimeZoneFromLatLng(coords.lat, coords.lng);

    console.log(`Time zone for ${userLocation}: ${timezone}`);

    res.setHeader(
      'Set-Cookie',
      `userLocation=${encodeURIComponent(userLocation)}; Max-Age=604800; Path=/`
    );

    return res.send({ timezone, ...coords });
  }

  return res.send({ error: 'not found' });
};

export default handler;

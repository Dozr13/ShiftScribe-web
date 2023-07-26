import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  try {
    const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY;
    return res.status(200).json({ publishableKey });
  } catch (error) {
    return res.status(500).json((error as Error).message);
  }
}

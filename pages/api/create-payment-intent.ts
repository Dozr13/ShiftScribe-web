import Cors from 'cors';
import { NextApiRequest, NextApiResponse } from 'next';
import { Stripe } from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY as string;

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2022-11-15',
});

const cors = Cors({
  origin: 'exp://192.168.0.226:19000',
  methods: ['POST'],
});

async function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: Function,
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  console.log('req.method', req.method);
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  await runMiddleware(req, res, cors);

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 2500,
      currency: 'usd',
      payment_method_types: ['card'],
    });

    const clientSecret = paymentIntent.client_secret;

    return res.status(200).json({ clientSecret });
  } catch (error) {
    return res.status(500).json((error as Error).message);
  }
}

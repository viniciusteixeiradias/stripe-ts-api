import { Router, Request, Response } from "express";
import { StripeDao } from "../daos/stripe";

const router = Router()

interface PaymentIntent {
  amount: number;
  description: string;
  statement_descriptor: string;
}

router.get('/connectionToken', async (_, res: Response) => {
  const stripeDao = new StripeDao();
  const token = await stripeDao.getToken();

  res.json(token);
});

router.post('/createPaymentIntent', async (req: Request<{}, {}, PaymentIntent>, res: Response) => {
  const paymentIntent = req.body;
  const stripeDao = new StripeDao();
  const response = await stripeDao.createPaymentIntent(paymentIntent);

  res.json(response);
});

router.post('/capturePaymentIntent', async (req: Request<{}, {}, { paymentId: string }>, res: Response) => {
  const { paymentId } = req.body;
  const stripeDao = new StripeDao();
  await stripeDao.capturePaymentIntent(paymentId);

  res.send("Success");
});

export default router;
import { Router, Request, Response } from "express";
import { StripeDao } from "../daos/stripe";
import { checkJwt } from "../middleware/token";

const router = Router()

interface PaymentIntent {
  amount: number;
  description: string;
  statement_descriptor: string;
}

/* Endpoint for TEST Auth */
router.get('/auth', checkJwt, async (_, res: Response) => {
  res.json({ message: "You are authenticated!" });
});

router.get('/connectionToken', async (_, res: Response) => {
  const stripeDao = new StripeDao();
  const token = await stripeDao.getToken();

  res.json(token);
});

router.post('/createPaymentIntent', checkJwt, async (req: Request<{}, {}, PaymentIntent>, res: Response) => {
  const paymentIntent = req.body;
  const stripeDao = new StripeDao();
  const response = await stripeDao.createPaymentIntent(paymentIntent);

  res.json(response);
});

router.post('/capturePaymentIntent', checkJwt, async (req: Request<{}, {}, { paymentId: string }>, res: Response) => {
  const { paymentId } = req.body;
  const stripeDao = new StripeDao();
  await stripeDao.capturePaymentIntent(paymentId);

  res.send("Success");
});

export default router;

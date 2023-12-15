import Stripe from "stripe";

interface PaymentIntent {
  amount: number;
  description: string;
  statement_descriptor: string;
}

interface PaymentIntentResponse {
  id: string;
  clientSecret: string;
}

const STRIPE_STATUS = ["requires_confirmation", "requires_payment_method"];

class StripeDao extends Stripe {
  constructor() {
    super(process.env.STRIPE_SECRET_KEY || "", {
      apiVersion: "2023-10-16",
      typescript: true
    });
  }

  private removeSpecialChars(str: string): string {
    return str.replace(/[^a-zA-Z]/g, "");
  }

  async capturePaymentIntent(paymentId: string) {
    await this.paymentIntents.capture(paymentId);
  }

  async createPaymentIntent({
    amount,
    description,
    statement_descriptor
  }: PaymentIntent): Promise<PaymentIntentResponse> {
    const amountInCents = Math.trunc(amount * 100);

    const intent = await this.paymentIntents.create({
      amount: amountInCents,
      currency: "eur",
      description,
      payment_method_types: ["card_present"],
      capture_method: "manual",
      statement_descriptor:
        this.removeSpecialChars(statement_descriptor) || "Foodinn"
    });

    if (!STRIPE_STATUS.includes(intent.status)) {
      throw Error(`Invalid PaymentIntent status: ${intent.status}`);
    }

    return {
      id: intent.id,
      clientSecret: intent.client_secret!
    };
  }

  async getToken(): Promise<string> {
    const response = await this.terminal.connectionTokens.create();
    return response.secret;
  }
}

export { StripeDao };

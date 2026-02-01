/**
 * This is the backend to create a SetupIntent
 * https://docs.stripe.com/payments/save-and-reuse#web-create-setup-intent
 * https://docs.stripe.com/api/setup_intents?lang=node
 * https://www.w3tutorials.net/blog/how-can-i-fetch-the-client-secret-in-stripe-reactjs-and-why-can-t-i-render-a-payment-form-without-it/
 *
 */
import express from "express";
// http://stackoverflow.com/questions/78148005/ddg#78148045
import Stripe from "stripe";

/**
 * express.Router is a way to organize related routes together. This will allow us to apply
 * middleware for different parts of our app.

 * https://www.geeksforgeeks.org/web-tech/express-js-express-router-function/
 */
const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// https://docs.stripe.com/payments/save-and-reuse#web-create-setup-intent
router.post("/create-setup-intent", async (req, res) => {
  try {
    // Create a customer when the user sign up
    const { customerId } = req.body;
    if (!customerId) {
      return res.status(400).json({ error: "Missing customerId" });
    }
    const setupIntent = await stripe.setupIntents.create({
      customer: customerId,
      payment_method_types: ["card"],
    });
    // Send the client_secret back to the client
    res.json({
      clientSecret: setupIntent.client_secret,
      setupIntentId: setupIntent.id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

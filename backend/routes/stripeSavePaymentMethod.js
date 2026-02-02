/**
 * This is the backend to save a Stripe payment method
 * https://docs.stripe.com/payments/save-and-reuse
 *https://docs.stripe.com/api/payment_methods/retrieve
 https://docs.stripe.com/payments/save-and-reuse#web-create-setup-intent
 *
 */
import express from "express";
// http://stackoverflow.com/questions/78148005/ddg#78148045
import Stripe from "stripe";
import { supabase } from "../supabaseClientBackend.js";

/**
 * express.Router is a way to organize related routes together. This will allow us to apply
 * middleware for different parts of our app.

 * https://www.geeksforgeeks.org/web-tech/express-js-express-router-function/
 */
const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/save-payment-method", async (req, res) => {
  try {
    // https://docs.stripe.com/api/payment_methods/retrieve

    // Fetch the userId and payment method id
    const { userId, paymentMethodId } = req.body;
    if (!userId || !paymentMethodId) {
      return res
        .status(400)
        .json({ error: "Missing userId or paymentMethodId" });
    }

    // Retrieve full card details from Stripe
    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);

    const card = paymentMethod.card;

    if (!card) {
      return res.status(400).json({ error: "Payment method is not a card" });
    }

    /**
     *  Clear previous default payment methods for this user
     */

    await supabase.from("user_payment_methods").delete().eq("user_id", userId);

    /**
     * Creating/inserting the payment method in supabase
     */
    const { data: insertedPaymentMethods, error: insertError } = await supabase
      .from("user_payment_methods")
      .insert([
        {
          user_id: userId,
          payment_method_id: paymentMethodId,
          brand: card.brand,
          last4: card.last4,
          exp_month: card.exp_month,
          exp_year: card.exp_year,
          is_default: true,
        },
      ])
      .select(); // We need supabase to return the car payment details to avoid backend errors

    if (insertError || !insertedPaymentMethods?.length) {
      return res.status(500).json({
        error: insertError?.message || "Payment method insertion failed",
      });
    }

    // Send the client_secret back to the client
    res.json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

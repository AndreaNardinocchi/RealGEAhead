/**
 * We created this util to be used in the adminCreateUsers route so that a
 * stripe_customer_id is created
 */

import Stripe from "stripe";
import { supabase } from "../supabaseClientBackend.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function createStripeCustomer(email, userId) {
  // Create Stripe customer
  const customer = await stripe.customers.create({ email });

  // Save Stripe customer ID to Supabase
  await supabase
    .from("profiles")
    .update({ stripe_customer_id: customer.id })
    .eq("id", userId);

  return customer.id;
}

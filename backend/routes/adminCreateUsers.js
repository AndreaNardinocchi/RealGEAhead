import express from "express";
import { supabase } from "../supabaseClientBackend.js";
import { createStripeCustomer } from "../utils/createStripeCustomerUtil.js";

/**
 * express.Router is a way to organize related routes together. This will allow us to apply
 * middleware for different parts of our app.
 *
 * https://www.geeksforgeeks.org/web-tech/express-js-express-router-function/
 */
const router = express.Router();

// ADMIN Create user
router.post("/admin/create-user", async (req, res) => {
  const { first_name, last_name, email, role, country, zip_code } = req.body;

  if (!first_name || !last_name || !email || !role || !country || !zip_code) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    // Generate a temporary password for the new user
    const password = Math.random().toString(36).slice(-10);

    /**
     * Create Supabase Auth user (admin-level)
     * This creates the authentication identity for the user.
     * https://supabase.com/docs/reference/javascript/auth-admin-createuser
     * */
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        role,
        first_name,
        last_name,
        country,
        zip_code,
      },
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const authUser = data.user;
    /**
     * Create Stripe Customer
     * This returns a Stripe customer is which we store in the profile.
     * */
    const stripeCustomerId = await createStripeCustomer(
      authUser.email,
      authUser.id,
    );

    /**
     * Upsert into 'profiles' table
     * Ensures the profile row exists and stays synced with Auth + Stripe.
     * https://supabase.com/docs/reference/javascript/upsert
     */
    const { error: profileError } = await supabase.from("profiles").upsert({
      id: authUser.id,
      email: authUser.email,
      role: role || "user",
      first_name,
      last_name,
      country,
      zip_code,
      stripe_customer_id: stripeCustomerId,
      created_at: new Date().toISOString(),
    });

    if (profileError) {
      return res.status(500).json({ error: profileError.message });
    }

    // Success returns the user and temporary password
    return res.status(201).json({
      success: true,
      user: data.user,
      tempPassword: password,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;

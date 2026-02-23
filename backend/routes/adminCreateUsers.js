import express from "express";
import { supabase } from "../supabaseClientBackend.js";
import { createStripeCustomer } from "../utils/createStripeCustomerUtil.js";
import { getPublicUrl } from "../utils/getPublicUrl.js";
import { userCreatedTemplate } from "../utils/emailTemplates.js";

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

  // Fetch all users from Supabase Auth
  // https://supabase.com/docs/reference/javascript/auth-admin-listusers
  const { data: list, error: authError } =
    await supabase.auth.admin.listUsers();

  // If Supabase Auth fails, return an error

  if (authError) {
    return res
      .status(500)
      .json({ error: "Failed to fetch users from Supabase Auth" });
  }

  // Find the user in the Auth list by matching email
  const user = list.users.find((u) => u.email === email);

  // If no user with this email exists in Auth, return an error
  // If a user with this email already exists, return a conflict error
  if (user) {
    return res
      .status(409)
      .json({ error: "User with this email already exists" });
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
     * Ensures the user column stripe_customer_id does have a value
     * https://supabase.com/docs/reference/javascript/upsert
     */
    const { error: profileError } = await supabase.from("profiles").upsert({
      id: authUser.id,
      email: authUser.email,
      stripe_customer_id: stripeCustomerId,
      role: role,
    });

    if (profileError) {
      return res.status(500).json({ error: profileError.message });
    }

    // This Supabase function will generate a link to generate a tokenized link
    // baked into the 'Welcometo GuestEase' email that will be sent off.
    // Basically, it is a CTA link which will land the user on the
    // '/update-password/' page
    const { data: reset } = await supabase.auth.admin.generateLink({
      type: "recovery",
      email,
      options: {
        redirectTo: "https://real-ge-ahead-kq85.vercel.app/update-password",
      },
    });

    // Fetching the tokenizedLink
    const tokenizedLink = reset.properties.action_link;

    // Fetching the GuestEase logo from the Supabase storage
    const logoUrl = getPublicUrl("assets", "GuestEaseLogo.png");

    // Generate the full HTML for the booking confirmation email using the template
    // and pass the below values
    const html = userCreatedTemplate({
      authUser,
      logoUrl,
      tokenizedLink,
    });

    // Send confirmation email to the user that their account has been created
    await fetch("https://realgeahead-1.onrender.com/send_email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: authUser.email,
        subject: `Welcome to GuestEase ${authUser.user_metadata.first_name} 🎉`,
        body: html,
      }),
    });

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

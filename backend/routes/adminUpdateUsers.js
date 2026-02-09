import express from "express";
import { supabase } from "../supabaseClientBackend.js";

/**
 * express.Router is a way to organize related routes together. This will allow us to apply
 * middleware for different parts of our app.
 *
 * https://www.geeksforgeeks.org/web-tech/express-js-express-router-function/
 */
const router = express.Router();

// ADMIN Update user
router.post("/admin/update-user", async (req, res) => {
  try {
    // Extract all fields sent from the frontend
    const updates = req.body;
    // We use email as the unique identifier for updating users
    const email = updates.email;

    // If no email is provided, we cannot identify the user
    if (!email) {
      return res.status(400).json({ error: "Missing email" });
    }

    // Fetch all users from Supabase Auth
    // https://supabase.com/docs/reference/javascript/auth-admin-listusers
    const { data: list, error: authError } =
      await supabase.auth.admin.listUsers();

    // If Supabase Auth fails, return an error
    if (authError) {
      return res.status(404).json({ error: "Auth user not found" });
    }

    // Find the user in the Auth list by matching email
    const user = list.users.find((u) => u.email === email);

    // If no user with this email exists in Auth, return an error
    if (!user) {
      return res.status(404).json({ error: "Auth user not found" });
    }

    // Extract the Supabase Auth user ID
    const authUserId = user.id;

    // Update the user's metadata in Supabase Auth
    // https://supabase.com/docs/reference/javascript/auth-admin-updateuserbyid
    const { error: authUpdateError } = await supabase.auth.admin.updateUserById(
      authUserId,
      {
        user_metadata: {
          first_name: updates.first_name,
          last_name: updates.last_name,
          role: updates.role,
          country: updates.country,
          zip_code: updates.zip_code,
        },
      },
    );

    // If updating Auth metadata fails, return the error
    if (authUpdateError) {
      return res.status(400).json({ error: authUpdateError.message });
    }

    // Update role in the public.profiles table
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ role: updates.role })
      .eq("email", updates.email);

    if (profileError) {
      return res.status(400).json({ error: profileError.message });
    }

    // Everything succeeded — return the updated user
    return res.json({
      message: "User updated successfully",
      // data,
    });
  } catch (err) {
    // Catch any unexpected errors
    return res.status(500).json({ error: err.message });
  }
});

export default router;

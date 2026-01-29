import express from "express";
import { supabase } from "../supabaseClientBackend.js"; // your service-role client

const router = express.Router();

router.post("/user/delete-account", async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "Missing userId" });
  }

  try {
    // Delete profile row
    // This will fail automatically if bookings still exist (ON DELETE RESTRICT)
    const { error: profileError } = await supabase
      .from("profiles")
      .delete()
      .eq("id", userId);

    if (profileError) {
      return res.status(400).json({ error: profileError.message });
    }

    // 'This fucntion should only be called on a server. Never expose your
    // service_role key in the browser.' deleteUser()
    // https://supabase.com/docs/reference/javascript/auth-admin-deleteuser
    const { error: authError } = await supabase.auth.admin.deleteUser(userId);

    if (authError) {
      return res.status(400).json({ error: authError.message });
    }

    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: "Unexpected server error" });
  }
});

export default router;

/**
 * Router managing the booking cancellations from the user side
 */
import express from "express";
import { supabase } from "../supabaseClientBackend.js";

/**
 * express.Router is a way to organize related routes together. This will allow us to apply
 * middleware for different parts of our app.
 *
 * https://www.geeksforgeeks.org/web-tech/express-js-express-router-function/
 */
const router = express.Router();

// --------------------
// USER cancel Booking
// --------------------
router.post("/user/cancel-booking", async (req, res) => {
  const { bookingId } = req.body;

  if (!bookingId) {
    return res.status(400).json({ error: "Missing bookingId" });
  }

  try {
    // Cancel booking https://supabase.com/docs/reference/javascript/delete
    const { error: bookingError } = await supabase
      .from("bookings")
      .delete()
      .eq("id", bookingId);

    if (bookingError) {
      return res.status(400).json({ error: bookingError.message });
    }

    res.json({
      status: "success",
      message: `Booking ${bookingId} cancelled successfully!`,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Unexpected server error", details: err.message });
  }
});

export default router;

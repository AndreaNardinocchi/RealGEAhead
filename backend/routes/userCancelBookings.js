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

  /**
   * We fetch the booking from Supabase
   */
  const { data: booking, error: returnError } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", bookingId)
    .single();

  if (returnError || !booking) {
    // https://geeksforgeeks.org/blogs/error-404-not-found/
    return res.status(404).json({
      error: "Booking not found!",
    });
  }

  /**
   * We add the same logic applied in the bookedRoomCard for security purposes
   */
  const now = new Date();
  const checkIn = new Date(booking.check_in);
  const cutoff = new Date(checkIn.getTime() - 24 * 60 * 60 * 1000);

  /**
   * We are preventing the user from being able to cancel a reservation
   * after the 24h before check-in cutoff period.
   */
  if (now >= cutoff) {
    return res.status(400).json({
      error: "This reservation can no longer be cancelled.",
    });
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

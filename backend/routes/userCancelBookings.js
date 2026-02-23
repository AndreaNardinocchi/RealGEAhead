/**
 * Router managing the booking cancellations from the user side
 */
import express from "express";
import { supabase } from "../supabaseClientBackend.js";
import { getPublicUrl } from "../utils/getPublicUrl.js";
import { bookingCancelledTemplate } from "../utils/emailTemplates.js";
import { calculateStay } from "../utils/calculateTotalPriceUtil.js";

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
    .select("*, profiles!bookings_user_id_fkey(*)")
    .eq("id", bookingId)
    .single();

  if (returnError || !booking) {
    // https://geeksforgeeks.org/blogs/error-404-not-found/
    return res.status(404).json({
      error: "Booking not found!",
    });
  }

  // We also fetch the room details needed to fill the email with needed data
  const { data: room, error: roomErr } = await supabase
    .from("rooms")
    .select("*")
    .eq("id", booking.room_id)
    .single();

  if (roomErr || !room) {
    return res.status(400).json({ error: "Room not found" });
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

    /**
     * Calculating the total_price of the booking using calculateTotalPriceUtil.js,
     * but also destructuring to extrapolate the total nights to use in the email to send off to the user
     */
    const { total_price: total_price, nights: total_nights } = calculateStay(
      booking.check_in,
      booking.check_out,
      room.price,
    );

    const profile = booking.profiles;

    // Fetching the GuestEase logo from Supabase storage
    const logoUrl = getPublicUrl("assets", "GuestEaseLogo.png");

    // Generate email HTML and passing through all needed parameters
    const html = bookingCancelledTemplate({
      profile,
      room,
      check_in: booking.check_in,
      check_out: booking.check_out,
      logoUrl,
      booking_id: bookingId,
      total_nights,
      total_price,
    });

    // Send email vua emailUtil.js
    await fetch("https://realgeahead-1.onrender.com/send_email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: profile.email,
        subject: `Your Booking for ${room.name} at GuestEase has been cancelled 😔`,
        body: html,
      }),
    });

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

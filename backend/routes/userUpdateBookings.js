/**
 * Router managing the booking updates from the user side
 */
import express from "express";
import { supabase } from "../supabaseClientBackend.js";
import { calculateStay } from "../utils/calculateTotalPriceUtil.js";
import { getPublicUrl } from "../utils/getPublicUrl.js";
import { bookingUpdatedTemplate } from "../utils/emailTemplates.js";

/**
 * express.Router is a way to organize related routes together. This will allow us to apply
 * middleware for different parts of our app.
 *
 * https://www.geeksforgeeks.org/web-tech/express-js-express-router-function/
 */
const router = express.Router();

// USER Update Booking
router.post("/user/update-booking", async (req, res) => {
  const { bookingId, updates, userId } = req.body;

  if (!bookingId || !updates || !userId) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    /**
     * Fetching room based on the id and select the price
     * https://supabase.com/docs/reference/javascript/select
     * https://supabase.com/docs/reference/javascript/using-filters
     * */
    const { data: room, error: roomErr } = await supabase
      .from("rooms")
      .select("*")
      .eq("id", updates.room_id)
      .single();

    if (roomErr || !room) {
      return res.status(400).json({ error: "Room not found" });
    }

    /**
     * Calculating the new total_price of the booking using calculateTotalPriceUtil.js,
     * but also destructuring to extrapolate the total nights to use in the email to send off to the user
     */
    const { total_price: newTotal, nights: total_nights } = calculateStay(
      updates.check_in,
      updates.check_out,
      room.price,
    );

    /**
     * Updating the booking and
     * https://supabase.com/docs/reference/javascript/update
     */
    const { data: updatedBooking, error: updateErr } = await supabase
      .from("bookings")
      .update({
        ...updates,
        total_price: newTotal,
      })
      .eq("id", bookingId)
      .eq("user_id", userId)
      // We are selecting the booking but also join the related profile row that belongs to this booking
      .select("*, profiles!bookings_user_id_fkey(*)")
      .single();

    if (updateErr) {
      return res.status(400).json({ error: updateErr.message });
    }

    // Extrapolating the profile, and number of guests from the updatedBooking
    const { guests, profile } = updatedBooking;

    // Fetching the GuestEase logo from Supabase storage
    const logoUrl = getPublicUrl("assets", "GuestEaseLogo.png");

    // Generate email HTML and passing through all needed parameters
    const html = bookingUpdatedTemplate({
      profile,
      room,
      check_in: updates.check_in,
      check_out: updates.check_out,
      total_price: newTotal,
      logoUrl,
      guests,
      booking_id: bookingId,
      total_nights,
    });

    // Send email vua emailUtil.js
    await fetch("http://localhost:3000/send_email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: profile.email,
        subject: `Your Booking Update for ${room.name} at GuestEase`,
        body: html,
      }),
    });

    return res.json({ success: true, booking: updatedBooking, newTotal });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;

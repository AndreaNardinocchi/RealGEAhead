/**
 * Router managing the booking creation from the user side
 */
import express from "express";
import { supabase } from "../supabaseClientBackend.js";
import { calculateStay } from "../utils/calculateTotalPriceUtil.js";
import { getPublicUrl } from "../utils/getPublicUrl.js";
import { bookingCreatedTemplate } from "../utils/emailTemplates.js";

/**
 * express.Router is a way to organize related routes together. This will allow us to apply
 * middleware for different parts of our app.
 *
 * https://www.geeksforgeeks.org/web-tech/express-js-express-router-function/
 */
const router = express.Router();

// USER Create Booking
router.post("/user/create_booking", async (req, res) => {
  // Destructuring the body into parameters sent off from user-booking-api.ts (frontend)
  const { room_id, check_in, check_out, guests, userId } = req.body;

  if (!room_id || !check_in || !check_out || !guests || !userId) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    /**
     * Fetching room price and name from supabase
     * https://supabase.com/docs/reference/javascript/select
     * https://supabase.com/docs/reference/javascript/using-filters
     * */
    const { data: room, error: roomError } = await supabase
      .from("rooms")
      .select("price, name")
      .eq("id", room_id)
      .single();

    if (roomError || !room) {
      return res.status(400).json({ error: "Room not found" });
    }

    /**
     * Calculating the total_price of the booking using calculateTotalPticeUtil.js
     */
    let total_price;
    let total_nights;
    try {
      const result = calculateStay(check_in, check_out, room.price);
      total_price = result.total_price;
      total_nights = result.nights;
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }

    // Fetching user profile email and first name from supabase
    // We will use these data later when we will send email notifications
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("email, first_name")
      .eq("id", userId)
      .single();
    if (profileError || !profile) {
      return res.status(400).json({ error: "User profile not found" });
    }
    /**
     * Creating/inserting the booking in supabase
     */
    const { data: insertedBookings, error: insertError } = await supabase
      .from("bookings")
      .insert([
        { room_id, user_id: userId, check_in, check_out, guests, total_price },
      ])
      .select();
    if (insertError || !insertedBookings?.length) {
      return res
        .status(500)
        .json({ error: insertError?.message || "Booking insertion failed" });
    }

    // Extrapolating the booking id to be used in the confirmation email
    const booking_id = insertedBookings[0].id;

    // Fetching the GuestEase logo from the Supabase storage
    const logoUrl = getPublicUrl("assets", "GuestEaseLogo.png");

    // Generate the full HTML for the booking confirmation email using the template
    // and pass the below values
    const html = bookingCreatedTemplate({
      profile,
      room,
      check_in,
      check_out,
      total_price,
      logoUrl,
      booking_id,
      total_nights,
    });

    // Send confirmation email to the user
    await fetch("https://realgeahead-1.onrender.com/send_email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: profile.email,
        subject: `Your Booking Confirmation for ${room.name} at GuestEase`,
        body: html,
      }),
    });

    // Response
    return res.json({ success: true, booking: insertedBookings[0] });
  } catch (err) {
    console.error("Create booking error:", err);
    return res.status(500).json({ error: err.message });
  }
});

export default router;

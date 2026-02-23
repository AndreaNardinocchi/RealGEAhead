import express from "express";
import { supabase } from "../supabaseClientBackend.js";
import { calculateStay } from "../utils/calculateTotalPriceUtil.js";
import { getPublicUrl } from "../utils/getPublicUrl.js";
import { bookingCreatedByAdminTemplate } from "../utils/emailTemplates.js";

/**
 * express.Router is a way to organize related routes together. This will allow us to apply
 * middleware for different parts of our app.
 *
 * https://www.geeksforgeeks.org/web-tech/express-js-express-router-function/
 */
const router = express.Router();

// ADMIN Create Booking
router.post("/admin/create-booking", async (req, res) => {
  const { room_id, user_email, check_in, check_out, guests } = req.body;

  if (!room_id || !user_email || !check_in || !check_out || !guests) {
    return res.status(400).json({ error: "Missing fields" });
  }

  // Validation
  const checkInDate = new Date(check_in);
  const checkOutDate = new Date(check_out);
  if (checkOutDate <= checkInDate) {
    return res
      .status(400)
      .json({ error: "Check-out must be at least 1 day after check-in" });
  }

  try {
    // Fetching the user by email
    const { data: user, error: userError } = await supabase
      .from("profiles")
      .select("id, first_name, email")
      .eq("email", user_email)
      .single();

    if (userError || !user) {
      return res.status(400).json({ error: "User not found" });
    }

    /**
     * Fetch the room to get its price.
     * This ensures the admin cannot manipulate pricing manually.
     */
    const { data: room, error: roomError } = await supabase
      .from("rooms")
      .select("price, name, capacity")
      .eq("id", room_id)
      .single();

    if (roomError || !room) {
      return res.status(400).json({ error: "Room not found" });
    }

    // This ensures consistent pricing logic across the entire app.
    const { total_price, nights: total_nights } = calculateStay(
      check_in,
      check_out,
      room.price,
    );

    /**
     * Insert the booking into the database.
     * Supabase insert reference:
     * https://supabase.com/docs/reference/javascript/insert
     **/
    const { data: insertedBookings, error } = await supabase
      .from("bookings")
      .insert([
        { room_id, user_id: user.id, check_in, check_out, guests, total_price },
      ])
      .select();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const profile = user;
    // Extrapolating the booking id to be used in the confirmation email
    const booking_id = insertedBookings[0].id;
    // Fetching the GuestEase logo from Supabase storage
    const logoUrl = getPublicUrl("assets", "GuestEaseLogo.png");

    // Generate email HTML and passing through all needed parameters
    const html = bookingCreatedByAdminTemplate({
      profile,
      room,
      guests,
      check_in,
      check_out,
      total_price,
      logoUrl,
      booking_id,
      total_nights,
    });

    // Send email vua emailUtil.js
    await fetch("https://realgeahead-1.onrender.com/send_email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: profile.email,
        subject: `Your Booking for ${room.name} at GuestEase has been created by the Admin 😔`,
        body: html,
      }),
    });

    return res.json({ success: true, booking: insertedBookings[0] });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;

import express from "express";
import { supabase } from "../supabaseClientBackend.js";
import { calculateStay } from "../utils/calculateTotalPriceUtil.js";

/**
 * express.Router is a way to organize related routes together. This will allow us to apply
 * middleware for different parts of our app.
 *
 * https://www.geeksforgeeks.org/web-tech/express-js-express-router-function/
 */
const router = express.Router();

// ADMIN update Booking
router.post("/admin/update-booking", async (req, res) => {
  // Extract the fields sent from the frontend.
  // // These are the only values required to update a booking.
  const { booking_id, room_id, check_in, check_out, guests } = req.body;

  if (!booking_id || !room_id || !check_in || !check_out || !guests) {
    return res.status(400).json({ error: "Missing bookingId or updates" });
  }

  // Validation
  const checkInDate = new Date(check_in);
  const checkOutDate = new Date(check_out);
  console.log("CheckInOut: ", check_in, check_out);
  if (checkOutDate <= checkInDate) {
    return res
      .status(400)
      .json({ error: "Check-out must be at least 1 day after check-in" });
  }

  try {
    // Fetch the room price so we can recalculate the total stay cost.
    const { data: roomData, error: roomError } = await supabase
      .from("rooms")
      .select("price")
      .eq("id", room_id)
      .single();

    if (roomError || !roomData) {
      return res.status(400).json({ error: "Room not found" });
    }

    // Recalculate the total price using the shared pricing utility.
    // This ensures consistent pricing logic across the entire app.
    const { total_price } = calculateStay(check_in, check_out, roomData.price);

    // Update the booking in the database.
    // Also return the updated booking along with the user's email via the foreign key join.
    const { data, error } = await supabase
      .from("bookings")
      .update({ room_id, check_in, check_out, guests, total_price })
      .eq("id", booking_id)
      // PostgREST adds a special syntax for joins
      // https://postgrest.org/en/stable/references/api/resource_embedding.html#foreign-key-joins
      .select("*, profiles!bookings_user_id_fkey(email)");

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json({ message: "Booking updated successfully", data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;

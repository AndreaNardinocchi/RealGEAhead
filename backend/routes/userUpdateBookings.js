/**
 * Router managing the booking updates from the user side
 */
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
      .select("price")
      .eq("id", updates.room_id)
      .single();
    if (roomErr || !room) {
      return res.status(400).json({ error: "Room not found" });
    }

    /**
     * Calculating the new total_price of the booking using calculateTotalPriceUtil.js
     */
    let newTotal;
    try {
      const result = calculateStay(
        updates.check_in,
        updates.check_out,
        room.price,
      );
      newTotal = result.total_price;
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }

    /**
     * Updating the total_price
     * https://supabase.com/docs/reference/javascript/update
     */
    const { data: updated, error: updateErr } = await supabase
      .from("bookings")
      .update({
        ...updates,
        total_price: newTotal,
      })
      .eq("id", bookingId)
      .eq("user_id", userId)
      .select()
      .single();
    if (updateErr) {
      return res.status(400).json({ error: updateErr.message });
    }

    // Response
    return res.json({ success: true, booking: updated, newTotal });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;

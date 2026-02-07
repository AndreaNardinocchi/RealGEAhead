import express from "express";
import { supabase } from "../supabaseClientBackend.js";
/**
 * express.Router is a way to organize related routes together. This will allow us to apply
 * middleware for different parts of our app.
 *
 * https://www.geeksforgeeks.org/web-tech/express-js-express-router-function/
 */
const router = express.Router();

// ADMIN cancel Booking
router.post("/admin/cancel-booking", async (req, res) => {
  // Extract the field sent from the frontend.
  const { booking_id } = req.body;

  if (!booking_id) {
    return res.status(400).json({ error: "Missing bookingId or updates" });
  }

  try {
    // Delete the booking in the database.
    const { data, error } = await supabase
      .from("bookings")
      .delete()
      .eq("id", booking_id);

    if (error) {
      console.log("This is the data: ", data);
      return res.status(500).json({ error: error.message });
    }
    return res.json({ message: "Booking updated successfully", data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;

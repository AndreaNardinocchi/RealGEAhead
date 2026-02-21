import express from "express";
import { supabase } from "../supabaseClientBackend.js";
import Stripe from "stripe";
import { getPublicUrl } from "../utils/getPublicUrl.js";
import { adminCancelledBookingTemplate } from "../utils/emailTemplates.js";

/**
 * express.Router is a way to organize related routes together. This will allow us to apply
 * middleware for different parts of our app.
 * https://www.geeksforgeeks.org/web-tech/express-js-express-router-function/
 */
const router = express.Router();

// ADMIN cancel Booking (with refund if charged)
router.post("/admin/cancel-booking", async (req, res) => {
  const { booking_id } = req.body;

  if (!booking_id) {
    return res.status(400).json({ error: "Missing bookingId" });
  }

  try {
    // Fetch booking with payment info
    const { data: booking, error: bookingErr } = await supabase
      .from("bookings")
      .select(
        "id, profiles!bookings_user_id_fkey(*), charged, payment_intent_id, room_id, check_in, check_out",
      )
      .eq("id", booking_id)
      .single();

    if (bookingErr || !booking) {
      return res.status(404).json({ error: "Booking not found" });
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

    // Retrieving the Stripe secret key for the refund
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    // Create the below variables
    let refundableNights = 0;
    let amountToRefund = 0;

    /**
     * If booking was charged, issue refund
     * */
    if (booking.charged === true) {
      // If no payment intent id, throw an error
      if (!booking.payment_intent_id) {
        return res.status(400).json({
          error:
            "Booking is marked as charged but has no payment_intent_id stored.",
        });
      }

      const checkOut = new Date(booking.check_out);
      const today = new Date();

      // If today bigger than check-out, it means the check-out is in
      // the past. No refund posible.
      if (today >= checkOut) {
        return res
          .status(400)
          .json({ error: "Refund not possible after checkout date" });
      }
      // Refund starts tomorrow
      const refundStart = new Date(today);
      // We add 1 day so that the refund starts from 1 night after
      // the cancellation date
      // https://stackoverflow.com/questions/4868241/javascript-date-1#4868270
      refundStart.setDate(refundStart.getDate() + 1);
      const msPerNight = 1000 * 60 * 60 * 24;
      // Nights eligible for refund, rounding to the nearest integer and picking out the max value
      // https://www.w3schools.com/jsref/jsref_ceil.asp
      refundableNights = Math.max(
        Math.ceil((checkOut - refundStart) / msPerNight),
        0,
      );
      // Stripe requires cents, hence, calculating the refund accordingly
      amountToRefund = refundableNights * room.price * 100;

      try {
        // We create a refund at this point, as Admin does have the power
        // to cancel and refund a booking afer check-in if needed
        // https://docs.stripe.com/api/refunds/create?lang=node
        if (amountToRefund > 0) {
          await stripe.refunds.create({
            payment_intent: booking.payment_intent_id,
            amount: amountToRefund,
          });
        }
      } catch (refundErr) {
        return res.status(500).json({
          error: "Stripe refund failed",
          details: refundErr.message,
        });
      }
    }

    // Delete booking after refund (or if not charged)
    const { error: deleteErr } = await supabase
      .from("bookings")
      .delete()
      .eq("id", booking_id);

    if (deleteErr) {
      return res.status(500).json({ error: deleteErr.message });
    }

    const profile = booking.profiles;
    // Fetching the GuestEase logo from Supabase storage
    const logoUrl = getPublicUrl("assets", "GuestEaseLogo.png");

    // Generate email HTML and passing through all needed parameters
    const html = adminCancelledBookingTemplate({
      profile,
      booking,
      logoUrl,
      refundableNights,
      amountToRefund,
      room,
    });

    // Send email vua emailUtil.js
    await fetch("http://localhost:3000/send_email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: profile.email,
        subject: `Your Booking for ${room.name} at GuestEase has been cancelled by the Admin 😔`,
        body: html,
      }),
    });

    return res.json({
      message:
        booking.charged === true
          ? "Booking cancelled and refunded successfully"
          : "Booking cancelled successfully (no charge to refund)",
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;

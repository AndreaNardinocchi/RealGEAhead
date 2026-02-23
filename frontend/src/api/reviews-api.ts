// import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase/supabaseClient";
import { reviewEmailTemplate } from "../utils/reviewEmail";
import { getPublicUrl } from "../utils/supabaseAssetsStorage";
import { getBookingById, getRoomById, getUserProfile } from "./guestease-api";

/**
 * This is a function to submit a review.
 * We create a payload with all fields in the supabase 'revies' table and insert
 * it.
 * https://supabase.com/docs/reference/javascript/insert
 */
export const submitReview = async (payload: {
  booking_id: string;
  room_id: string;
  user_id: string;
  rating: number;
  comment: string;
}) => {
  const { booking_id, rating, comment } = payload;
  const { error } = await supabase.from("reviews").insert({
    ...payload,
    created_at: new Date(),
  });
  if (error) throw new Error(error.message);

  // Retrieving all objects needed for the email parameters
  const room = await getRoomById(payload.room_id);
  const booking = await getBookingById(payload.booking_id);
  const user = await getUserProfile(payload.user_id);

  // Fetching the GuestEase logo from the Supabase storage
  const logoUrl = getPublicUrl("GuestEaseLogo.png");
  const adminEmail = import.meta.env.VITE_RESEND_ADMIN_EMAIL;

  // Generate the full HTML for the booking confirmation email using the template
  // and pass the below values
  const html = reviewEmailTemplate({
    booking_id,
    check_in: booking.check_in,
    check_out: booking.check_out,
    rating,
    room_name: room?.name ?? "Unknown Room",
    user_name: user?.first_name ?? "Guest",
    comment,
    logoUrl,
    adminDashboardUrl: "https://real-ge-ahead-kq85.vercel.app/admin/reviews",
  });

  const res = await fetch("https://realgeahead-1.onrender.com/send_email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: adminEmail,
      subject: "New Review Submitted",
      body: html,
    }),
  });

  return true;
};

/**
 * This is a helper to get all reviews of a specific room, which also
 * create a 'join' with the profiles table through 'profile as a foreign key
 * constraint.
 * https://supabase.com/docs/guides/database/joins-and-nesting?queryGroups=language&language=js
 */
export const getRoomReviews = async (roomId: string) => {
  const { data, error } = await supabase
    .from("reviews")
    .select(
      `
      *,
      profile:profiles (
        first_name,
        last_name
      )
    `,
    )
    .eq("room_id", roomId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  if (!data) return [];

  /**
   * We then 'return' a 'map' of 'guestname' which is nothing but
   * the combination of the first and last name's guest
   */
  return data.map((review: any) => {
    const first = review.profile?.first_name || "";
    const last = review.profile?.last_name || "";

    const guestName = (first + " " + last).trim() || "Guest";
    // We then, return, the review object through the stread operator and add the new field 'guestName'
    return { ...review, guestName };
  });
};

/**
 * This will fetch a review by booking
 */
export const getBookingReview = async (bookingId: string) => {
  const { data: review, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("booking_id", bookingId)
    .maybeSingle();
  if (error) throw new Error(error.message);

  return review;
};

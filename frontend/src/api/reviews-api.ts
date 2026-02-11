import { supabase } from "../supabase/supabaseClient";

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
  const { error } = await supabase.from("reviews").insert({
    ...payload,
    created_at: new Date(),
  });

  if (error) throw new Error(error.message);
  return true;
};

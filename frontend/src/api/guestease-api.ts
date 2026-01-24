/**
 * Fetch all rooms from the Supabase "rooms" table.
 * It uses the Supabase client to query the "rooms" table.
 * `.select("*")` retrieves every column for each room.
 *
 * https://supabase.com/docs/reference/javascript/select
 */
import { supabase } from "../supabase/supabaseClient";
import { Booking } from "../types/interfaces";

export const getRooms = async () => {
  const { data, error } = await supabase.from("rooms").select("*");

  // If Supabase returns an error, we throw a descriptive exception
  if (error) {
    throw new Error(`Unable to fetch rooms: ${error.message}`);
  }
  return data;
};

/**
 * Fetch a single user profile from the Supabase "profiles" table.
 * Requires the authenticated user's ID.
 */
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw new Error(error.message);
  return data;
};

/**
 * Fetch all bookings for a given user, including full room details, by joining the rooms table
 * to the bookings'.
 * This uses a Supabase relational join instead of manually merging
 * bookings + rooms. 
 * https://supabase.com/docs/reference/javascript/select check 'Query referenced tables through a join table'
 * Ex.:
 * const { data, error } = await supabase
  .from('users')
  .select(`
    name,
    teams (
      name
    )
  `)
 */
export const getUserBookings = async (userId: string) => {
  const { data, error } = await supabase
    .from("bookings")
    .select(
      `
      *,
      rooms (
        id,
        name,
        images,
        price
      )
    `,
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Unable to fetch bookings: ${error.message}`);
  }

  // Take the Supabase result 'data'. which may be null, and ensure we always map over an array
  return (data ?? []).map((b) => ({
    // Spread the original booking fields (id, user_id, check_in, etc.)
    ...b,
    rooms: {
      // Copy the room's unique identifier
      id: b.rooms.id,
      // Copy the room's display name
      name: b.rooms.name,
      // Copy the room's image array
      images: b.rooms.images,
      // Copy the room's price
      price: b.rooms.price,
    },
  }));
};

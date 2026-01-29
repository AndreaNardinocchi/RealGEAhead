/**
 * Fetch all rooms from the Supabase "rooms" table.
 * It uses the Supabase client to query the "rooms" table.
 * `.select("*")` retrieves every column for each room.
 *
 * https://supabase.com/docs/reference/javascript/select
 */
import { supabase } from "../supabase/supabaseClient";
import { Booking, User } from "../types/interfaces";

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

  return data ?? [];
};

/**
 * This API function will allow us to get user data updated
 */
export async function updateUserProfile(
  userId: string,
  updates: Partial<User>,
) {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * This API function will first find tha uthorized user, and will then 'post'
 * a request to the backend userDeleteAccount.js
 */
export const deleteUserApi = async (userId: string) => {
  const { error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw new Error(error.message);
  const res = await fetch("http://localhost:3000/user/delete-account", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    /**
     * Convert the booking object into JSON before sending.
     * Express.json() on the backend will parse this automatically.
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
     */
    body: JSON.stringify({ userId }),
  });

  /**
   * Parse the JSON response from the backend.
   * If the backend returns an error, it will be included here.
   */
  const result = await res.json();

  /**
   * If the HTTP status is not in the 200–299 range,
   * throw an error so the frontend can handle it.
   * https://developer.mozilla.org/en-US/docs/Web/API/Response/ok
   */
  if (!res.ok) {
    throw new Error(result.error || "Failed to create booking");
  }

  // Return the booking data to the caller.
  return result;
};

/**
 * Fetch all rooms from the Supabase "rooms" table.
 * It uses the Supabase client to query the "rooms" table.
 * `.select("*")` retrieves every column for each room.
 *
 * https://supabase.com/docs/reference/javascript/select
 */
import { supabase } from "../supabase/supabaseClient";

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

/**
 * Fetch all rooms from the Supabase "rooms" table.
 * It uses the Supabase client to query the "rooms" table.
 * `.select("*")` retrieves every column for each room.
 *
 * https://supabase.com/docs/reference/javascript/select
 */
import { supabase } from "../../supabaseClient";

export const getRooms = async () => {
  const { data, error } = await supabase.from("rooms").select("*");

  // If Supabase returns an error, we throw a descriptive exception
  if (error) {
    throw new Error(`Unable to fetch rooms: ${error.message}`);
  }
  return data;
};

// https://tanstack.com/query/latest/docs/react/reference/useQuery
import { useQuery } from "@tanstack/react-query";
import { searchAvailableRooms } from "../supabase/availableRooms";

/**
 * useAvailableRooms is a custom hook for fetching available rooms based on date and guest filters.
 * This hook help us centralizes all room availability logic.
 * React Query is automatically cache results per checkIn, checkOut, guests, provide built‑in loading
 * and error handling, and refetch data when filters change.
 * https://tanstack.com/query/v4/docs/framework/react/guides/caching
 *
 */
export function useAvailableRooms(
  checkIn: string,
  checkOut: string,
  guests: number
) {
  return useQuery({
    queryKey: ["availableRooms", checkIn, checkOut, guests],
    /**
     * queryFn calls the searchAvailableRooms async function from searchAvailableRooms.ts,
     * which, in turn, calls in the Supabase PostgreSQL RPC function named "get_available_rooms".
     * https://supabase.com/docs/guides/database/functions
     */
    queryFn: async () => {
      const result = await searchAvailableRooms(checkIn, checkOut, guests);

      if (!result.success) {
        throw new Error(result.message || "Failed to fetch rooms");
      }

      return result.rooms;
    },
  });
}

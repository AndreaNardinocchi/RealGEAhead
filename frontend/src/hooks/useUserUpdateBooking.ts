import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBookingApi } from "../api/user-booking-api";

export function useUserUpdateBooking() {
  /**
   * React Query’s useMutation updates the booking, then invalidates the
   * cached "bookings" query so fresh data is refetched.
   * Local form state mirrors the tables data, and useEffect keeps it synced
   * whenever the booking query returns new values from Supabase.
   * https://tanstack.com/query/v4/docs/framework/react/guides/mutations
   * https://tanstack.com/query/v4/docs/framework/react/guides/query-invalidation
   */
  const queryClient = useQueryClient();

  return useMutation({
    // 'Constructs a type with all properties of Type set to optional.'
    // This is perfect for update operations where we only send the fields that changed.
    // https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype
    mutationFn: updateBookingApi,

    onSuccess: () => {
      // Refresh all bookings after update
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}

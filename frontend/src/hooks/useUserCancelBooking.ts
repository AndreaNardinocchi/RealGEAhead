import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelBookingApi } from "../api/user-booking-api";

export function useUserCancelBooking(userId: string | undefined) {
  /**
   * React Query’s useMutation cancels the booking, then invalidates the
   * cached "bookings" query so fresh data is refetched.
   * Local form state mirrors the tables data, and useEffect keeps it synced
   * whenever the booking query returns new values from Supabase.
   * https://tanstack.com/query/v4/docs/framework/react/guides/mutations
   * https://tanstack.com/query/v4/docs/framework/react/guides/query-invalidation
   */
  const queryClient = useQueryClient();

  return useMutation({
    // 'Constructs a type with all properties of Type set to optional.'
    // This is perfect for deleting operations where we only send the field relevant for deletion
    // https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype
    mutationFn: (bookingId: string) => cancelBookingApi(bookingId),

    onSuccess: () => {
      // Refresh bookings after cancellation
      queryClient.invalidateQueries({ queryKey: ["bookings", userId] });
    },
  });
}

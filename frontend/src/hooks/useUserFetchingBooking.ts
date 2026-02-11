import { useQuery } from "@tanstack/react-query";
import { getBookingById } from "../api/guestease-api";

export const useUserFetchBooking = (bookingId?: string | undefined) => {
  return useQuery({
    queryKey: ["bookings", bookingId],
    queryFn: () => getBookingById(bookingId!),
    enabled: !!bookingId, // only run when roomId exists
  });
};

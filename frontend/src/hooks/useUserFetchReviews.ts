import { useQuery } from "@tanstack/react-query";

import { getBookingReview } from "../api/reviews-api";

export const useUserFetchReviews = (bookingId: string) => {
  return useQuery({
    queryKey: ["review", bookingId],
    queryFn: () => getBookingReview(bookingId),
    enabled: !!bookingId,
  });
};

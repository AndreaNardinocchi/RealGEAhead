import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitReview } from "../api/reviews-api";

/**
 * React Query’s useMutation submit the review, then invalidates the
 * cached "reviews" query so fresh data is refetched.
 * https://tanstack.com/query/v4/docs/framework/react/guides/mutations
 * https://tanstack.com/query/v4/docs/framework/react/guides/query-invalidation
 */
export const useSubmitReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitReview,
    onSuccess: () => {
      // Refresh reviews list
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
};

import { useQuery } from "@tanstack/react-query";
import { getRoomReviews } from "../api/reviews-api";

export const useUserFetchReviews = (roomId: string) => {
  return useQuery({
    queryKey: ["reviews", roomId],
    queryFn: () => getRoomReviews(roomId),
    enabled: !!roomId, // only run when roomId exists
  });
};

import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "../api/guestease-api";

export const useUserProfile = (userId?: string | undefined) => {
  return useQuery({
    queryKey: ["profile", userId],
    queryFn: () => getUserProfile(userId!),
    enabled: !!userId, // only run when userId exists
  });
};

import { useQuery } from "@tanstack/react-query";
import { getRoomById } from "../api/guestease-api";

export const useUserFetchRoom = (roomId?: string | undefined) => {
  return useQuery({
    queryKey: ["rooms", roomId],
    queryFn: () => getRoomById(roomId!),
    enabled: !!roomId, // only run when roomId exists
  });
};

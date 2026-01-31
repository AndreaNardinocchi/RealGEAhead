import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserProfile } from "../api/guestease-api";
import { User } from "../types/interfaces"; // adjust path

/**
 * React Query’s useMutation updates the user profile, then invalidates the
 * cached "profile" query so fresh data is refetched.
 * Local form state mirrors the profile data, and useEffect keeps it synced
 * whenever the profile query returns new values from Supabase.
 * https://tanstack.com/query/v4/docs/framework/react/guides/mutations
 * https://tanstack.com/query/v4/docs/framework/react/guides/query-invalidation
 */
export function useUserUpdateProfile(userId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    // 'Constructs a type with all properties of Type set to optional.'
    // This is perfect for update operations where we only send the fields that changed.
    // https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype
    mutationFn: (updates: Partial<User>) => updateUserProfile(userId!, updates),

    onSuccess: () => {
      // Refresh the profile query after update
      queryClient.invalidateQueries({ queryKey: ["profile", userId] });
    },
  });
}

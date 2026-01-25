import React, { useContext } from "react";
import { Box, CircularProgress, Container, Typography } from "@mui/material";
import { getUserBookings } from "../api/guestease-api";
import type { Booking } from "../types/interfaces";
import { AuthContext } from "../contexts/authContext";
import { useQuery } from "@tanstack/react-query";
import { getPublicUrl } from "../utils/supabaseAssetsStorage";
import BookedRoomCard from "../components/bookedRoomCard/bookedRoomCard";

/**
 * The AccountMyTripsPage dissplays all upcoming and past reservations.
 */

const AccountMyTripsPage: React.FC = () => {
  /**
   * Access authentication state from AuthContext.
   * 'auth' may be null before the provider initializes, so we safely
   * destructure 'user' and 'loading' with a fallback to an empty object.
   */
  const auth = useContext(AuthContext);
  const { user, loading } = auth || {};

  /**
   * React Query is a data-fetching and caching library that simplifies working with
   * asynchronous data in React applications. Instead of manually managing loading states,
   * errors, caching, refetching, and background updates, React Query handles all of this
   * automatically. This results in cleaner components, fewer bugs, and a much smoother UX.
   * React Query v5 is the latest, actively maintained version of TanStack Query.
   * It introduces a simpler, more consistent API using a single options object:
   *
   *    useQuery({ queryKey: [...], queryFn: ... })
   *
   * https://tanstack.com/query/latest/docs/framework/react/reference/useQuery
   * https://tanstack.com/query/latest/docs/framework/react/quick-start
   *    */
  const { data, error, isLoading } = useQuery<Booking[]>({
    queryKey: ["bookings", user?.id],
    // Only run this query when a user is logged in.
    // '!!user?.id' converts the value to a boolean:
    enabled: !!user?.id,
    queryFn: () => getUserBookings(user!.id),
    /**
     * Force refetch on navigation, as we set  staleTime: 5 * 60 * 1000
     * in the main.tsx file
     */
    staleTime: 0,
  });

  console.log("This is the booking", data);
  console.log("This is the userId: ", user?.id);

  if (isLoading) {
    return (
      <Container sx={{ mt: 10, textAlign: "center" }}>
        <Box display="flex" justifyContent="center" mt={10}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 10, textAlign: "center" }}>
        <Typography color="error">Failed to load reservations</Typography>
      </Container>
    );
  }

  return (
    <>
      <Box maxWidth="1200px" mx="auto" px={2}>
        <Typography variant="h3">Hey {user?.first_name}</Typography>
        <Typography variant="h5">Account #{user?.id.slice(-8)}</Typography>
      </Box>

      {/* <SubNav /> */}

      <Box maxWidth="1200px" mx="auto" px={2} sx={{ mb: 12 }}>
        <Typography
          variant="h4"
          align="center"
          sx={{ color: "#472d30", mb: 1, mt: 3 }}
        >
          My Reservations
        </Typography>

        <Box
          mt={2}
          display="grid"
          gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" }}
          gap={3}
        >
          {(data ?? []).map((booking: Booking) => (
            <BookedRoomCard
              key={booking.id}
              booking={booking}
              room={booking.rooms}
            />
          ))}
        </Box>
      </Box>
    </>
  );
};

export default AccountMyTripsPage;

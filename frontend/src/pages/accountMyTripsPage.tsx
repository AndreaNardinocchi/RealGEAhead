import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Container,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { getUserBookings } from "../api/guestease-api";
import type { Booking } from "../types/interfaces";
import { AuthContext } from "../contexts/authContext";
import { useQuery } from "@tanstack/react-query";
import BookedRoomCard from "../components/bookedRoomCard/bookedRoomCard";
import AccountSubNav from "../accountSubNav/accountSubNav";

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
  const { user } = auth || {};

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

  // Browser title
  useEffect(() => {
    if (user) {
      document.title = `${user.first_name}'s My Trips Page | GuestEase`;
    }
  }, [user]);

  // Creating the useState for the tabs
  // https://mui.com/material-ui/react-tabs/
  const [tabValue, setTabValue] = useState(0);

  /**
   * As we set up upcoming and past bookings tabs, we need to be able to filter
   * the bookings based on their ceck out date to establish whether they are upcoming or
   * past ones.
   */
  const today = new Date();

  /**
   * We create an array of bookings which are upcoming ones
   * The check_out date must be bigger than today's date
   */
  const upcomingBookings = (data ?? []).filter((b) => {
    const checkout = new Date(b.check_out);
    console.log("Upcoming: ", checkout >= today);
    return checkout >= today;
  });

  /**
   * We create an array of bookings which are past ones
   * The check_out date must be older than today's date
   */
  const pastBookings = (data ?? []).filter((b) => {
    const checkout = new Date(b.check_out);
    console.log("Upcoming: ", checkout < today);
    return checkout < today;
  });

  /**
   * This helper function renders a list of bookings for either the 'upcoming' or 'past' tab.
   * If the provided bookings array is empty, it displays a friendly message indicating that
   * there are no reservations for the selected category.
   */
  const renderBookings = (bookings: Booking[]) => {
    if (!bookings.length) {
      return (
        <Typography align="center" sx={{ mt: 3, color: "#472d30" }}>
          No reservations
        </Typography>
      );
    }

    return (
      <Box maxWidth="1200px" mx="auto" px={2} sx={{ mb: 4 }}>
        <Box
          mt={2}
          display="grid"
          gridTemplateColumns={{
            xs: "1fr",
            sm: "1fr 1fr",
            md: "1fr 1fr 1fr",
          }}
          gap={3}
        >
          {bookings.map((booking) => (
            <BookedRoomCard
              key={booking.id}
              booking={booking}
              room={booking.rooms}
            />
          ))}
        </Box>
      </Box>
    );
  };

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
      <Container maxWidth="lg" sx={{ minHeight: 500 }}>
        <Box maxWidth="1200px" mx="auto" px={2}>
          <Typography variant="h3" component="h2">
            Hey {user?.first_name}
          </Typography>
          <Typography variant="h5" component="h3">
            Account #{user?.id.slice(-8)}
          </Typography>
        </Box>

        <AccountSubNav />
        <Typography
          variant="h4"
          component="h3"
          align="center"
          sx={{ color: "#472d30", mb: 1, mt: 1 }}
        >
          My Reservations
        </Typography>

        <Tabs
          // The currently selected tab index
          value={tabValue}
          // Updates the selected tab when the user clicks a tab
          // Docs: https://mui.com/material-ui/react-tabs/#controlled-tabs
          onChange={(_, v) => setTabValue(v)}
          centered
          textColor="secondary"
          // Sets the color of the indicator bar under the active tab
          indicatorColor="secondary"
          sx={{
            mb: 2,
            // Styles applied to the selected tab
            "& .MuiTab-root.Mui-selected": {
              color: "#472d30",
              fontWeight: 600,
            },
            // Styles applied to the indicator bar
            "& .MuiTabs-indicator": {
              backgroundColor: "#472d30",
              height: 3,
              borderRadius: 2,
            },
          }}
        >
          <Tab label="Upcoming" />
          <Tab label="Past" />
        </Tabs>

        {/* When tabValue is 0, render upcoming bookings */}
        {/* Conditional rendering docs: https://react.dev/learn/conditional-rendering */}
        {tabValue === 0 && renderBookings(upcomingBookings)}
        {/* When tabValue is 1, render past bookings */}
        {tabValue === 1 && renderBookings(pastBookings)}

        <Box maxWidth="1200px" mx="auto" px={2} sx={{ mb: 12 }}></Box>
      </Container>
    </>
  );
};

export default AccountMyTripsPage;

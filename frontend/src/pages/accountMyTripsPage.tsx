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
import { useUserUpdateBooking } from "../hooks/useUserUpdateBooking";
import EditBookingDialog from "../components/editBookingDialog/editBookingDialog";
import AlertDialogSlide from "../components/cancelBookingConfirm/cancelBookingConfirm";
import { useUserCancelBooking } from "../hooks/useUserCancelBooking";
import PaymentDialog from "../components/stripeCheckOutModal/stripeCheckOutModal";
import { useUserProfile } from "../hooks/useFetchingUserProfile";
import { useNavigate } from "react-router-dom";

/**
 * The AccountMyTripsPage dissplays all upcoming and past reservations.
 */

const AccountMyTripsPage: React.FC = () => {
  // We retrieve the user auth.users from supabase
  const auth = useContext(AuthContext);
  const { user } = auth || {};
  // We then retrieve the 'profile' user from the 'profiles' table in supabase
  // since this is the one that has the stripe_customer_id column
  const { data: profile } = useUserProfile(user?.id);

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

  const navigate = useNavigate();

  // React Query mutation hook for updating a booking.
  // Encapsulates the API call and handles cache invalidation internally.
  const updateBookingMutation = useUserUpdateBooking();

  const [open, setOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);

  // This useState will enable us to manage the StripeCheckoutModal
  const [stripeCheckOutModalOpen, setStripeCheckOutModalOpen] = useState(false);
  /**
   * Holds booking changes that require an additional Stripe payment.
   * When the user edits a booking and the new total price is higher,
   * we store the updated booking data here and open the Stripe modal.
   * After successful payment, this data is sent to the update mutation.
   */
  const [pendingUpdateData, setPendingUpdateData] = useState<any>(null);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleUpdate = (booking: any) => {
    setSelectedBooking(booking);
    setOpen(true);
  };

  const handleSave = (updatedBooking: {
    id: any;
    room_id: any;
    check_in: any;
    check_out: any;
    guests: any;
    total_price: number;
  }) => {
    if (!selectedBooking) return;

    // Original booking total price
    const originalToTalPrice = selectedBooking.total_price;
    // This is the updated booking price
    const updatedTotalPrice = updatedBooking.total_price;
    // We then calculate the difference
    const amountDifference = updatedTotalPrice - originalToTalPrice;

    console.log("ORIGINAL:", selectedBooking.total_price);
    console.log("UPDATED:", updatedBooking.total_price);
    console.log(
      "DIFF:",
      updatedBooking.total_price - selectedBooking.total_price,
    );
    /**
     * If amountDifference is > 0 then we add it to the updated booking
     * and create the pendingUpdateBooking...
     */
    if (amountDifference > 0) {
      setPendingUpdateData({
        ...updatedBooking,
        amountDifference,
      });
      //..and will trigger the stripeCheckOutModal to have the user re-enter their payment method
      setStripeCheckOutModalOpen(true);
      return;
    }
    // Once the payment method is re-entered, we complete the booking update
    updateBookingMutation.mutate({
      bookingId: updatedBooking.id,
      userId: user!.id,
      updates: {
        room_id: updatedBooking.room_id,
        check_in: updatedBooking.check_in,
        check_out: updatedBooking.check_out,
        guests: updatedBooking.guests,
      },
    });

    setOpen(false);
  };

  /**
   * This callback is called after the user successfully update
   * the Stripe payment flow and the payment method has been saved.
   * At this point we can safely create the booking in our backend.
   * */
  const handlePaymentSuccessSoUpdateNow = async (_paymentMethodId: string) => {
    try {
      if (!pendingUpdateData) return;
      /**
       * Build the final update payload after Stripe payment succeeds.
       * We include only the fields the backend expects: the booking ID,
       * the user ID, and the updated booking values.
       */
      const cleanUpdates = {
        bookingId: pendingUpdateData.id,
        userId: user!.id,
        updates: {
          room_id: pendingUpdateData.room_id,
          check_in: pendingUpdateData.check_in,
          check_out: pendingUpdateData.check_out,
          guests: pendingUpdateData.guests,
        },
      };

      /**
       * This above payload is then passed into our React Query mutation,
       * which updates the booking in Supabase via the API call in user-booking-api
       * (posting to the backend), and automatically invalidates
       * cached queries so the UI refreshes with the latest data.
       * const updateBookingMutation = useUserUpdateBooking();
       * */
      updateBookingMutation.mutate(cleanUpdates, {
        onSuccess: (data) => {
          setStripeCheckOutModalOpen(false);
          setPendingUpdateData(null);
          navigate(`/booking-confirmation/${data.booking.id}`);
        },
        onError: (err: any) => {
          setErrorMessage(err.message);
          setStripeCheckOutModalOpen(false);
        },
      });
    } catch (err: any) {
      setErrorMessage(err.message);
      setStripeCheckOutModalOpen(false);
    }
  };

  // This useState is used to open and close the modal
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleDeleteOpen = (booking: any) => {
    setSelectedBooking(booking);
    setDeleteOpen(true);
  };

  // React Query’s useMutation cancels the booking, then invalidates the cached "bookings" query so fresh data is refetched.
  // The useUserCancelBooking hook will do that for us
  const cancelBookingMutation = useUserCancelBooking(user?.id);

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
    console.log("Past: ", checkout < today);
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

    console.log("SELECTED BOOKING:", selectedBooking);

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
              handleUpdate={handleUpdate}
              setDeleteOpen={handleDeleteOpen}
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
        <EditBookingDialog
          open={open}
          booking={selectedBooking}
          room={selectedBooking?.rooms}
          onClose={() => setOpen(false)}
          // setBooking={setSelectedBooking}
          onSave={handleSave}
        />

        {/* We open the modal to ask confirmation to the user that 
        they are sure they want to cancel their booking */}
        {selectedBooking && (
          <AlertDialogSlide
            open={deleteOpen}
            onClose={() => setDeleteOpen(false)}
            onConfirm={async () => {
              try {
                // Using a promise to delete, waiting for the backend
                // https://tanstack.com/query/v4/docs/framework/react/guides/mutations#promises
                await cancelBookingMutation.mutateAsync(selectedBooking.id);

                // Close modal
                setDeleteOpen(false);
                // Redirect
              } catch (err) {
                console.error(err);
              }
            }}
          />
        )}

        <PaymentDialog
          open={stripeCheckOutModalOpen}
          onClose={() => setStripeCheckOutModalOpen(false)}
          customerId={profile?.stripe_customer_id || ""}
          onSuccess={handlePaymentSuccessSoUpdateNow}
        />
      </Container>
    </>
  );
};

export default AccountMyTripsPage;

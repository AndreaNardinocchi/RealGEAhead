import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  CircularProgress,
  Typography,
  Button,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Snackbar,
} from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllBookings, getRooms, getUserByEmail } from "../api/guestease-api";
import {
  adminCancelBookingApi,
  adminUpdateBookingApi,
  adminCreateBookingApi,
} from "../api/admin-bookings-api";

import { BookingWithUser } from "../types/interfaces";
import AdminDashboardHeader from "../components/adminDashboardHeader/adminDashboardHeader";
import AdminSubNav from "../components/adminSubNav/adminSubNav";
import { getRoomName } from "../utils/getRoomName";
import AdminBookingModal from "../components/adminBookingModal/adminBookingModal";
import PaymentDialog from "../components/stripeCheckOutModal/stripeCheckOutModal";
import AlertDialogSlide from "../components/cancelBookingConfirm/cancelBookingConfirm";
import BookingFilterUI from "../components/bookingFilterUI/bookingFilterUI";
import { useFilteredBookings } from "../hooks/useFilteredBookings";

const AdminBookingsPage: React.FC = () => {
  // Controls visibility of the booking modal
  const [openBookingModal, setOpenBookingModal] = useState(false);
  // Holds the booking currently being edited (null = create mode)
  const [editingBooking, setEditingBooking] = useState<BookingWithUser | null>(
    null,
  );
  // React Query client used for cache invalidation after mutations
  const queryClient = useQueryClient();
  // Controls visibility of the success snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Stores the text that will appear inside the Snackbar
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Controls whether the delete‑confirmation dialog is visible
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Holds the ID of the booking the user intends to delete
  const [bookingToDelete, setBookingToDelete] = useState<string | null>(null);

  // This state controls the payment dialog
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);

  // This state will control and set the Stripe customer id
  const [customerId, setCustomerId] = useState<string | null>(null);

  // This state handles the paymentMethodId
  const [paymentMethodId, setPaymentMethodId] = useState<string | null>(null);

  // We set a useState for the filters and leave the fields as empty
  const [filters, setFilters] = useState({
    search: "",
    room: "",
    first_name: "",
    last_name: "",
    email: "",
    check_in: "",
    check_out: "",
    created_at: "",
    guests: "",
  });

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
  const {
    data: bookings,
    isLoading: bookingsLoading,
    error: bookingsError,
  } = useQuery({
    queryKey: ["bookings"],
    queryFn: getAllBookings,
  });

  const {
    data: rooms,
    isLoading: roomsLoading,
    error: roomsError,
  } = useQuery({
    queryKey: ["rooms"],
    queryFn: getRooms,
  });

  // Browser title
  useEffect(() => {
    document.title = `Bookings Admin Dashboard | GuestEase`;
  });

  // Opens the modal in 'create' mode
  const handleOpenCreateBooking = () => {
    setEditingBooking(null);
    setOpenBookingModal(true);
  };

  /**
   * This handles the payment dialog pop up passing in the booking object
   */
  const handleOpenPaymentDialog = async (booking: any) => {
    try {
      // We retrieve the user by email as this is the field the admin will be
      // filling in the admin modal form
      const profile = await getUserByEmail(booking.user_email);

      if (!profile?.stripe_customer_id) {
        setSnackbarMessage("This user does not have a Stripe customer ID yet.");
        setSnackbarOpen(true);
        return;
      }

      // We then set the stripe customer id
      setCustomerId(profile.stripe_customer_id);

      /**
       * Store the booking we are about to charge for.
       * This works for both create and update flows.
       */
      setEditingBooking(booking);
      setPaymentDialogOpen(true);
    } catch (err) {
      setSnackbarMessage("Could not load user profile.");
      setSnackbarOpen(true);
    }
  };

  // Handles updating an existing booking passing both the booking object and the paymnt method id
  const handleUpdateBooking = async (
    booking: any,
    paymentMethodId?: string,
  ) => {
    if (!booking?.id) return;
    try {
      // We send the updated booking object to the backend
      await adminUpdateBookingApi({
        booking_id: booking.id,
        room_id: booking.room_id,
        check_in: booking.check_in,
        check_out: booking.check_out,
        guests: Number(booking.guests),
        payment_method_id: paymentMethodId,
      });
      // Refresh bookings list
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      setSnackbarMessage("Booking updated successfully!");
      setSnackbarOpen(true);
      setOpenBookingModal(false);
    } catch (err: any) {
      setSnackbarMessage(err.message || "Something went wrong");
      setSnackbarOpen(true);
    }
  };

  // Opens the modal in 'update' mode
  const handleOpenUpdateBooking = (b: BookingWithUser) => {
    setEditingBooking(b);
    setOpenBookingModal(true);
  };

  // Handles creating a new booking through the admin API
  const handleCreateBooking = async (
    booking: any,
    paymentMethodId?: string,
  ) => {
    try {
      const newBooking = {
        room_id: booking.room_id,
        user_email: booking.user_email,
        check_in: booking.check_in,
        check_out: booking.check_out,
        guests: Number(booking.guests),
        payment_method_id: paymentMethodId,
      };
      // Sends booking object to the backend
      await adminCreateBookingApi(newBooking);
      // This clears out the cache and alloes us to see the created booking without having to refresh the page
      // https://tanstack.com/query/v4/docs/framework/react/guides/query-invalidation
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      // Message to confirm the booking has beeen created
      setSnackbarMessage("Booking created successfully!");
      setSnackbarOpen(true);
      setOpenBookingModal(false);
    } catch (err: any) {
      setSnackbarMessage(err.message || "Something went wrong");
      setSnackbarOpen(true);
    }
  };

  // It will handle the booking delete
  const handleDeleteBooking = async (booking_id: string) => {
    if (!bookingToDelete) return;
    try {
      // The booking to delete will sent off to the backend
      await adminCancelBookingApi(booking_id);
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      setSnackbarMessage("Booking deleted successfully!");
      setSnackbarOpen(true);
    } catch (err: any) {
      setSnackbarMessage(err.message || "Something went wrong");
      setSnackbarOpen(true);
    } finally {
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch#syntax
      setDeleteDialogOpen(false);
      setBookingToDelete(null);
    }
  };

  // We call the filteredBookings through the hook useFilteredBookings
  const filteredBookings = useFilteredBookings(bookings, rooms, filters);

  if (bookingsLoading || roomsLoading) {
    return (
      <Container>
        <Box textAlign="center" mt={4}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (bookingsError || roomsError) {
    return (
      <Container>
        <Typography color="error" mt={4}>
          Failed to load data.
        </Typography>
      </Container>
    );
  }

  /**
   * The below function will check whether the check-out date is the current
   * date or is in the past. If that is the case, the 'Update' and 'Delete'
   * buttons will grayed out
   */
  function isCheckoutTodayOrPast(checkOut: string | Date): boolean {
    const today = new Date();
    // Resetting today to midnight
    // https://codetofun.com/js/date-sethours/
    today.setHours(0, 0, 0, 0);

    // Setting check-out date and hours
    const co = new Date(checkOut);
    co.setHours(0, 0, 0, 0);

    // Returning the subtraction between checkout and today's time and whether true or false
    // 'True' if the check-out date is today or in the past, and 'False' if in the future
    return co.getTime() <= today.getTime();
  }

  return (
    <>
      <AdminDashboardHeader />
      <AdminSubNav />
      <Container maxWidth="xl" sx={{ pb: 8 }}>
        <Box my={4} display="flex" justifyContent="space-between">
          <Typography variant="h4">Bookings</Typography>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#e26d5c" }}
            // color="#e26d5c"
            onClick={handleOpenCreateBooking}
          >
            + Create Booking
          </Button>
        </Box>

        <BookingFilterUI
          filters={filters}
          setFilters={setFilters}
          rooms={rooms ?? []}
        />

        {/**
         * Material UI TableContainer component used to wrap the bookings table.
         */}

        <TableContainer
          // component={Paper} applies the MUI Paper surface for elevation and background.
          // https://mui.com/material-ui/react-paper/
          component={Paper}
          sx={{
            mb: 6,
            // overflowX: "auto" ensures horizontal scrolling on smaller screens.
            //  https://developer.mozilla.org/en-US/docs/Web/CSS/overflow-x
            overflowX: "auto",
            overflowY: "auto",
            maxHeight: {
              xs: "50vh",
              sm: "150vh",
            },
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <Table sx={{ minWidth: 900 }}>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: "#f5f5f5",
                  position: "sticky",
                  top: 0,
                  zIndex: 2,
                }}
              >
                <TableCell sx={{ fontWeight: "bold" }}>Booking ID</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Room</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>First Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Last Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Check‑in</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Check‑out</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Guests</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Total Price</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Created At</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Charged</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredBookings?.map((b) => {
                const checkoutIsTodayOrPast = isCheckoutTodayOrPast(
                  b.check_out,
                );

                return (
                  <TableRow key={b.id}>
                    <TableCell>{b.id}</TableCell>
                    <TableCell>{getRoomName(b.room_id, rooms ?? [])}</TableCell>
                    <TableCell>{b.first_name}</TableCell>
                    <TableCell>{b.last_name}</TableCell>
                    <TableCell
                      sx={{
                        wordBreak: "break-word",
                        maxWidth: 200,
                      }}
                    >
                      {b.user_email}
                    </TableCell>
                    <TableCell>{b.check_in}</TableCell>
                    <TableCell>{b.check_out}</TableCell>
                    <TableCell>{b.guests}</TableCell>
                    <TableCell>€{b.total_price}</TableCell>
                    <TableCell>
                      {new Date(b.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell>{b.charged ? "Yes" : "No"}</TableCell>

                    <TableCell>
                      <Button
                        variant="outlined"
                        sx={{ mr: 1 }}
                        disabled={checkoutIsTodayOrPast}
                        onClick={() => handleOpenUpdateBooking(b)}
                      >
                        Update
                      </Button>

                      <Button
                        variant="outlined"
                        color="error"
                        disabled={checkoutIsTodayOrPast}
                        onClick={() => {
                          setBookingToDelete(b.id);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <AdminBookingModal
          open={openBookingModal}
          onClose={() => setOpenBookingModal(false)}
          onSave={(booking: any) => {
            /**
             * If editingBooking exists and has an id, then 'update' mode
             * otherwise 'create' mode
             */
            if (editingBooking && editingBooking.id) {
              handleUpdateBooking(booking, paymentMethodId ?? undefined);
            } else {
              handleCreateBooking(booking, paymentMethodId ?? undefined);
            }
          }}
          rooms={rooms ?? []}
          editingBooking={editingBooking}
          onOpenPaymentDialog={handleOpenPaymentDialog}
        />

        {/* https://mui.com/material-ui/react-snackbar/ */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          message={snackbarMessage}
        />

        <AlertDialogSlide
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={() => handleDeleteBooking(bookingToDelete ?? "")}
        />

        {customerId && (
          <PaymentDialog
            open={paymentDialogOpen}
            onClose={() => setPaymentDialogOpen(false)}
            // customerId={customerId}
            onSuccess={(paymentMethodId) => {
              /**
               * After Stripe returns a payment method,
               * we check if the stored booking has an id.
               * If yes, we update the booking, otherwise we will create it.
               */
              if (editingBooking && editingBooking.id) {
                handleUpdateBooking(editingBooking, paymentMethodId);
              } else {
                handleCreateBooking(editingBooking, paymentMethodId);
              }
              setPaymentDialogOpen(false);
            }}
          />
        )}
      </Container>
    </>
  );
};

export default AdminBookingsPage;

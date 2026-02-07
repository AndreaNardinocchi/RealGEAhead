import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getRoomName } from "../utils/getRoomName";
import { getAllBookings, getRooms } from "../api/guestease-api";
import { BookingWithUser } from "../types/interfaces";
import AdminBookingModal from "../components/adminBookingModal/adminBookingModal";
import {
  adminCreateBookingApi,
  adminUpdateBookingApi,
} from "../api/admin-booking-api";

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

  // Local state for the booking form fields
  const [bookingForm, setBookingForm] = useState({
    room_id: "",
    user_email: "",
    check_in: "",
    check_out: "",
    guests: "",
  });

  // Opens the modal in 'create' mode and resets the form
  const handleOpenCreateBooking = () => {
    setEditingBooking(null);
    setBookingForm({
      room_id: "",
      user_email: "",
      check_in: "",
      check_out: "",
      guests: "",
    });
    setOpenBookingModal(true);
  };

  // Handles updating an existing booking
  const handleUpdateBooking = async () => {
    if (!editingBooking) return;
    try {
      await adminUpdateBookingApi({
        booking_id: editingBooking.id,
        room_id: bookingForm.room_id,
        check_in: bookingForm.check_in,
        check_out: bookingForm.check_out,
        guests: Number(bookingForm.guests),
      });
      // Refresh bookings list
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      setSnackbarOpen(true);
      setOpenBookingModal(false);
    } catch (err: any) {
      alert(err.message || "Something went wrong");
    }
  };

  // Opens the modal in 'update' mode and resets the form
  const handleOpenUpdateBooking = (b: BookingWithUser) => {
    setEditingBooking(b);
    setBookingForm({
      room_id: b.room_id,
      user_email: b.user_email,
      check_in: b.check_in,
      check_out: b.check_out,
      guests: String(b.guests),
    });
    setOpenBookingModal(true);
  };

  // Handles creating a new booking through the admin API
  const handleCreateBooking = async () => {
    try {
      const newBooking = {
        room_id: bookingForm.room_id,
        user_email: bookingForm.user_email,
        check_in: bookingForm.check_in,
        check_out: bookingForm.check_out,
        guests: Number(bookingForm.guests),
      };
      // Sends booking to the backend
      await adminCreateBookingApi(newBooking);
      // This clears out the cache and alloes us to see the created booking without having to refresh the page
      // https://tanstack.com/query/v4/docs/framework/react/guides/query-invalidation
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      // Message to confirm the booking has beeen created
      setSnackbarOpen(true);

      setOpenBookingModal(false);
    } catch (err: any) {
      alert(err.message || "Something went wrong");
    }
  };

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

  return (
    <>
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
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <Table sx={{ minWidth: 900 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
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
              {bookings?.map((b) => (
                <TableRow key={b.id}>
                  <TableCell>{b.id}</TableCell>
                  <TableCell>{getRoomName(b.room_id, rooms)}</TableCell>
                  <TableCell>{b.first_name}</TableCell>
                  <TableCell>{b.last_name}</TableCell>
                  <TableCell>{b.user_email}</TableCell>
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
                      onClick={() => handleOpenUpdateBooking(b)}
                    >
                      Update
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      // onClick={() => handleDeleteBooking(b.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <AdminBookingModal
          open={openBookingModal}
          onClose={() => setOpenBookingModal(false)}
          onSave={editingBooking ? handleUpdateBooking : handleCreateBooking}
          rooms={rooms ?? []}
          editingBooking={editingBooking}
          bookingForm={bookingForm}
          setBookingForm={setBookingForm}
        />
        {/* https://mui.com/material-ui/react-snackbar/ */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          message="Booking created successfully!"
        />
      </Container>
    </>
  );
};

export default AdminBookingsPage;

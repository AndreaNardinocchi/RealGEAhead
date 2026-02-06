import React from "react";
import {
  Box,
  CircularProgress,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getRoomName } from "../utils/getRoomName";
import { getAllBookings, getRooms } from "../api/guestease-api";

const AdminBookingsPage: React.FC = () => {
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
        <Box my={4}>
          <Typography variant="h4">Bookings</Typography>
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </>
  );
};

export default AdminBookingsPage;

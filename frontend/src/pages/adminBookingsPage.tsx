import React from "react";
import {
  Box,
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

/**
 * Dummy rooms list simulates what the real API would return.
 * Each room has an id and a display name.
 * https://mui.com/material-ui/react-table/
 */
const dummyRooms = [
  { id: 1, name: "Deluxe Suite" },
  { id: 2, name: "Ocean View Room" },
  { id: 3, name: "Standard Double" },
];

/**
 * Dummy bookings list simulates real booking data.
 * This allows UI development without backend dependencies for now.
 */
const dummyBookings = [
  {
    id: "12345",
    room_id: 1,
    first_name: "John",
    last_name: "Doe",
    user_email: "john@example.com",
    check_in: "2026-02-10",
    check_out: "2026-02-14",
    guests: 2,
    total_price: 480,
    created_at: "2026-01-29T16:58:09.877Z",
    charged: true,
  },
  {
    id: "23456",
    room_id: 3,
    first_name: "Sarah",
    last_name: "Connor",
    user_email: "sarah@example.com",
    check_in: "2026-03-01",
    check_out: "2026-03-05",
    guests: 1,
    total_price: 320,
    created_at: "2026-01-30T10:12:44.987Z",
    charged: false,
  },
];

/**
 * Helper function to convert room_id to room name.
 */
const getRoomName = (roomId: number) => {
  const room = dummyRooms.find((r) => r.id === roomId);
  return room ? room.name : "Unknown Room";
};

const AdminBookingsPage: React.FC = () => {
  return (
    <Container maxWidth="xl" sx={{ pb: 8 }}>
      <Box my={4}>
        <Typography variant="h4">Bookings (Dummy Data)</Typography>
      </Box>

      {/**
       * TableContainer wraps the table and provides scroll + Paper styling.
       * https://mui.com/material-ui/react-table/#table-container
       */}
      <TableContainer component={Paper} sx={{ mb: 6, overflowX: "auto" }}>
        <Table sx={{ minWidth: 900 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell>Booking ID</TableCell>
              <TableCell>Room</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Check‑in</TableCell>
              <TableCell>Check‑out</TableCell>
              <TableCell>Guests</TableCell>
              <TableCell>Total Price</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Charged</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {dummyBookings.map((b) => (
              <TableRow key={b.id}>
                <TableCell>{b.id}</TableCell>
                <TableCell>{getRoomName(b.room_id)}</TableCell>
                <TableCell>{b.first_name}</TableCell>
                <TableCell>{b.last_name}</TableCell>
                <TableCell>{b.user_email}</TableCell>
                <TableCell>{b.check_in}</TableCell>
                <TableCell>{b.check_out}</TableCell>
                <TableCell>{b.guests}</TableCell>
                <TableCell>€{b.total_price}</TableCell>
                <TableCell>{new Date(b.created_at).toLocaleString()}</TableCell>
                <TableCell>{b.charged ? "Yes" : "No"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default AdminBookingsPage;

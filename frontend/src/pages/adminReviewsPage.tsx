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

import AdminSubNav from "../components/adminSubNav/adminSubNav";
import AdminDashboardHeader from "../components/adminDashboardHeader/adminDashboardHeader";
import { getRoomName } from "../utils/getRoomName";

const AdminReviewsPage: React.FC = () => {
  // ------------------------------------
  // Dummy Data (Static)
  // ------------------------------------
  const rooms = [
    { id: "1", name: "Ocean View Suite" },
    { id: "2", name: "Garden Room" },
  ];

  const bookings = [
    { id: "B1", room_id: "1" },
    { id: "B2", room_id: "2" },
  ];

  const reviews = [
    {
      id: "R1",
      booking_id: "B1",
      room_id: "1",
      rating: 5,
      comment: "Great stay!",
      created_at: "2024-01-01T10:00:00Z",
    },
    {
      id: "R2",
      booking_id: "B2",
      room_id: "2",
      rating: 3,
      comment: "It was okay.",
      created_at: "2024-01-02T14:30:00Z",
    },
  ];

  return (
    <>
      <AdminDashboardHeader />
      <AdminSubNav />

      <Container sx={{ pb: 8, overflow: "visible" }}>
        <Box my={4}>
          <Typography variant="h4">Reviews</Typography>
        </Box>

        <TableContainer
          component={Paper}
          sx={{
            mb: 6,
            overflowX: "auto",
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <Table sx={{ minWidth: 900 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell sx={{ fontWeight: "bold" }}>Review ID</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Booking ID</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Room Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Rating</TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    display: { xs: "none", sm: "table-cell" },
                  }}
                >
                  Comment
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    display: { xs: "none", sm: "table-cell" },
                  }}
                >
                  Created At
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {reviews.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.id}</TableCell>
                  <TableCell>{r.booking_id}</TableCell>
                  <TableCell>{getRoomName(r.room_id, rooms)}</TableCell>
                  <TableCell>{r.rating}</TableCell>

                  <TableCell
                    sx={{
                      display: { xs: "none", sm: "table-cell" },
                      maxWidth: 250,
                    }}
                  >
                    {r.comment}
                  </TableCell>

                  <TableCell
                    sx={{
                      display: { xs: "none", sm: "table-cell" },
                    }}
                  >
                    {new Date(r.created_at).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </>
  );
};

export default AdminReviewsPage;

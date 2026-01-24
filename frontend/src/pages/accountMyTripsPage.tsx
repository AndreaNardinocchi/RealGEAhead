import React from "react";
import { Box, Typography } from "@mui/material";

/**
 * The AccountMyTripsPage dissplays all upcoming and past reservations.
 */

const AccountMyTripsPage: React.FC = () => {
  // Dummy user
  const user = {
    id: "1234567890",
    first_name: "John",
  };

  // Dummy upcoming bookings only
  const upcomingBookings = [
    {
      id: "b1",
      check_in: "2025-04-10",
      check_out: "2025-04-15",
      guests: 2,
      room: "Deluxe Suite",
    },
    {
      id: "b2",
      check_in: "2025-06-01",
      check_out: "2025-06-05",
      guests: 1,
      room: "Garden View Room",
    },
  ];

  return (
    <>
      <Box maxWidth="1200px" mx="auto" px={2}>
        <Typography variant="h3">Hey {user.first_name}</Typography>
        <Typography variant="h5">Account #{user.id.slice(-8)}</Typography>
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
          {upcomingBookings.map((b) => (
            <Box
              sx={{
                border: "1px solid #ddd",
                borderRadius: 2,
                p: 2,
                backgroundColor: "#fafafa",
                boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
              }}
            >
              <Typography variant="h6" sx={{ mb: 1, color: "#472d30" }}>
                {b.room}
              </Typography>

              <Typography>Check‑in: {b.check_in}</Typography>
              <Typography>Check‑out: {b.check_out}</Typography>
              <Typography>Guests: {b.guests}</Typography>

              <Box sx={{ mt: 2, fontSize: "0.85rem", color: "#666" }}>
                Booking ID: {b.id}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </>
  );
};

export default AccountMyTripsPage;

import React, { useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
  CircularProgress,
  Link as MuiLink,
  Alert,
  Container,
} from "@mui/material";
import {
  getConfirmationBooking,
  getUserProfile,
  getRoomById,
} from "../api/guestease-api";
import { useQuery } from "@tanstack/react-query";
import { getPublicUrl } from "../utils/supabaseAssetsStorage";
import { calculateNumberOfNights } from "../utils/calculateNumberOfNights";
import { Link as RouterLink } from "react-router-dom";
import { AuthContext } from "../contexts/authContext";

const BookingConfirmationPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Get current logged‑in user (
  const auth = useContext(AuthContext);
  const currentUser = auth?.user;

  /**
   * Once again we make use of the useQuery() function to catch data
   * from the 'bookings' table in Supabase through the 'getConfirmationBooking'
   * function in the 'guestease-api.tsx' file
   * https://tanstack.com/query/v4/docs/framework/react/reference/useQuery
   */
  const bookingQuery = useQuery({
    queryKey: ["booking", id],
    enabled: !!id,
    queryFn: () => getConfirmationBooking(id as string),
  });

  /**
   * We make use of the useQuery() function to catch data
   * from the 'profiles' table in Supabase through the 'getUserProfile'
   * function in the 'guestease-api.tsx' file
   * https://tanstack.com/query/v4/docs/framework/react/reference/useQuery
   */
  const profileQuery = useQuery({
    queryKey: ["profile", bookingQuery.data?.user_id],
    enabled: !!bookingQuery.data?.user_id,
    queryFn: () => getUserProfile(bookingQuery.data!.user_id),
  });

  /**
   * We make use of the useQuery() function to catch data
   * from the 'rooms' table in Supabase through the 'getRoomById'
   * function in the 'guestease-api.tsx' file
   * https://tanstack.com/query/v4/docs/framework/react/reference/useQuery
   */
  const roomQuery = useQuery({
    queryKey: ["room", bookingQuery.data?.room_id],
    enabled: !!bookingQuery.data?.room_id,
    queryFn: () => getRoomById(bookingQuery.data!.room_id),
  });

  // This will 'protect' the booking confirmation from an unauthorized user
  useEffect(() => {
    const booking = bookingQuery.data;

    if (booking && currentUser && booking.user_id !== currentUser.id) {
      navigate("/");
    }
  }, [bookingQuery.data, currentUser, navigate]);

  // Browser title
  useEffect(() => {
    if (bookingQuery.data && roomQuery.data) {
      document.title = `${roomQuery.data.name}'s #${bookingQuery.data.id.slice(
        -8,
      )} Reservation | GuestEase`;
    }
  }, [bookingQuery.data, roomQuery.data]);

  // We calculate the number of nights
  const totalNights = bookingQuery.data
    ? calculateNumberOfNights(
        bookingQuery.data.check_in,
        bookingQuery.data.check_out,
      )
    : 0;

  if (bookingQuery.isLoading || roomQuery.isLoading || profileQuery.isLoading) {
    return <CircularProgress sx={{ display: "block", mx: "auto", my: 10 }} />;
  }

  if (bookingQuery.isError) {
    return <Alert severity="error">Booking not found</Alert>;
  }

  if (roomQuery.isError) {
    return <Alert severity="error">Room not found.</Alert>;
  }

  const booking = bookingQuery.data;
  const room = roomQuery.data;
  const userProfile = profileQuery.data;

  return (
    <>
      {/* Hero image placeholder */}

      <Box
        sx={{
          width: "100%",
          height: { xs: 240, md: 360 },
          mb: 3,
        }}
      >
        <Box
          component="img"
          src={getPublicUrl(`/rooms/${room.id}/${room.images[0]}`)}
          alt={room.name}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: 1,
          }}
        />
      </Box>

      <Container maxWidth="lg" sx={{ mb: 12 }}>
        <Box sx={{ py: 3 }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{ mb: 8, color: "#000000de", textAlign: "center", mt: 1 }}
          >
            Your Booking at <strong>{room.name}</strong> Is Confirmed 🎉
          </Typography>

          {/* Outer grid */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 4,
            }}
          >
            {/* Left column */}
            <Box
              sx={{
                width: {
                  xs: "100%",
                  sm: "100%",
                  md: "100%",
                },
              }}
            >
              <Card sx={{ width: "100%", borderRadius: 2 }} elevation={3}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" component="h2" sx={{ mt: 2, mb: 4 }}>
                    <strong>Reservation Number:</strong> #
                    {booking.id.slice(-12)}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  {/* Inner grid */}
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                      gap: { xs: 0, sm: 2 },
                      mt: 4,
                    }}
                  >
                    {/* Left side */}
                    <Box sx={{ fontSize: "0.9rem" }}>
                      <Typography sx={{ mb: { xs: 0, sm: 1 } }}>
                        <strong>Guest:</strong> {userProfile?.first_name}{" "}
                        {userProfile?.last_name}
                        <br />
                        <strong>Account</strong>: #{userProfile.id.slice(-8)}
                        <br />
                        <strong>Room:</strong> {room.name}
                        <br />
                        <strong>Check-in:</strong> {booking.check_in}
                        <br />
                        <strong>Check-out:</strong> {booking.check_out}
                      </Typography>
                    </Box>

                    {/* Right side */}
                    <Box>
                      <Typography sx={{ mb: 1 }}>
                        <strong>Guests:</strong> {booking.guests}
                        <br />
                        <strong>Price per night:</strong> €
                        {room?.price ? Number(room.price).toFixed(2) : "—"}
                        <br />
                        <strong>Nights:</strong> {totalNights}
                        <br />
                        <strong>Booked on: </strong>
                        {new Date(booking.created_at).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="h6" sx={{ fontWeight: "bold", mb: 3 }}>
                    Total Price: €{booking.total_price.toFixed(2)}
                  </Typography>

                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      mb: 2,
                      backgroundColor: "#E26D5C",
                      "&:hover": { backgroundColor: "#c95b4d" },
                    }}
                    onClick={() => navigate("/account/mytrips")}
                  >
                    View My Bookings
                  </Button>

                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => navigate("/")}
                    sx={{
                      mb: 2,
                      color: "#000000de",
                    }}
                  >
                    Back to Home
                  </Button>
                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      textAlign: "center",
                      mt: 1,
                      color: "text.secondary",
                      fontStyle: "italic",
                    }}
                  >
                    Please note: reservations cannot be modified or cancelled
                    within 24 hours of check‑in.
                  </Typography>
                </CardContent>
              </Card>
            </Box>

            {/* Right column */}
            <Box>
              <Box
                component="img"
                src={getPublicUrl(`/rooms/${room.id}/${room.images[1]}`)}
                alt={room.name}
                sx={{
                  width: "100%",
                  height: { xs: "auto", sm: 370 },
                  bgcolor: "#d0d0d0",
                  borderRadius: 2,
                  boxShadow: 3,
                }}
              />

              <Typography sx={{ mb: "5%", mt: 4, color: "text.primary" }}>
                Thank you for choosing{" "}
                <MuiLink
                  component={RouterLink}
                  to={`/room/${booking.room_id}`}
                  sx={{
                    textDecoration: "none",
                    color: "#000000de",
                    "&:hover": { color: "#E26D5C" },
                  }}
                >
                  <strong>
                    {room.name} →.
                    <br />
                  </strong>
                </MuiLink>
                We’re excited to welcome you and hope you enjoy your stay!
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default BookingConfirmationPage;

import React, { useContext, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Rating,
  Link as MuiLink,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import { useUserFetchRoom } from "../hooks/useUserFetchingRoom";
import { useUserFetchBooking } from "../hooks/useUserFetchingBooking";
import { useUserProfile } from "../hooks/useFetchingUserProfile";
import { useNavigate, useParams } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";

import { AuthContext } from "../contexts/authContext";
import { getPublicUrl } from "../utils/supabaseAssetsStorage";
import { useSubmitReview } from "../hooks/useSubmitReview";

/**
 * ReviewPage for the guest review of the room.
 * This is just a version with dummy data, and the next step
 * would be that of creating a 'reviews' table in supabase and
 * wire up this page to it.
 */
const ReviewPage: React.FC = () => {
  // Extracting the id
  // https://reactrouter.com/api/hooks/useParams
  const { id } = useParams();

  // Navigation helper for redirecting after successful submission
  const navigate = useNavigate();

  // We retrieve the user auth.users from supabase
  const auth = useContext(AuthContext);
  const { user } = auth || {};

  /**
   * Fetch the booking details using React Query.
   * This provides booking.check_in, booking.check_out, booking.room_id, etc.
   */
  const { data: booking, isLoading, error } = useUserFetchBooking(id);
  // We fetch the room id
  const { data: room } = useUserFetchRoom(booking?.room_id);
  // Here we fetch the user who made the booking
  const { data: profile } = useUserProfile(booking?.user_id);

  /**
   * Local UI state for the review form.
   * Rating defaults to 0, comment to an empty string.
   */
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  // Controls visibility of the success snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Stores the text that will appear inside the Snackbar
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Spinner before redirect
  const [redirectLoading, setRedirectLoading] = useState(false);

  /**
   * React Query mutation hook for submitting a review.
   * On success, it invalidates ["reviews"] so any review lists refresh.
   */
  const submitReviewMutation = useSubmitReview();

  /**
   * Handles the review submission using the React Query mutation hook
   * useSubmitReview()
   */
  const handleSubmit = () => {
    if (!booking || !room || !user) return;
    if (!rating || !comment.trim()) {
      setSnackbarMessage("Please provide both rating and comment.");
      setSnackbarOpen(true);
      return;
    }

    submitReviewMutation.mutate(
      {
        booking_id: booking.id,
        room_id: room.id,
        user_id: user?.id,
        rating,
        comment,
      },
      {
        onSuccess: () => {
          setSnackbarMessage("Review submitted!");
          setSnackbarOpen(true);
          // It holds up the snackbar for 1.5 secs
          setTimeout(() => {
            // Then it spins for 1.2 secs before redirecting
            setRedirectLoading(true);
            setTimeout(() => {
              navigate("/account/mytrips");
            }, 1200);
          }, 1500);
        },
        onError: (err: any) => {
          if (
            err.message.includes("duplicate") ||
            err.message.includes("unique")
          ) {
            setSnackbarMessage(
              "You have already submitted a review for this stay.",
            );
          } else {
            setSnackbarMessage(
              "Something went wrong while submitting your review.",
            );
          }
        },
      },
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
        <Typography color="error">Failed to load reviews</Typography>
      </Container>
    );
  }

  if (!booking || !room)
    return <Alert severity="error">Booking or room not found.</Alert>;

  if (redirectLoading) {
    return (
      <Container sx={{ mt: 10, textAlign: "center" }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Redirecting…</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 1, mb: 12 }}>
      <Typography variant="h3" component={"h1"}>
        Hello <strong>{user?.first_name}</strong>!
      </Typography>
      <Typography variant="h5" component={"h2"} sx={{ mb: 8, fontWeight: 300 }}>
        Account <strong>#{user?.id.slice(-8)}</strong>
      </Typography>

      {/**
       * Main layout
       * 2 columns using a responsive grid:
       *  - 1 column on mobile
       *  - 2 columns on desktop
       * https://mui.com/system/grid/#css-grid-layout
       **/}
      <Box
        display="grid"
        gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
        columnGap={6}
        rowGap={6}
      >
        {/* Left column */}
        <Box>
          <Box
            component="img"
            src={
              /**
               * The uploaded image path is like 'rooms/a77ddc44-0a5e-4585-b4e7-5b61cb2865d3/1770573915402-DruidsRest2.jpg',
               * as per 'const filePath = `rooms/${roomId}/${Date.now()}-${safeName}`;' in the adminRoomsPage.tsx file.
               * Hence, we are saying below, that if 'img' does include 'rooms/' in its path, that mean it has been uploaded by
               * the admin and will show the uploaded path. Otherwise, it will enable the old image path display, whose
               * image was originally manually uploaded straight into supabase
               */
              room.images?.[0]?.includes("rooms/")
                ? getPublicUrl(room.images[0]) // New uploaded images
                : getPublicUrl(`rooms/${room.id}/${room.images[0]}`) // Old seeded images
            }
            alt={room.name}
            sx={{
              width: "100%",
              borderRadius: 2,
              objectFit: "cover",
              boxShadow: 2,
            }}
          />

          <Typography sx={{ mt: 3 }}>
            <strong>Reservation Number:</strong> #{booking.id.slice(-12)}
          </Typography>

          <Typography sx={{ mb: "3.5%" }}>
            <strong>Stay:</strong> from {booking.check_in} to{" "}
            {booking.check_out}.
          </Typography>
          <Typography sx={{ mb: "5%", color: "text.primary" }}>
            We were delighted to have you stay in{" "}
            <MuiLink
              component={RouterLink}
              to={`/booking-confirmation/${booking.id}`}
              sx={{
                textDecoration: "none",
                color: "#000000de",
                "&:hover": { color: "#E26D5C" },
              }}
            >
              <strong>{room.name} → </strong>
            </MuiLink>
            and we would really be glad to know more about your journey
            experience with us!
          </Typography>
        </Box>

        {/**
         * Right column
         * */}
        <Box>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h5" sx={{ mb: 2 }}>
                Tell us about your stay in {room.name} 😀
              </Typography>

              <Typography>
                Guest: <strong>{user?.first_name}</strong>
              </Typography>

              <Typography sx={{ mb: 2 }}></Typography>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" mb={1}>
                  Your Rating
                </Typography>
                <Rating
                  value={rating}
                  onChange={(_, value) => setRating(value ?? 0)}
                  size="large"
                />
              </Box>

              <TextField
                label="Your Comment"
                multiline
                rows={4}
                fullWidth
                sx={{ mb: 3 }}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />

              <Button
                variant="contained"
                color="secondary"
                fullWidth
                sx={{
                  mb: 1,
                  backgroundColor: "#E26D5C",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#c95b4d",
                  },
                }}
                onClick={handleSubmit}
              >
                Submit Review
              </Button>

              <Button
                fullWidth
                onClick={() => navigate("/account/mytrips")}
                color="error"
              >
                Cancel
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Box>
      {/* https://mui.com/material-ui/react-snackbar/ */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Container>
  );
};

export default ReviewPage;

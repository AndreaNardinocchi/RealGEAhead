import React from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Rating,
} from "@mui/material";

/**
 * ReviewPage for the guest review of the room.
 * This is just a version with dummy data, and the next step
 * would be that of creating a 'reviews' table in supabase and
 * wire up this page to it.
 */
const ReviewPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 10 }}>
      <Typography variant="h3">
        Hello <strong>Guest</strong>
      </Typography>

      <Typography variant="h5" sx={{ mb: 6, fontWeight: 300 }}>
        Account <strong>#12345678</strong>
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
            src="https://via.placeholder.com/600x400"
            alt="Room"
            sx={{
              width: "100%",
              borderRadius: 2,
              objectFit: "cover",
              boxShadow: 2,
            }}
          />

          <Typography sx={{ mt: 3 }}>
            <strong>Reservation Number:</strong> #ABC123456789
          </Typography>

          <Typography sx={{ mt: 1 }}>
            <strong>Stay:</strong> from 2025-01-01 to 2025-01-05
          </Typography>

          <Typography sx={{ mt: 2 }}>
            We were delighted to have you stay in <strong>Room Name</strong>.
            We’d love to hear about your experience!
          </Typography>
        </Box>

        {/**
         * Right column
         * */}
        <Box>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h5" sx={{ mb: 2 }}>
                Tell us about your stay 😀
              </Typography>

              <Typography sx={{ mb: 2 }}>
                Guest: <strong>Guest Name</strong>
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Your Rating
                </Typography>
                {/* https://mui.com/material-ui/react-rating/ */}
                <Rating value={0} />
              </Box>
              <TextField
                label="Your Comment"
                multiline
                rows={4}
                fullWidth
                sx={{ mb: 3 }}
              />
              <Button
                variant="contained"
                fullWidth
                sx={{
                  mb: 1,
                  backgroundColor: "#E26D5C",
                  color: "#fff",
                  "&:hover": { backgroundColor: "#c95b4d" },
                }}
              >
                Submit Review
              </Button>

              <Button fullWidth color="error">
                Cancel
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Container>
  );
};

export default ReviewPage;

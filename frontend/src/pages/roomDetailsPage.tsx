import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Alert,
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  CircularProgress,
} from "@mui/material";

/**
 * This will be the page where all the room details and image gallery
 * will be displayed, and from which users can make a reservation.
 */

const RoomDetailsPage: React.FC = () => {
  /**
   * Extract roomId from the URL.
   * React Router useParams:
   * https://reactrouter.com/en/main/hooks/use-params
   */
  const { roomId } = useParams<{ roomId: string }>();

  const navigate = useNavigate();
  const location = useLocation();

  /**
   * Extract query params (checkIn, checkOut, guests)
   * URLSearchParams docs:
   * https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
   */
  const params = new URLSearchParams(location.search);
  const paramCheckIn = params.get("checkIn") || "";
  const paramCheckOut = params.get("checkOut") || "";
  const paramGuests = Number(params.get("guests")) || 1;

  //Local state for date + guest selection
  const [checkIn, setCheckIn] = useState<string>(paramCheckIn);
  const [checkOut, setCheckOut] = useState<string>(paramCheckOut);
  const [guests, setGuests] = useState<number>(paramGuests);

  // Error message for UI
  const [error, setError] = useState<string | null>(null);

  /**
   * The below Room object is just a placeholder, as the real data will be fetched and cached from
   * supabase
   */
  const room = {
    id: roomId,
    name: "Sample Room",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    price: 150,
    capacity: 4,
    amenities: ["WiFi", "TV", "Air Conditioning"],
  };

  // Fake availability data, as it always returns this room as "available"
  const availability = [{ id: roomId }];

  // No error state since we're not fetching from an API
  const availabilityError = false;

  /**
   * Update page title when room data loads.
   * React useEffect docs:
   * https://react.dev/reference/react/useEffect
   */
  useEffect(() => {
    if (room) {
      document.title = `${room.name}'s Details Page | GuestEase`;
    }
  }, [room]);

  if (!room) {
    return <Alert severity="error">Room not found.</Alert>;
  }

  if (availabilityError) {
    return <Alert severity="error">Error loading availability.</Alert>;
  }

  /*
   * HandleBook validates dates, it checks availability
   */
  const handleBook = () => {
    if (!checkIn || !checkOut) {
      setError("Please select valid dates before booking.");
      return;
    }

    /**
     * 'The some() method of Array instances returns true if it finds one element in the array
     * that satisfies the provided testing function. Otherwise, it returns false.'
     * In this case, we are expecting to fing the room 'id'.
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some
     */
    const isAvailable = availability?.some((r: any) => r.id === room.id);

    if (!isAvailable) {
      setError("This room is not available for the selected dates.");
      return;
    }
    <CircularProgress />;

    /**
     * Alert placeholder to confirm booking
     */

    alert(`Look at you, You just booked ${room.name}`);
  };

  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: { xs: 240, md: 360 },
          mb: 3,
        }}
      >
        <Box
          component="img"
          src="https://placehold.co/1200x600"
          alt="Room placeholder"
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: 1,
          }}
        />
      </Box>

      <Container maxWidth="lg">
        {/* We will show the error on top of the page */}
        {error && (
          <Alert severity="error" sx={{ my: 2 }}>
            {error}
          </Alert>
        )}

        <Card sx={{ p: 2, mb: 4 }}>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              {room.name}
            </Typography>

            <Typography variant="body1" sx={{ mb: 2 }}>
              {room.description}
            </Typography>

            <Typography variant="h6" sx={{ mb: 2 }}>
              €{room.price} / night
            </Typography>

            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Max Guests: {room.capacity}
            </Typography>

            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Amenities: {room.amenities.join(", ")}
            </Typography>

            <Box sx={{ display: "flex", gap: 2, my: 2 }}>
              <TextField
                type="date"
                label="Check In"
                // Ensures label stays above the
                // https://mui.com/x/common-concepts/custom-components/
                slotProps={{ inputLabel: { shrink: true } }}
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
              />
              <TextField
                type="date"
                label="Check Out"
                slotProps={{ inputLabel: { shrink: true } }}
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
              />
              <TextField
                type="number"
                label="Guests"
                slotProps={{
                  inputLabel: { shrink: true },
                  input: {
                    // We set 'min' ad 'max' number of guests
                    // https://mui.com/material-ui/api/input/
                    inputProps: {
                      min: 1,
                      max: room.capacity,
                    },
                  },
                }}
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
              />
            </Box>

            <Button variant="contained" onClick={handleBook}>
              Book Now
            </Button>
          </CardContent>
        </Card>
      </Container>
    </>
  );
};

export default RoomDetailsPage;

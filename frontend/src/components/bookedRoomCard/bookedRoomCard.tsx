import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Link as MuiLink,
  Divider,
  Box,
  Button,
  Stack,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { getPublicUrl } from "../../utils/supabaseAssetsStorage";
import { calculateNumberOfNights } from "../../utils/calculateNumberOfNights";

interface BookingCardProps {
  booking: any;
  room: any;
  handleUpdate: (booking: any) => void;
  /**
   * Typescript function to the delete confirmation dialog for a specific booking.
   * Receives the booking object that the user intends to cancel.
   * https://tanstack.com/query/latest/docs/framework/react/guides/mutations
   */
  setDeleteOpen: (booking: any) => void;
}

const BookedRoomCard: React.FC<BookingCardProps> = ({
  booking,
  room,
  handleUpdate,
  setDeleteOpen,
}) => {
  // Using the util calculateNumberOfNights.ts
  const nights = calculateNumberOfNights(booking.check_in, booking.check_out);

  console.log("Booking:", booking);

  // Creating a variable for today's date
  const today = new Date();
  const checkIn = new Date(booking.check_in);

  /**
   * We implement a rule that won't enable to user to cancel a reservation after 24h
   * away from the check-in. Hence, we first calculate the cutoff period from the check-in
   * */
  const cutoff = new Date(checkIn.getTime() - 24 * 60 * 60 * 1000);

  // We then create a boolean variable canCancel that can be true or false
  // If true, the user can cancel, if false the cancel button will be grey and disanled
  const canCancelUpdate = today < cutoff;

  console.log("canCancel: ", canCancelUpdate);

  return (
    <Card
      elevation={4}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      <CardMedia
        component="img"
        image={getPublicUrl(`/rooms/${booking.room_id}/${room.images[0]}`)}
        alt={room?.name || "Room"}
        sx={{
          height: 200,
          objectFit: "cover",
        }}
      />

      <CardContent
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          padding: "7%",
        }}
      >
        <Typography variant="h6" sx={{ color: "#472d30", fontWeight: "bold" }}>
          <MuiLink
            component={RouterLink}
            to={`/room/${booking.room_id}`}
            sx={{
              textDecoration: "none",
              color: "#472d30",
              "&:hover": { color: "#e26d5c" },
            }}
          >
            Room: {room?.name || `Room ${booking.room_id.slice(0, 6)}`}
          </MuiLink>
        </Typography>
        <Divider
          sx={{
            borderColor: "#ccc",
            borderBottomWidth: 1,
            width: "70%",
            my: 1.5,
            mx: "auto",
          }}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            gap: { xs: 0, sm: 1, md: 2 },
          }}
        >
          {/* Left column */}
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: "0.8rem" }}
            >
              <strong>Reservation:</strong>
              <MuiLink
                component={RouterLink}
                to={`/booking-confirmation/${booking.id}`}
                sx={{
                  textDecoration: "none",
                  color: "#472d30",
                  "&:hover": { color: "#e26d5c" },
                }}
              >
                #{booking.id.slice(-12)}
              </MuiLink>
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: "0.8rem" }}
            >
              <strong>Check-in: </strong> {booking.check_in}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: "0.8rem" }}
            >
              <strong>Check-out: </strong> {booking.check_out}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: "0.8rem" }}
            >
              <strong>Guests:</strong> {booking.guests}
            </Typography>
          </Box>

          {/* Right column */}
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: "0.8rem" }}
            >
              <strong>Price:</strong> €{room?.price.toFixed(2)}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: "0.8rem" }}
            >
              <strong>Total nights:</strong> {nights}
            </Typography>
            {/* {booking && ( */}
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: "0.8rem" }}
            >
              <strong>Total price:</strong> €{booking.total_price.toFixed(2)}
            </Typography>
          </Box>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 1, fontSize: "0.8rem" }}
        >
          Booked on: {new Date(booking.created_at || "").toLocaleDateString()}
        </Typography>
        {/* 
        Stack is a container component for arranging elements vertically or horizontally. 
        https://mui.com/material-ui/react-stack/
        */}
        <Stack direction="row" spacing={2} sx={{ mt: "auto", pt: 2 }}>
          <Button
            variant="contained"
            // The button will be disabled when the canCancelUpdate condition is not met
            disabled={!canCancelUpdate}
            // We call in the handleUpdate() function
            onClick={() => handleUpdate(booking)}
            sx={{
              backgroundColor: "#472d30",
              color: "#fff",
              "&:hover": { backgroundColor: "#E26D5C" },
              px: 5,
            }}
          >
            Update
          </Button>
          <Button
            variant="contained"
            // The button will be disabled when the canCancelUpdate condition is not met
            disabled={!canCancelUpdate}
            sx={{
              // mb: 3,
              ml: 2,
              backgroundColor: "#e26d5c",
              "&:hover": { bgcolor: "red" },
              px: 5,
            }}
            // We call in the setDeleteOpen() function and passing in the booking argument
            onClick={() => setDeleteOpen(booking)}
          >
            Cancel
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default BookedRoomCard;

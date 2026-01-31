import React, { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { RoomDetailsCardProps } from "../../types/interfaces";
import AlertDialogSlide from "../roomStayPolicyModal/roomStayPolicyModal";
import PaymentDialog from "../stripeCheckOutModal/stripeCheckOutModal";

/**
 * RoomDetailsCard Component is used in the Room Details page, and it
 * displays the following items:
 * - Room title, description, capacity, price
 * - Check-in / Check-out date pickers
 * - Guest selector
 * - Amenities list
 * - 'Book Now' button
 */

/**
 * Here we pass through the RoomDetailsCardProps from the interface.ts
 */
const RoomDetailsCard: React.FC<RoomDetailsCardProps> = ({
  room,
  guests,
  checkIn,
  checkOut,
  setGuests,
  setCheckIn,
  setCheckOut,
  onBook,
}) => {
  /**
   * Generate today's date in YYYY-MM-DD format
   * Date.toISOString():
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString
   */
  const today = new Date().toISOString().split("T")[0];

  // useState to manage the roomStayPolicyModal
  const [policyOpen, setPolicyOpen] = useState(false);

  const [stripeTestOpen, setStripeTestOpen] = useState(false);

  /**
   * The are the callbacks to handle the opening and closing of the modal
   * https://stackoverflow.com/questions/73752294/react-usestate-boolean-issue-functional-component
   */
  const handleOpenPolicy = () => setPolicyOpen(true);
  const handleClosePolicy = () => setPolicyOpen(false);

  const handleStripeModalOpen = () => setStripeTestOpen(true);
  const handleStripeModalClose = () => setStripeTestOpen(false);

  return (
    <Box
      sx={{
        p: 3,
        display: "flex",
        flexDirection: "column",
        mb: 8,
      }}
    >
      {/* Room Title */}
      <Typography
        variant="h4"
        gutterBottom
        component="h1"
        sx={{ fontWeight: "bold", mb: 3, mt: 2 }}
      >
        <strong>{room.name}</strong>
      </Typography>
      {/* Room Description */}
      <Typography variant="body1" gutterBottom sx={{ mb: 2 }}>
        {room.description}
      </Typography>
      <Typography
        variant="body1"
        gutterBottom
        sx={{
          mb: 5,
          cursor: "pointer",
          fontSize: "0.85rem",
          fontWeight: 550,
          "&:hover": { color: "#e26d5c" },
        }}
        onClick={handleOpenPolicy}
      >
        Check the GuestEase stay policy →
      </Typography>
      {/* Outer Gris: Left column + Right column */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 2,
        }}
      >
        {/* Left column */}
        <Box sx={{ mb: 4 }}>
          {/* Inner Grid: Capacity + Price */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(2, auto)",
              columnGap: 3,
              rowGap: 1,
              mb: 3,
              alignItems: "start",
            }}
          >
            {/* Capacity */}
            <Box>
              <Typography variant="body1" color="text.secondary">
                Capacity:
                <br />
                <span style={{ color: "#000000de" }}>
                  {room.capacity} Guests (max)
                </span>
              </Typography>
            </Box>

            {/* Price */}
            <Box>
              <Typography variant="body1" color="text.secondary">
                Price:
                <br />
                <span style={{ color: "#000000de" }}>
                  {room.price} Euro / night
                </span>
              </Typography>
            </Box>
          </Box>

          {/* Check-in  and Check-out */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 2,
            }}
          >
            <TextField
              label="Check In"
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              fullWidth
              /** slotProps property.
               * https://mui.com/material-ui/api/menu/#props
               * https://mui.com/material-ui/api/menu/#slots
               * */
              slotProps={{
                input: {
                  inputProps: { min: today },
                },
                inputLabel: { shrink: true },
              }}
            />

            <TextField
              label="Check Out"
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              fullWidth
              slotProps={{
                input: {
                  inputProps: { min: checkIn || today },
                },
                inputLabel: { shrink: true },
              }}
            />
          </Box>

          {/* Guests + Book button */}
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Guests"
              type="number"
              value={guests}
              onChange={(e) => {
                const value = Number(e.target.value);
                // We avoid the user selecting more than the room's capacity
                if (value <= room.capacity) {
                  setGuests(value);
                }
              }}
              fullWidth
              sx={{ mb: 2 }}
              slotProps={{
                input: {
                  inputProps: { min: 1 },
                },
              }}
            />

            <Button
              variant="contained"
              sx={{
                backgroundColor: "#472d30",
                color: "#fff",
                "&:hover": { backgroundColor: "#e26d5c" },
              }}
              fullWidth
              onClick={onBook}
            >
              Book Now
            </Button>

            <Button
              variant="contained"
              sx={{
                backgroundColor: "#472d30",
                color: "#fff",
                "&:hover": { backgroundColor: "#e26d5c" },
              }}
              fullWidth
              onClick={handleStripeModalOpen}
            >
              Payment Testing
            </Button>
          </Box>
        </Box>

        {/* Right column: Amenities */}
        <Box sx={{ width: "100%", pl: { md: 35 }, boxSizing: "border-box" }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ mt: 0, mb: 1, lineHeight: 1.2 }}
          >
            Available Services
          </Typography>

          <ul style={{ paddingLeft: 0, margin: 0, listStyle: "none" }}>
            {room.amenities.map((service: string, idx: number) => (
              <li
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 2,
                }}
              >
                <CheckCircleIcon sx={{ mr: 1, color: "#472d30" }} />
                <Typography variant="body2">{service}</Typography>
              </li>
            ))}
          </ul>
        </Box>
      </Box>
      <AlertDialogSlide open={policyOpen} onClose={handleClosePolicy} />
      <PaymentDialog open={stripeTestOpen} onClose={handleStripeModalClose} />
    </Box>
  );
};

export default RoomDetailsCard;

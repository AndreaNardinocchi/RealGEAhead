import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Slide,
} from "@mui/material";
import { BookingModalProps } from "../../types/interfaces";
import { getRoomName } from "../../utils/getRoomName";
import { TransitionProps } from "@mui/material/transitions";

/**
 * This is a nice transition effect we were eager to try out,
 * and worked out well.
 * https://mui.com/material-ui/react-dialog/#transitions
 */
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AdminBookingModal: React.FC<BookingModalProps> = ({
  open,
  onClose,
  onSave,
  rooms,
  editingBooking,
  bookingForm,
  setBookingForm,
}) => {
  /**
   * Generate today's date in YYYY-MM-DD format
   * Date.toISOString():
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString
   */
  const today = new Date().toISOString().split("T")[0];

  /**
   * Compute the minimum allowed check-out date.
   * If check-in is selected, next day after check-in is
   * the minimum allowed date possible.
   * If not, then, 'tomorrow'
   * */
  const nextDayAfterCheckIn = bookingForm.check_in
    ? new Date(
        new Date(bookingForm.check_in).setDate(
          new Date(bookingForm.check_in).getDate() + 1,
        ),
      )
        .toISOString()
        .split("T")[0]
    : null;

  // We get the selected room using the find() function...
  const selectedRoom = rooms.find((r) => r.id === bookingForm.room_id);

  // ...and we set the max capacity
  const maxGuests = selectedRoom?.capacity || 1;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{ paper: { sx: { mx: 2 } } }}
      slots={{ transition: Transition }}
    >
      <DialogTitle>
        {editingBooking ? "Update Booking" : "Create Booking"}
      </DialogTitle>

      <DialogContent>
        <InputLabel id="rooms">Rooms</InputLabel>
        <Select
          labelId="Room ID"
          value={bookingForm.room_id}
          fullWidth
          displayEmpty
          renderValue={(value) =>
            value ? value : <span style={{ color: "#aaa" }}>Rooms</span>
          }
          onChange={(e) =>
            setBookingForm({ ...bookingForm, room_id: e.target.value })
          }
        >
          {rooms.map((r) => (
            <MenuItem key={r.id} value={r.id}>
              {getRoomName(r.id, rooms)}
            </MenuItem>
          ))}
        </Select>

        {!editingBooking && (
          <TextField
            margin="dense"
            label="User Email"
            fullWidth
            value={bookingForm.user_email}
            onChange={(e) =>
              setBookingForm({ ...bookingForm, user_email: e.target.value })
            }
          />
        )}

        <TextField
          margin="dense"
          type="date"
          label="Check-in"
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
          value={bookingForm.check_in}
          onChange={(e) =>
            setBookingForm({ ...bookingForm, check_in: e.target.value })
          }
        />

        <TextField
          margin="dense"
          type="date"
          label="Check-out"
          fullWidth
          slotProps={{
            input: {
              inputProps: { min: nextDayAfterCheckIn },
            },
            inputLabel: { shrink: true },
          }}
          value={bookingForm.check_out}
          onChange={(e) =>
            setBookingForm({ ...bookingForm, check_out: e.target.value })
          }
        />

        <TextField
          margin="dense"
          type="number"
          label="Guests"
          fullWidth
          value={bookingForm.guests}
          onChange={(e) => {
            const value = Number(e.target.value);
            // Prevent exceeding capacity
            if (value > maxGuests) return;
            setBookingForm({ ...bookingForm, guests: e.target.value });
          }}
        />
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onClose}
          sx={{
            color: "#472d30",
            "&:hover": { color: "#E26D5C" },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={onSave}
          sx={{
            backgroundColor: "#472d30",
            color: "#fff",
            "&:hover": { backgroundColor: "#E26D5C" },
            px: 5,
          }}
        >
          {/* This very same modal will be used for updates too */}
          {editingBooking ? "Update Booking" : "Create Booking"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AdminBookingModal;

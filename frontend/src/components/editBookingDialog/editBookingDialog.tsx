import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Slide,
  Typography,
} from "@mui/material";
import { useAvailableRooms } from "../../hooks/useAvailableRooms";
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

interface EditBookingDialogProps {
  open: boolean;
  booking: any | null;
  room: any;
  onClose: () => void;
  onSave: (updatedBooking: any) => void;
  setBooking: React.Dispatch<React.SetStateAction<any | null>>;
}

const EditBookingDialog: React.FC<EditBookingDialogProps> = ({
  open,
  booking,
  room,
  onClose,
  onSave,
  setBooking,
}) => {
  if (!booking) return null;

  // Define today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  /**
   * Compute the minimum allowed check-out date.
   * If check-in is selected next day after check-in is
   * the minimum allowed date possible.
   * If not, then, 'tomorrow'
   * */
  const nextDayAfterCheckIn = booking.check_in
    ? new Date(
        new Date(booking.check_in).setDate(
          new Date(booking.check_in).getDate() + 1,
        ),
      )
        .toISOString()
        .split("T")[0]
    : null;

  console.log("CAPACITY:", room.capacity);

  /**
   * If the user selects a check in date beyond the check out one,
   * an error helper will dispaly in the modal
   */
  const checkInDate = new Date(booking.check_in);
  const checkOutDate = new Date(booking.check_out);
  const dateError = checkInDate >= checkOutDate;

  const { data: availableRooms } = useAvailableRooms(
    booking.check_in,
    booking.check_out,
    booking.guests,
    /**
     * Fetching the booking id to exclude when checking the room availabilty for the booking updates.
     * If we do not exclude it, the modal will show the overlapError at any time.
     * We want it to only show when there is an overlap indeed wit any other bookings in place.
     * */
    booking.id,
  );

  // Here we tech the room id of our booked room to check its availability
  const roomIsAvailable =
    availableRooms?.some((r: any) => r.id === room.id) ?? true;

  // If the room is not available, we raise the overlapError
  const overlapError = !roomIsAvailable;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slots={{ transition: Transition }}
    >
      <DialogTitle>Edit Booking</DialogTitle>

      <DialogContent>
        <TextField
          margin="dense"
          label="Check-in"
          type="date"
          fullWidth
          value={booking.check_in}
          onChange={(e) =>
            setBooking((prev: any) => ({
              ...prev,
              check_in: e.target.value,
            }))
          }
          slotProps={{
            inputLabel: { shrink: true },
            htmlInput: { min: today },
          }}
          // https://stackoverflow.com/questions/71168362/unable-to-display-helper-text-in-mui-x-date-picker-when-using-along-with-react-h
          // https://m2.material.io/components/text-fields/flutter#theming-text-fields
          error={overlapError || dateError}
          helperText={
            overlapError
              ? "This room is already booked for these dates"
              : dateError
                ? "Check-in must be before check-out"
                : ""
          }
        />

        <TextField
          margin="dense"
          label="Check-out"
          type="date"
          fullWidth
          value={booking.check_out}
          onChange={(e) =>
            setBooking((prev: any) => ({
              ...prev,
              check_out: e.target.value,
            }))
          }
          slotProps={{
            inputLabel: { shrink: true },
            htmlInput: { min: nextDayAfterCheckIn },
          }}
          // https://stackoverflow.com/questions/71168362/unable-to-display-helper-text-in-mui-x-date-picker-when-using-along-with-react-h
          // https://m2.material.io/components/text-fields/flutter#theming-text-fields

          error={overlapError || dateError}
          helperText={
            overlapError
              ? "This room is already booked for these dates"
              : dateError
                ? "Check-in must be before check-out"
                : ""
          }
        />

        <TextField
          margin="dense"
          label="Guests"
          type="number"
          fullWidth
          value={booking.guests}
          onChange={(e) => {
            // 'value' will return the smalles between what the user type and the room capacity
            // This is done to avoid exceeding the room capacity
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/min
            const value = Math.min(Number(e.target.value), room.capacity);
            setBooking((prev: any) => ({ ...prev, guests: value }));
          }}
          slotProps={{
            htmlInput: { min: 1, max: room.capacity },
          }}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} sx={{ color: "#472d30" }}>
          Cancel
        </Button>

        <Button
          onClick={() => onSave(booking)}
          variant="contained"
          // By disabling the button in case of any errors, we prevent overlapping and so on
          // https://stackoverflow.com/questions/76068707/disabling-a-material-ui-button-when-there-is-no-value
          // https://mui.com/material-ui/react-button/
          disabled={overlapError || dateError}
          sx={{ backgroundColor: "#472d30", "&:hover": { bgcolor: "#e26d5c" } }}
        >
          Save
        </Button>
      </DialogActions>
      <Typography
        sx={{ p: 1, px: 3, pb: 2, fontSize: "0.85rem" }}
        color="text.secondary"
      >
        *Your payment process will be updated as well to reflect the latest
        changes.
      </Typography>
    </Dialog>
  );
};

export default EditBookingDialog;

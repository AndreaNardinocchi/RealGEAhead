import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";

/**
 * This component has been created for deletion of users and bookings.
 * It should be fully reusable.
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

/**
 * Controls whether the dialog is visible, hence, the parent owns this state.
 * onClose: Called when the user cancels or closes the dialog.
 * onConfirm: Called when the user confirms the destructive action (e.g., delete).
 * It can be reusable for:
 * - deleting a user account
 * - deleting a booking
 * - deleting a room
 * - confirming any irreversible action
 */
export default function AlertDialogSlide({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog
      open={open}
      slots={{
        transition: Transition,
      }}
      keepMounted
      onClose={onClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>Are you sure you want to delete your account?</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          ** THIS ACTION IS IRREVERSIBLE **
          <br />
          To be able to delete your account, you must not have any active
          reservations!
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="error" onClick={onConfirm}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}

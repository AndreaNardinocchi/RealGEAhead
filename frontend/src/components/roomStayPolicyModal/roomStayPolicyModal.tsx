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
 * Confirmation dialog
 */

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement<any, any> },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

/**
 * This component creates a pop up / modal showing the room stay policy
 * https://mui.com/material-ui/react-dialog/
 */
export default function AlertDialogSlide({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog
      open={open}
      slots={{ transition: Transition }}
      keepMounted
      onClose={onClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>Room Stay Policy</DialogTitle>

      <DialogContent>
        <DialogContentText
          id="alert-dialog-slide-description"
          sx={{ fontSize: "0.9rem" }}
        >
          Please review the terms of your stay before continuing:
          <br />
          <br />
          ✓ Check‑in begins at 3:00 PM on the day of arrival.
          <br />
          ✓ Check‑out must be completed by 11:00 AM on the day of departure.
          <br />
          ✓ A valid government‑issued ID is required at check‑in.
          <br />
          ✓ The payment method used at booking must be presented upon arrival.
          <br />
          ✓ Guests are responsible for any damages caused during their stay.
          <br />
          ✓ Smoking is strictly prohibited inside all rooms and indoor areas.
          <br />
          ✓ Pets are permitted only in designated pet‑friendly rooms.
          <br />
          ✓ Quiet hours are enforced from 10:00 PM to 7:00 AM.
          <br />
          ✓ Cancellations are not permitted within 24 hours of check‑in.
          <br />
          ✓ Your payment process will be updated too, reflecting any changes to
          your stay.
          <br />
          <br />
          By continuing, you acknowledge and agree to these terms.
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} sx={{ color: "#472d30" }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

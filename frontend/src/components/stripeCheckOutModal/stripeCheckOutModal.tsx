import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Slide,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import StripeCheckOut from "../stripeCheckOut/stripeCheckOut";

/**
 * This is a nice transition effect we were eager to try out,
 * and worked out well.
 * https://mui.com/material-ui/react-dialog/#transitions
 */
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement<any, any> },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface PaymentDialogProps {
  open: boolean;
  onClose: () => void;
}

/**
 * This component creates a pop up / modal showing the Stripe Checkout
 * which will enable the card payment or card data saving.
 * We are still in the provess of making a final decision on the
 * payment flow.
 * https://mui.com/material-ui/react-dialog/
 */
const PaymentDialog: React.FC<PaymentDialogProps> = ({ open, onClose }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slots={{ transition: Transition }}
    >
      <DialogTitle>Payment</DialogTitle>

      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          py: 3,
        }}
      >
        <StripeCheckOut />{" "}
      </DialogContent>

      <DialogActions>
        <Button
          sx={{ color: "#472d30", "&:hover": { color: "#e26d5c" } }}
          onClick={onClose}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentDialog;

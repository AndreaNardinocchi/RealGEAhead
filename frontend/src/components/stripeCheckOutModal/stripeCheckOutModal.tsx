import React, { useEffect, useState, useContext } from "react";
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
import { createSetupIntentApi } from "../../api/user-booking-api";
import { AuthContext } from "../../contexts/authContext";
import { useUserProfile } from "../../hooks/useFetchingUserProfile";
import { savePaymentMethodApi } from "../../api/user-booking-api";

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
  /**
   * The Stripe Customer ID associated with the user.
   * This is required so the backend can create a SetupIntent
   * for the correct customer and attach the saved payment method
   * to their Stripe profile.
   * */
  customerId: string;
  /**
   * Called when Stripe successfully returns a paymentMethodId.
   * This is passed up to RoomDetailsPage, where it is handled
   * inside handlePaymentSuccessSoBookNow() to finish the booking flow.
   */
  onSuccess: (paymentMethodId: string) => void;
}

/**
 * This component creates a pop up / modal showing the Stripe Checkout
 * which will enable the card payment or card data saving.
 * We are still in the provess of making a final decision on the
 * payment flow.
 * https://mui.com/material-ui/react-dialog/
 */
const PaymentDialog: React.FC<PaymentDialogProps> = ({
  open,
  onClose,
  customerId,
  onSuccess,
}) => {
  // We retrieve the user auth.users from supabase
  const auth = useContext(AuthContext);
  const { user } = auth || {};
  // We then retrieve the 'profile' user from the 'profiles' table in supabase
  // since this is the one that has the stripe_customer_id column
  const { data: profile } = useUserProfile(user?.id);
  /**
   * Holds the client secret returned by the backend when creating a SetupIntent.
   * Stripe needs this value to securely complete the setup flow on the frontend.
   * It starts as null and is populated once the API request succeeds.
   */
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    console.log("Dialog opened:", open);
    console.log("Customer ID:", customerId);

    if (!open) return;

    // Defines an async function that will request a new SetupIntent from the backend.
    const loadSetupIntent = async () => {
      try {
        // Calls the backend stripeSetupIntentPayments.js to create a new SetupIntent
        // for this customerId
        // https://docs.stripe.com/api/setup_intents/create
        const dataSetupIntent = await createSetupIntentApi(customerId);
        console.log("SetupIntent loaded:", dataSetupIntent);
        // Stores the client secret returned by Stripe.
        // The client secret is required by Stripe.js  to confirm the SetupIntent on the frontend.
        // https://www.w3tutorials.net/blog/how-can-i-fetch-the-client-secret-in-stripe-reactjs-and-why-can-t-i-render-a-payment-form-without-it/
        setClientSecret(dataSetupIntent.clientSecret);
      } catch (err) {
        console.error("Failed to load setup intent:", err);
      }
    };
    // Immediately calls the function to fetch the SetupIntent when the dialog opens.
    loadSetupIntent();
  }, [open, customerId]);

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
        {/**
         * Render the StripeCheckOut component only after we have received a valid clientSecret from the backend.
         * The clientSecret is required by Stripe.js to securely confirm the SetupIntent.
         * When the user successfully submits their card details, Stripe returns a paymentMethodId.
         * The onSuccess callback then saves this payment method to our backend/Supabase by calling
         * the savePaymentMethodApi() in the user-booking-api.ts file, associating the card with the current user.
         * */}
        {clientSecret && (
          <StripeCheckOut
            clientSecret={clientSecret}
            onSuccess={async (paymentMethodId) => {
              await savePaymentMethodApi({
                userId: profile?.id,
                paymentMethodId,
              });
              // Notify the parent component that payment succeeded so it can create the booking now
              onSuccess(paymentMethodId);
            }}
          />
        )}
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

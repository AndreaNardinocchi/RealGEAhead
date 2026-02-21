import React, { useEffect, useState, useContext } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Slide,
  Alert,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import StripeCheckOut from "../stripeCheckOut/stripeCheckOut";
import {
  createSetupIntentApi,
  savePaymentMethodApi,
} from "../../api/user-booking-api";
import { AuthContext } from "../../contexts/authContext";
import { useUserProfile } from "../../hooks/useFetchingUserProfile";

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

  /**
   * Local UI state for error + loading
   */
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // console.log("Dialog opened:", open);
    // console.log("Stripe customer ID:", profile?.stripe_customer_id);

    if (!open || !profile?.stripe_customer_id) return;

    /**
     * Reset clientSecret when reopening the modal.
     * This prevents stale SetupIntents from being reused.
     */
    setClientSecret(null);
    setError(null);

    // Defines an async function that will request a new SetupIntent from the backend.
    const loadSetupIntent = async () => {
      try {
        // Calls the backend stripeSetupIntentPayments.js to create a new SetupIntent
        // for this customerId
        // https://docs.stripe.com/api/setup_intents/create
        const dataSetupIntent = await createSetupIntentApi(
          profile.stripe_customer_id,
        );
        console.log("SetupIntent loaded:", dataSetupIntent);

        // Stores the client secret returned by Stripe.
        // The client secret is required by Stripe.js  to confirm the SetupIntent on the frontend.
        // https://www.w3tutorials.net/blog/how-can-i-fetch-the-client-secret-in-stripe-reactjs-and-why-can-t-i-render-a-payment-form-without-it/
        setClientSecret(dataSetupIntent.clientSecret);
      } catch (err) {
        console.error("Failed to load setup intent:", err);
        setError("Failed to initialize payment. Please try again.");
      }
    };

    // Immediately calls the function to fetch the SetupIntent when the dialog opens.
    loadSetupIntent();
  }, [open, profile?.stripe_customer_id]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      slots={{ transition: Transition }}
    >
      <DialogTitle>Payment</DialogTitle>

      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          py: {
            xs: 0,
            sm: 3,
          },
        }}
      >
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/**
         * Render the StripeCheckOut component only after we have received a valid clientSecret from the backend.
         * The clientSecret is required by Stripe.js to securely confirm the SetupIntent.
         * When the user successfully submits their card details, Stripe returns a paymentMethodId.
         * The onSuccess callback then saves this payment method to our backend/Supabase by calling
         * the savePaymentMethodApi() in the user-booking-api.ts file, associating the card with the current user.
         */}
        <StripeCheckOut
          clientSecret={clientSecret}
          onSuccess={async (paymentMethodId) => {
            setLoading(true);
            setError(null);

            try {
              /**
               * Wrap backend call in try/catch so Stripe ownership errors
               * do NOT crash the modal.
               */
              await savePaymentMethodApi({
                userId: profile?.id,
                paymentMethodId,
              });

              // Notify the parent component that payment succeeded so it can create the booking now
              onSuccess(paymentMethodId);
              console.log("NEW PAYMENT METHOD:", paymentMethodId);
            } catch (err: any) {
              const msg =
                err?.response?.data?.error ||
                err?.message ||
                "Something went wrong while saving your card.";

              /**
               * Handle Stripe's ownership conflict error
               */
              if (msg.includes("belongs to a different customer")) {
                setError(
                  "This card is already associated with another account. Please add a new card.",
                );
                setLoading(false);
                return;
              }

              setError(msg);
              setLoading(false);
              return;
            }

            setLoading(false);
          }}
        />
      </DialogContent>

      <DialogActions>
        <Button
          sx={{ color: "#472d30", "&:hover": { color: "#e26d5c" } }}
          onClick={onClose}
          disabled={loading}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentDialog;

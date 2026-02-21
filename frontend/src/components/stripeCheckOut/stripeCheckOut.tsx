import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Alert,
  Button,
  Box,
  CircularProgress,
  TextField,
} from "@mui/material";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";

interface StripeCheckoutProps {
  // The client secret returned from your backend when creating a SetupIntent.
  clientSecret: string | null;
  // Receives the ID of the confirmed payment method.
  onSuccess?: (paymentMethodId: string) => void;
}

/**
 * This component will hosts the Stripe payment form.
 * https://stripe.com/docs/payments/accept-a-payment?platform=web&ui=elements
 * https://mui.com/material-ui/react-card/
 */
const StripeCheckOut: React.FC<StripeCheckoutProps> = ({
  clientSecret,
  onSuccess,
}) => {
  if (!clientSecret) return null;

  /**
   * 'The useStripe hook returns a reference to the Stripe instance passed to the Elements provider.'
   * https://docs.stripe.com/sdks/stripejs-react?ui=elements#usestripe-hook
   */
  const stripe = useStripe();
  /**
   * 'To safely pass the payment information collected by the Payment Element to the Stripe API,
   * access the Elements instance so that you can use it with stripe.confirmPayment.
   * If you use the React Hooks API, then useElements is the recommended way to access a mounted Element.
   * If you need to access an Element from a class component, use ElementsConsumer instead.'
   * https://docs.stripe.com/sdks/stripejs-react?ui=elements#useelements-hook
   */
  const elements = useElements();

  // useState to load the modal
  const [loading, setLoading] = useState(false);
  // useState for the postal code field
  const [postalCode, setPostalCode] = useState("");

  // useState to show error message to show when payment fails
  const [error, setError] = useState<string | null>(null);

  /**
   * Handles form submission and triggers the SetupIntent confirmation flow.
   * https://stripe.com/docs/payments/accept-a-payment?platform=web&ui=elements#web-submit-payment
   * https://stackoverflow.com/questions/74806761/stripe-cardelement-is-null-when-using-confirmcardpayment#74806982
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // https://docs.stripe.com/sdks/stripejs-react?ui=elements
    if (!stripe || !elements) return;

    setLoading(true);

    const card = elements.getElement(CardElement);

    if (!card) {
      setError("Card element not found");
      setLoading(false);
      return;
    }

    console.log("clientSecret:", clientSecret);

    /**
     * Confirms the SetupIntent using the card details and billing info.
     * This step securely exchanges card data with Stripe.
     * https://docs.stripe.com/js/setup_intents/confirm_card_setup#stripe_confirm_card_setup-options
     * */
    const { setupIntent, error } = await stripe.confirmCardSetup(clientSecret, {
      payment_method: {
        card,
        billing_details: { address: { postal_code: postalCode } },
      },
    });

    setLoading(false);
    // If Stripe returned an error during confirmation, surface it to the user.
    if (error) {
      setError(error.message || "Something went wrong");
      return;
    }
    /**
     * If the SetupIntent completed successfully and Stripe returned a payment method ID,
     * call onSuccess callback so the parent component can handle the next step which is
     * storing the payment method details
     */
    if (onSuccess && setupIntent.payment_method) {
      onSuccess(setupIntent.payment_method as string);
    }
  };

  return (
    <Card
      sx={{
        maxWidth: 600,
        mx: "auto",
        mt: 4,

        p: {
          xs: 0,
          sm: 2,
        },
        borderRadius: 3,
        boxShadow: 5,
        backgroundColor: "#fff",
      }}
    >
      <CardHeader
        title={
          <Typography
            variant="h6"
            component="h2"
            textAlign="center"
            sx={{ fontWeight: 600 }}
          >
            Secure Payment
          </Typography>
        }
        subheader={
          <Typography
            variant="body2"
            textAlign="center"
            sx={{ color: "text.secondary" }}
          >
            Your card details are encrypted and processed safely by Stripe.
          </Typography>
        }
      />

      <CardContent>
        {/***
         * The Stripe card element will added here
         * https://docs.stripe.com/sdks/stripejs-react#cardelement
         */}
        <form onSubmit={handleSubmit}>
          <Typography
            variant="subtitle2"
            sx={{ mb: 1, color: "text.secondary", fontWeight: 500 }}
          >
            Card Information
          </Typography>

          <Box
            sx={{
              p: 2,
              border: "1px solid #ccc",
              borderRadius: 2,
              backgroundColor: "#fafafa",
            }}
          >
            {/**
             * This is the Renders Stripe’s secure CardElement, which collects card number,
             * expiration date, and CVC inside a Stripe‑hosted iframe.
             * It keeps sensitive card data out of our application and ensures PCI compliance.
             * 'CardElement	A flexible single-line input that collects all necessary card details.'
             * https://docs.stripe.com/sdks/stripejs-react#cardelement
             * https://docs.stripe.com/sdks/stripejs-react?ui=elements
             * https://stackoverflow.com/questions/46863072/do-not-collect-zip-code-with-stripe
             * */}
            <CardElement
              options={{
                hidePostalCode: true,
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#333",
                    "::placeholder": { color: "#999" },
                  },
                },
              }}
            />
          </Box>

          <TextField
            label="Postal / ZIP code"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            fullWidth
            margin="normal"
            sx={{ mb: 2 }}
          />

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading || !stripe}
            sx={{
              py: 1.5,
              borderRadius: 2,
              backgroundColor: "#472d30",
              fontWeight: 600,
              "&:hover": { backgroundColor: "#e26d5c" },
            }}
          >
            {loading ? <CircularProgress size={26} /> : "Save Payment Method"}
          </Button>

          <Typography
            variant="caption"
            display="block"
            textAlign="center"
            sx={{ mt: 2, color: "text.secondary" }}
          >
            We never store your card number. All payments are handled securely
            by Stripe.
          </Typography>
        </form>
      </CardContent>
    </Card>
  );
};

export default StripeCheckOut;

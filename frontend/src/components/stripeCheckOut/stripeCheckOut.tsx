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

/***
 * This component will eventually host the Stripe payment form.
 * For now, it displays a placeholder UI.
 * https://stripe.com/docs/payments/accept-a-payment?platform=web&ui=elements
 * https://mui.com/material-ui/react-card/
 */
const StripeCheckOut: React.FC = () => {
  // useState to load the modal
  const [loading, setLoading] = useState(false);
  // useState for the postal code field
  const [postalCode, setPostalCode] = useState("");

  // useState to show error message to show when payment fails
  const [error, setError] = useState<string | null>(null);

  /**
   * Placeholder submit handler, which will call Stripe (SetupIntent or PaymentIntent)
   * https://stripe.com/docs/payments/accept-a-payment?platform=web&ui=elements#web-submit-payment
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulated delay to mimic async payment behaviour
    setTimeout(() => {
      setLoading(false);
      setError("Payment processing is not connected yet.");
    }, 800);
  };

  return (
    <Card
      sx={{
        maxWidth: 420,
        mx: "auto",
        mt: 4,
        p: 2,
        borderRadius: 3,
        boxShadow: 4,
      }}
    >
      <CardHeader
        title={
          <Typography variant="h6" component="h2" textAlign="center">
            Secure Payment
          </Typography>
        }
      />

      <CardContent>
        <form onSubmit={handleSubmit}>
          {/***
           * The Stripe card element will added here
           * https://docs.stripe.com/sdks/stripejs-react#cardelement
           */}
          <Box
            sx={{
              p: 2,
              border: "1px solid #ccc",
              borderRadius: 2,
              mb: 2,
              textAlign: "center",
              color: "#777",
            }}
          >
            Card input will appear here
          </Box>

          {/** Postal code input field */}
          <TextField
            label="Postal / ZIP code"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            fullWidth
            margin="normal"
          />

          {/** Error message display */}
          {error && (
            <Alert severity="error" sx={{ my: 2 }}>
              {error}
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{
              py: 1.5,
              borderRadius: 2,
              backgroundColor: "#472d30",
              color: "#fff",
              "&:hover": { backgroundColor: "#EFF5E0", color: "#472d30" },
            }}
          >
            {loading ? <CircularProgress size={26} /> : "Pay Now"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default StripeCheckOut;

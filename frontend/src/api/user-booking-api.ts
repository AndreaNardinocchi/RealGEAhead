import { supabase } from "../supabase/supabaseClient";

/**
 * This is a helper which sends a POST request to the backend to create a new booking.
 */
export const createBookingApi = async (bookingData: {
  room_id: string;
  check_in: string;
  check_out: string;
  guests: number;
  userId: string;
}) => {
  /**
   * Send the booking data to the backend.
   * The backend route is defined in Express as:
   * POST /user/create_booking
   * https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
   */
  const res = await fetch("http://localhost:3000/user/create_booking", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    /**
     * Convert the booking object into JSON before sending.
     * Express.json() on the backend will parse this automatically.
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
     */
    body: JSON.stringify(bookingData),
  });

  /**
   * Parse the JSON response from the backend.
   * If the backend returns an error, it will be included here.
   */
  const data = await res.json();

  /**
   * If the HTTP status is not in the 200–299 range,
   * throw an error so the frontend can handle it.
   * https://developer.mozilla.org/en-US/docs/Web/API/Response/ok
   */
  if (!res.ok) {
    throw new Error(data.error || "Failed to create booking");
  }

  // Return the booking data to the caller.
  return data;
};

/**
 * Update Booking
 * This is a helper which sends a POST request to the backend to update an existing booking.
 */
export const updateBookingApi = async (updateData: {
  bookingId: string;
  userId: string;
  updates: {
    room_id: string;
    check_in: string;
    check_out: string;
    guests: number;
  };
}) => {
  /**
   * Send the updated booking data to the backend.
   * The backend route is defined in Express as:
   * POST /user/update-booking
   */
  const res = await fetch("http://localhost:3000/user/update-booking", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    /**
     * Convert the update object into JSON before sending.
     * Express.json() on the backend will parse this automatically.
     */
    body: JSON.stringify(updateData),
  });

  /**
   * Parse the JSON response from the backend.
   */
  const data = await res.json();

  /**
   * If the HTTP status is not in the 200–299 range,
   * throw an error so the frontend can handle it.
   */
  if (!res.ok) {
    throw new Error(data.error || "Failed to update booking");
  }

  // Return the updated booking data to the caller.
  return data;
};

/**
 * Cancel Booking
 * This is a helper which sends a POST request to the backend to cancel an existing booking.
 */
export const cancelBookingApi = async (bookingId: string) => {
  // We first fecth the bookingId
  const { error } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", bookingId)
    .single();

  if (error) throw new Error(error.message);
  /**
   * Send the request to cancel the booking data to the backend.
   * The backend route is defined in Express as:
   * POST /user/cancel-booking
   */
  const res = await fetch("http://localhost:3000/user/cancel-booking", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    /**
     * Convert the update object into JSON before sending.
     * Express.json() on the backend will parse this automatically.
     */
    body: JSON.stringify({ bookingId }),
  });

  /**
   * Parse the JSON response from the backend.
   */
  const data = await res.json();

  /**
   * If the HTTP status is not in the 200–299 range,
   * throw an error so the frontend can handle it.
   */
  if (!res.ok) {
    throw new Error(data.error || "Failed to update booking");
  }

  // Return the updated booking data to the caller.
  return data;
};

/**
 * Create the SetupIntent API
 * This is a helper which sends a POST request to the backend to create a setup intent payment.
 * A SetupIntent is used when securely collecting and storing a customer’s payment method for future use, without
 * charging them immediately. The backend is responsible for calling Stripe’s API and returning the
 * 'client secret' needed by the frontend to complete the setup flow using
 * stripe.confirmCardSetup().
 * https://docs.stripe.com/api/setup_intents/create
 */
export const createSetupIntentApi = async (customerId: string) => {
  const res = await fetch("http://localhost:3000/create-setup-intent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    /**
     * Convert the update object into JSON before sending.
     * Express.json() on the backend will parse this automatically.
     */
    body: JSON.stringify({ customerId }),
  });

  /**
   * Parse the JSON response from the backend.
   */
  const data = await res.json();

  /**
   * If the HTTP status is not in the 200–299 range,
   * throw an error so the frontend can handle it.
   */
  if (!res.ok) {
    throw new Error(data.error || "Failed to create SetupIntent");
  }

  // Expected: { clientSecret: "seti_123_secret_abc" }
  return data;
};

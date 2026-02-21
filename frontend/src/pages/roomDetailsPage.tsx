import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Box, Alert, Container, CircularProgress } from "@mui/material";
import { supabase } from "../supabase/supabaseClient";
import { useAvailableRooms } from "../hooks/useAvailableRooms";
import { useQuery } from "@tanstack/react-query";
import { getPublicUrl } from "../utils/supabaseAssetsStorage";
import {
  createBookingApi,
  createStripeCustomerApi,
} from "../api/user-booking-api";
import RoomDetailsCard from "../components/roomDetailsCard/roomDetailsCard";
import RoomDetailsCarousel from "../components/roomDetailsCarousel/roomDetailsCarousel";
import { getRoomById } from "../api/guestease-api";
import PaymentDialog from "../components/stripeCheckOutModal/stripeCheckOutModal";
import { AuthContext } from "../contexts/authContext";
import { useUserProfile } from "../hooks/useFetchingUserProfile";
import RoomReviews from "../components/roomReviews/roomReviews";
import { useRoomReviews } from "../hooks/useRoomReviews";
import { calculateAverageRating } from "../utils/calculateAverageRating";

/**
 * This will be the page where all the room details and image gallery
 * will be displayed, and from which users can make a reservation.
 */

const RoomDetailsPage: React.FC = () => {
  // We retrieve the user auth.users from supabase
  const auth = useContext(AuthContext);
  const { user } = auth || {};
  // We then retrieve the 'profile' user from the 'profiles' table in supabase
  // since this is the one that has the stripe_customer_id column
  const { data: profile } = useUserProfile(user?.id);

  /**
   * Extract roomId from the URL.
   * React Router useParams:
   * https://reactrouter.com/en/main/hooks/use-params
   */
  const { roomId } = useParams<{ roomId: string }>();

  const navigate = useNavigate();

  const location = useLocation();

  /**
   * Extract query params (checkIn, checkOut, guests)
   * URLSearchParams docs:
   * https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
   */
  const params = new URLSearchParams(location.search);
  const paramCheckIn = params.get("checkIn") || "";
  const paramCheckOut = params.get("checkOut") || "";
  const paramGuests = Number(params.get("guests")) || 1;

  // Local state for date + guest selection
  const [checkIn, setCheckIn] = useState<string>(paramCheckIn);
  const [checkOut, setCheckOut] = useState<string>(paramCheckOut);
  const [guests, setGuests] = useState<number>(paramGuests);

  // Error message for UI
  const [error, setError] = useState<string | null>(null);

  /*
   * React Query fetches Room Details cached by roomId
   */
  const {
    data: room,
    isLoading: roomLoading,
    error: roomError,
  } = useQuery({
    queryKey: ["room", roomId],
    /**
     * React Router’s useParams() always returns 'string | undefined',
     * because the URL might not contain the param.
     * React Query’s queryFn expects a definite string, hence, we add 'as string'.
     * '...treat the value as a string type, even if it might not originally be one.'
     * https://www.webdevtutor.net/blog/typescript-as-string-vs-tostring
     */
    queryFn: async () => getRoomById(roomId as string),
    enabled: !!roomId, // Prevents running until roomId is defined
  });

  /*
   * Fetching Availability
   * Uses the custom hook useAvailableRooms which calls the Supabase RPC function.
   * https://supabase.com/docs/guides/database/functions
   */
  const { data: availability, error: availabilityError } = useAvailableRooms(
    checkIn,
    checkOut,
    guests,
  );

  /**
   * We fetch the reviews through the useRoomReviews hook
   */
  const { data: reviews = [] } = useRoomReviews(roomId as string);

  /**
   * Update page title when room data loads.
   * React useEffect docs:
   * https://react.dev/reference/react/useEffect
   */
  useEffect(() => {
    if (room) {
      document.title = `${room.name}'s Details Page | GuestEase`;
    }
  }, [room]);

  /**
   * Controls the stripeCheckOutModal payment dialog.
   * When true, the PaymentDialog component (stripeCheckOutModal) opens and begins the
   * SetupIntent: card entry and payment method saving flow.
   */
  const [stripeCheckOutModalOpen, setStripeCheckOutModalOpen] = useState(false);

  /**
   * Temporarily stores the booking details (room_id, dates, guests, userId)
   * while the user completes the Stripe payment flow.
   * Once the payment method is successfully saved, this data is used
   * to create the actual booking in the backend.
   */
  const [pendingBookingData, setPendingBookingData] = useState<any>(null);

  /*
   * HandleBook validates dates, it checks availability
   */
  const handleBook = async () => {
    if (!checkIn || !checkOut) {
      setError("Please select valid dates before booking.");
      return;
    }

    // Do not validate yet
    if (!availability) return;

    /**
     *'The some() method of Array instances returns true if it finds one element in the array
     * that satisfies the provided testing function. Otherwise, it returns false.'
     * In this case, we are expecting to fing the room 'id'.
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some
     * */
    const isAvailable = availability?.some((r: any) => r.id === room.id);
    if (!isAvailable) {
      setError("This room is not available for the selected dates.");
      return;
    }

    try {
      /**
       * To be able to book, a user must be logged in, therefore, we need
       * to retrieve the user from supabase.
       * https://supabase.com/docs/reference/javascript/auth-getuser
       * */
      const { data } = await supabase.auth.getUser();
      const userId = data.user?.id;
      if (!userId) {
        setError("You must be logged in to book a room.");
        return;
      }
      // We store the booking data temporarily until the payment flow completes.
      setPendingBookingData({
        room_id: room.id,
        check_in: checkIn,
        check_out: checkOut,
        guests,
        userId,
      });

      /**
       * We ensure the Stripe customer exists before opening the payment dialog.
       * Checks if the user already has a Stripe customer, and  creates one if they don’t,
       * and finally returns the Stripe customer ID
       * */
      await createStripeCustomerApi({ email: data.user?.email!, userId });
      // Open the Stripe payment dialog so the user can enter their card details.
      setStripeCheckOutModalOpen(true);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // This hook will clear the !isAvailable error once the user selected available dates
  useEffect(() => {
    setError(null);
  }, [checkIn, checkOut, guests]);

  /**
   * This callback is called after the user successfully completes
   * the Stripe payment flow and the payment method has been saved.
   * At this point we can safely create the booking in our backend.
   * */
  const handlePaymentSuccessSoBookNow = async (_paymentMethodId: string) => {
    try {
      if (!pendingBookingData) return;

      /**
       * We then create the booking object to be sent to the user-booking-api,
       * which in turn will post it to the userCreateBooking.js in the backend.
       * The userCreateBooking.js file in the backend will create the booking server-side
       * and send it to supabase
       * */
      const booking = await createBookingApi(pendingBookingData);
      // Close the payment dialog and clear the pending booking data.
      setStripeCheckOutModalOpen(false);
      setPendingBookingData(null);
      // Redirect to the confirmation page
      navigate(`/booking-confirmation/${booking.booking.id}`);
    } catch (err: any) {
      setError(err.message);
      setStripeCheckOutModalOpen(false);
    }
  };

  // Using the below function to get the average review rating
  const avgRating = calculateAverageRating(reviews);

  /**
   * These early returns are safe because all hooks in this component
   * are declared above them. Previously, they appeared before several
   * useState/useEffect calls, which caused React to run a different
   * number of hooks between renders and triggered a hook‑order error.
   * Now the hook order is stable:
   * 1. Hooks always run first
   * 2. These returns only affect what UI is shown
   * 3. React never sees a different hook sequence
   */
  if (roomLoading) {
    return <CircularProgress sx={{ display: "block", mx: "auto", my: 10 }} />;
  }

  if (roomError || !room) {
    return <Alert severity="error">Room not found.</Alert>;
  }

  if (availabilityError) {
    return <Alert severity="error">Error loading availability.</Alert>;
  }

  return (
    <>
      {/* Main UI only when everything is valid */}

      <>
        <Box>
          {/* This hero image will be replaced by a carousel to display all 4 room images */}
          <RoomDetailsCarousel
            images={(room.images ?? []).map(
              (img: any) =>
                /**
                 * The uploaded image path is like 'rooms/a77ddc44-0a5e-4585-b4e7-5b61cb2865d3/1770573915402-DruidsRest2.jpg',
                 * as per 'const filePath = `rooms/${roomId}/${Date.now()}-${safeName}`;' in the adminRoomsPage.tsx file.
                 * Hence, we are saying below, that if 'img' does include 'rooms/' in its path, that mean it has been uploaded by
                 * the admin and will show the uploaded path. Otherwise, it will enable the old image path display, whose
                 * image was originally manually uploaded straight into supabase
                 */
                img.includes("rooms/")
                  ? getPublicUrl(img) // New uploaded images path
                  : getPublicUrl(`rooms/${room.id}/${img}`), // old seeded images
            )}
          />
        </Box>

        <Container maxWidth="lg">
          {/* We will show the error on top of the page */}
          {error && (
            <Alert severity="error" sx={{ my: 2 }}>
              {error}
            </Alert>
          )}

          <RoomDetailsCard
            room={room}
            guests={guests}
            checkIn={checkIn}
            checkOut={checkOut}
            setGuests={setGuests}
            setCheckIn={setCheckIn}
            setCheckOut={setCheckOut}
            onBook={handleBook}
            reviews={reviews}
            avgRating={avgRating}
          />

          {/* Stripe Payment Dialog opens after validation and before booking creation */}
          <PaymentDialog
            open={stripeCheckOutModalOpen}
            onClose={() => setStripeCheckOutModalOpen(false)}
            // customerId={profile?.stripe_customer_id || ""}
            onSuccess={handlePaymentSuccessSoBookNow}
          />
          <RoomReviews roomId={roomId as string} />
        </Container>
      </>
    </>
  );
};

export default RoomDetailsPage;

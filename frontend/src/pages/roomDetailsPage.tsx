import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Box, Alert, Container, CircularProgress } from "@mui/material";
import { supabase } from "../supabase/supabaseClient";
import { useAvailableRooms } from "../hooks/useAvailableRooms";
import { useQuery } from "@tanstack/react-query";
import { getPublicUrl } from "../utils/supabaseAssetsStorage";
import { createBookingApi } from "../api/user-booking-api";
import RoomDetailsCard from "../components/roomDetailsCard/roomDetailsCard";
import RoomDetailsCarousel from "../components/roomDetailsCarousel/roomDetailsCarousel";

/**
 * This will be the page where all the room details and image gallery
 * will be displayed, and from which users can make a reservation.
 */

const RoomDetailsPage: React.FC = () => {
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

  //Local state for date + guest selection
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
    queryFn: async () => {
      /**
       * Fetch a single room from Supabase.
       * https://supabase.com/docs/reference/javascript/select
       */
      const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .eq("id", roomId)
        .single();

      if (error || !data) throw new Error("Room not found");
      return data;
    },
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
   * Update page title when room data loads.
   * React useEffect docs:
   * https://react.dev/reference/react/useEffect
   */
  useEffect(() => {
    if (room) {
      document.title = `${room.name}'s Details Page | GuestEase`;
    }
  }, [room]);

  if (roomLoading) {
    return <CircularProgress sx={{ display: "block", mx: "auto", my: 10 }} />;
  }

  if (roomError || !room) {
    return <Alert severity="error">Room not found.</Alert>;
  }

  if (availabilityError) {
    return <Alert severity="error">Error loading availability.</Alert>;
  }

  /*
   * HandleBook validates dates, it checks availability
   */
  const handleBook = async () => {
    if (!checkIn || !checkOut) {
      setError("Please select valid dates before booking.");
      return;
    }
    /**
     * 'The some() method of Array instances returns true if it finds one element in the array
     * that satisfies the provided testing function. Otherwise, it returns false.'
     * In this case, we are expecting to fing the room 'id'.
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some
     */
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
       */
      const user = await supabase.auth.getUser();
      const userId = user.data.user?.id;

      if (!userId) {
        setError("You must be logged in to book a room.");
        return;
      }

      /**
       * We then create the booking object to be sent to the user-booking-api,
       * which in turn will post it to the userBooking.js in the backend.
       * The userBooking.js file in the backend will create the booking server-side
       * and send it to supabase ....IN PROGRESS...
       */
      const booking = await createBookingApi({
        room_id: room.id,
        check_in: checkIn,
        check_out: checkOut,
        guests,
        userId,
      });

      // Redirect to a confirmation  ....IN PROGRESS...
      navigate(`/booking-confirmation/${booking.booking.id}`);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <>
      <Box>
        {/* This hero image will be replaced by a carousel to display all 4 room images */}
        {room.images.length > 0 && (
          <RoomDetailsCarousel
            images={room.images.map((img: any) =>
              getPublicUrl(`/rooms/${room.id}/${img}`),
            )}
          />
        )}
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
        />
      </Container>
    </>
  );
};

export default RoomDetailsPage;

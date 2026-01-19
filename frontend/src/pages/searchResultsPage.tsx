import {
  Alert,
  AppBar,
  Box,
  CircularProgress,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";
// https://mui.com/material-ui/material-icons/
import HotelIcon from "@mui/icons-material/Hotel";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import React, { useEffect } from "react";
import RoomHorizontalCard from "../components/roomHorizontalCard/roomHorizontalCard";
// Importing the custom react hook
import { useAvailableRooms } from "../hooks/useAvailableRooms";
import { Room } from "../types/interfaces";
import { getPublicUrl } from "../utils/supabaseAssetsStorage";
import { useLocation } from "react-router-dom";

/**
 * This is the the page where all available rooms will be shown based on
 * the search parameters checkIn, checkOut, and guests
 */
const SearchResultsPage: React.FC = () => {
  /**
   * Set page title on mount.
   * This is optional but keeps consistency with other pages.
   */
  useEffect(() => {
    document.title = "Search Results Page | GuestEase";
  }, []);

  const location = useLocation();

  /**
   * Extract URL parameters using URLSearchParams
   * https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
   */
  const params = new URLSearchParams(location.search);
  const checkIn = params.get("checkIn") || "";
  const checkOut = params.get("checkOut") || "";
  const guests = Number(params.get("guests")) || 1;

  /**
   * Basic date validation:
   * - Both dates must exist
   * - Must be valid date strings
   * - checkIn must be before checkOut
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/isNaN
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NaN
   */
  const datesAreValid =
    checkIn &&
    checkOut &&
    !isNaN(Date.parse(checkIn)) &&
    !isNaN(Date.parse(checkOut)) &&
    new Date(checkIn) < new Date(checkOut);

  /**
   * Fetch rooms using React Query hook.
   *  https://tanstack.com/query/v4/docs/framework/react/reference/useQuery
   */
  const {
    data: rooms,
    isLoading,
    error,
  } = useAvailableRooms(checkIn, checkOut, guests);

  // Loading
  if (isLoading) {
    return (
      <Container sx={{ mt: 10, textAlign: "center" }}>
        {" "}
        <Box display="flex" justifyContent="center" mt={10}>
          {" "}
          <CircularProgress />{" "}
        </Box>{" "}
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container sx={{ mt: 10, textAlign: "center" }}>
        <Alert severity="error">{String(error)}</Alert>{" "}
      </Container>
    );
  }

  //  Main content
  return (
    <>
      {/* Top App Bar indicating the search dates*/}{" "}
      <AppBar position="static" sx={{ backgroundColor: "#EFF5E0" }}>
        <Toolbar>
          <HotelIcon sx={{ mr: 1, color: "#000000de" }} />{" "}
          <Typography variant="h6" sx={{ flexGrow: 1, color: "#000000de" }}>
            Search Results
          </Typography>
          {/* Show selected dates + guests */}{" "}
          <Box display="flex" alignItems="center" gap={1}>
            {" "}
            <CalendarMonthIcon sx={{ color: "#000000de" }} />{" "}
            <Typography variant="body2" sx={{ color: "#000000de" }}>
              {checkIn} → {checkOut} ({guests} guests){" "}
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
      {/* Main Content */}
      <Container sx={{ py: 6 }}>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr", rowGap: 4 }}>
          {/* * Here we are creating an array to show a number of room cards with dummy data. 
          We established a length of 8 cards, which we then 'map'. 
          This will be replaced byt real data from supabase. 
          If rooms is null or undefined, use [] instead is needed to prevent any crash. 
          https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from 
          */}
          {(rooms ?? []).map((room: Room) => (
            <RoomHorizontalCard
              /**
               * 'key' is needed to avoid the below error:
               * 'searchResultsPage.tsx:123 Each child in a list should have a unique "key"'
               * https://stackoverflow.com/questions/59161825/react-material-ui-list-should-have-a-unique-key-prop
               */
              key={room.id}
              id={room.id}
              name={room.name}
              description={room.description}
              price={room.price}
              // Fetching the first image of the array
              // images={[getPublicUrl(`/rooms/${room.id}/${room.images[0]}`)]}
              // We are now fetching all images shown through the roomHorizontalCardCarousel
              images={room.images.map((img) =>
                getPublicUrl(`/rooms/${room.id}/${img}`),
              )}
              amenities={room?.amenities}
              checkIn={checkIn}
              checkOut={checkOut}
              guests={guests}
              capacity={Number(room.capacity)}
            />
          ))}
        </Box>
      </Container>
    </>
  );
};
export default SearchResultsPage;

/**
 * To test that the search results are accurate, I created a test user in supabase:
 * 
 * INSERT INTO auth.users (id, email)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'test@example.com'
);

I, then, manually inserted a booking:

INSERT INTO public.bookings (room_id, user_id, check_in, check_out, guests, total_price)
VALUES (
  '0c3b0837-ea23-4242-8bf9-f94bd3450f9d',  -- Clan Suite
  '00000000-0000-0000-0000-000000000001',  -- test user
  '2026-01-20',
  '2026-01-23',
  2,
  600
);

The search results work as expected!

 */

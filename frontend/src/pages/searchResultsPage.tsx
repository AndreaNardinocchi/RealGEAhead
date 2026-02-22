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
import StickyHeaderComp from "../components/stickyHeaderComp/stickyHeaderComp";
import EditSearchRoomsForm from "../components/editSearchRoomsForm/editSearchRoomsForm";
import ResponsiveBookingWrapper from "../components/responsiveSearchFormWrapper/responsiveSearchFormWrapper";
import AmenitiesFilter from "../components/amenitiesFilters/amenitiesFilters";
import { allAmenities } from "../types/interfaces";

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
   * Fetch rooms using React Query hook.
   *  https://tanstack.com/query/v4/docs/framework/react/reference/useQuery
   */
  const {
    data: rooms,
    isLoading,
    error,
  } = useAvailableRooms(checkIn, checkOut, guests);

  // State to store selected amenities from the filter component
  const [selectedAmenities, setSelectedAmenities] = React.useState<string[]>(
    [],
  );

  /**
   * Filter rooms based on selected amenities.
   * If no amenities are selected, show all rooms.
   */
  const filteredRooms =
    selectedAmenities.length === 0
      ? (rooms ?? [])
      : (rooms ?? []).filter((room: Room) =>
          /**
           * A room must contain all the amenities the user selected.
           * We use the every() method because it returns true only if
           * every selected amenity is found inside the room’s amenities list.
           * If even one selected amenity is missing, every() returns false,
           * and the room is excluded from the filtered results.
           * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every
           */
          selectedAmenities.every((amenity) =>
            room.amenities?.includes(amenity),
          ),
        );

  // Loading
  if (isLoading) {
    return (
      <Container sx={{ mt: 10, textAlign: "center" }}>
        <Box display="flex" justifyContent="center" mt={10}>
          <CircularProgress />
        </Box>
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
      {/* Top App Bar indicating the search dates*/}
      <AppBar
        position="sticky"
        sx={{ backgroundColor: "#EFF5E0", mt: 14, mb: 2, top: 0 }}
      >
        <Toolbar>
          <HotelIcon sx={{ mr: 1, color: "#000000de" }} />
          <Typography variant="h6" sx={{ flexGrow: 1, color: "#000000de" }}>
            Search Results
          </Typography>
          {/* Show selected dates + guests */}
          <Box display="flex" alignItems="center" gap={1}>
            <CalendarMonthIcon sx={{ color: "#000000de" }} />
            <Typography variant="body2" sx={{ color: "#000000de" }}>
              {checkIn} → {checkOut} ({guests} guests)
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
      <ResponsiveBookingWrapper>
        <StickyHeaderComp>
          <EditSearchRoomsForm
            initialCheckIn={checkIn}
            initialCheckOut={checkOut}
            initialGuests={guests}
          />
        </StickyHeaderComp>
      </ResponsiveBookingWrapper>
      {/* Main Content */}
      <Container sx={{ pt: 4, pb: 10 }}>
        <AmenitiesFilter
          selectedAmenities={selectedAmenities}
          setSelectedAmenities={setSelectedAmenities}
          allAmenities={allAmenities}
        />

        <Box
          sx={{ display: "grid", gridTemplateColumns: "1fr", rowGap: 4, mt: 3 }}
        >
          {/* * Here we are creating an array to show a number of room cards with dummy data. 
          We established a length of 8 cards, which we then 'map'. 
          This will be replaced byt real data from supabase. 
          If rooms is null or undefined, use [] instead is needed to prevent any crash. 
          https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from 
          */}
          {(filteredRooms ?? []).map((room: Room) => (
            <RoomHorizontalCard
              /**
               * 'key' is needed to avoid the below error:
               * 'searchResultsPage.tsx:123 Each child in a list should have a unique "key"'
               * https://stackoverflow.com/questions/59161825/react-material-ui-list-should-have-a-unique-key-prop
               */
              key={room.id}
              id={room.id}
              name={room.name}
              // Using .split(".")[0] effectively retrieves the part of the string before the first period
              // https://www.w3schools.com/python/ref_string_split.asp
              description={room.description?.split(".")[0] + "."}
              price={room.price}
              // Fetching the first image of the array
              // images={[getPublicUrl(`/rooms/${room.id}/${room.images[0]}`)]}
              // We are now fetching all images shown through the roomHorizontalCardCarousel
              images={room.images.map(
                (img) =>
                  /**
                   * The uploaded image path is like 'rooms/a77ddc44-0a5e-4585-b4e7-5b61cb2865d3/1770573915402-DruidsRest2.jpg',
                   * as per 'const filePath = `rooms/${roomId}/${Date.now()}-${safeName}`;' in the adminRoomsPage.tsx file.
                   * Hence, we are saying below, that if 'img' does include 'rooms/' in its path, that mean it has been uploaded by
                   * the admin and will show the uploaded path. Otherwise, it will enable the old image path display, whose
                   * image was originally manually uploaded straight into supabase
                   */
                  img.includes("rooms/")
                    ? getPublicUrl(img) // New uploaded images path
                    : getPublicUrl(`rooms/${room.id}/${img}`), // old seeded image
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

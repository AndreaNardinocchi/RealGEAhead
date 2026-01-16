import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  CircularProgress,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import type { Room } from "../types/interfaces";
import { getRooms } from "../api/guestease-api";
// Importing the supabase 'assets' storage function
import { getPublicUrl } from "../utils/supabaseAssetsStorage";

/**
 * The RoomsPage is a page where the user can check out all rooms, regardless of
 * whether they are available or not on the chosen booking dates
 */
const RoomsPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Our Rooms | GuestEase";
  }, []);

  /**
   * React Query is a data-fetching and caching library that simplifies working with
   * asynchronous data in React applications. Instead of manually managing loading states,
   * errors, caching, refetching, and background updates, React Query handles all of this
   * automatically. This results in cleaner components, fewer bugs, and a much smoother UX.
   * React Query v5 is the latest, actively maintained version of TanStack Query.
   * It introduces a simpler, more consistent API using a single options object:
   *
   *    useQuery({ queryKey: [...], queryFn: ... })
   *
   * https://tanstack.com/query/latest/docs/framework/react/reference/useQuery
   * https://tanstack.com/query/latest/docs/framework/react/quick-start
   * https://tanstack.com/query/latest/docs/framework/react/reference/useQuery
   */
  const { data, error, isLoading } = useQuery({
    queryKey: ["rooms"],
    queryFn: getRooms,
  });

  if (isLoading) {
    return (
      <Container sx={{ mt: 10, textAlign: "center" }}>
        <Typography>Loading rooms…</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 10, textAlign: "center" }}>
        <Typography color="error">Failed to load rooms.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: 12 }}>
      <Box textAlign="center" mb={5}>
        <Typography variant="h3" gutterBottom>
          Our Rooms
        </Typography>
        <Typography color="text.secondary">
          Choose from a variety of cozy, comfortable, and well-equipped rooms.
        </Typography>
      </Box>

      <Grid
        container
        spacing={2}
        sx={{ display: "flex", justifyContent: "space-between" }}
      >
        {/* If no data, then, run an empty array [] otherwise, 'map' the Room interface in Supabase*/}
        {(data ?? []).map((room: Room) => (
          <Box
            // The key will via the room id in Supabase the room to show in the below card
            key={room.id}
            sx={{
              width: {
                xs: "100%",
                sm: "48%",
                md: "49%",
                lg: "49%",
              },
              mb: {
                xs: 1,
                sm: 2,
                md: 3,
              },
            }}
          >
            <Card
              sx={{
                height: "100%",

                borderRadius: 3,
                boxShadow: 4,
                /**
                 * Bulge‑out hover effect
                 *
                 * https://developer.mozilla.org/en-US/docs/Web/CSS/transition
                 * https://developer.mozilla.org/en-US/docs/Web/CSS/transform
                 */
                transition: "transform 0.25s ease, box-shadow 0.25s ease",
                "&:hover": {
                  transform: "scale(1.04)",
                  boxShadow: 10,
                },
              }}
            >
              {/**
               * Room preview image
               *
               * - Uses MUI CardMedia to render the room's primary image.
               * - `component="img"` tells MUI to output a standard <img> element.
               * - `height="260"` sets a fixed display height for consistent card layout.
               * - `image` pulls the first image from the room's images array.
               * - `alt` provides accessible text for screen readers.
               */}
              <CardMedia
                component="img"
                height="260"
                /**
                 * The images of the rooms are now stored in the 'storage' section of supabase:
                 * https://supabase.com/dashboard/project/xxxxxxxxxxxxxx/storage/files/buckets/assets
                 * The folder hierarchy is '/assets/rooms/roomId/4 images per room', but we are pulling the first
                 * room only here.
                 * The 4 images will be shown in a carousel component on other pages in the nextst steps. Also,
                 * the images have now been manually uploaded to Suapabase, but the plan is that of having the 'admin'
                 * role being able to CRUD rooms.
                 * */
                image={getPublicUrl(`/rooms/${room.id}/${room.images[0]}`)}
                alt={room.name}
              />

              <CardContent sx={{ padding: 2.5 }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold" }}
                  gutterBottom
                >
                  {room.name}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    /** Enables multi‑line text truncation using the WebKit flexbox model, creating a vertical box container
                     * that allows line clamping.
                     * https://developer.mozilla.org/en-US/docs/Web/CSS/-webkit-line-clamp
                     */
                    display: "-webkit-box",
                    /**
                     * Specifies the maximum number of lines to display before truncating.
                     * https://developer.mozilla.org/en-US/docs/Web/CSS/-webkit-line-clamp
                     */
                    WebkitLineClamp: 3,
                    /**
                     * Sets the box orientation to vertical, required for line clamping to work.
                     * https://developer.mozilla.org/en-US/docs/Web/CSS/box-orient
                     */
                    WebkitBoxOrient: "vertical",
                    /**
                     * Ensures any text beyond the clamped lines is hidden instead of overflowing.
                     * https://developer.mozilla.org/en-US/docs/Web/CSS/overflow
                     */
                    overflow: "hidden",
                  }}
                >
                  {room.description}
                </Typography>

                <Typography variant="subtitle2" sx={{ pt: 3 }}>
                  {room.capacity} Guests (max) · €{room.price}/night
                </Typography>
              </CardContent>

              <CardActions
                /**
                 * 'flex-end' will make the View Details CTA align to the right
                 *
                 * https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/justify-content
                 * */
                sx={{ px: 2, pt: 0, pb: 2, justifyContent: "flex-end" }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  component={Link}
                  to={`/room/${room.id}`}
                  sx={{
                    textDecoration: "none",
                    color: "#000000de",
                    fontWeight: "bold",
                  }}
                >
                  View Details →
                </Typography>
              </CardActions>
            </Card>
          </Box>
        ))}
      </Grid>
    </Container>
  );
};

export default RoomsPage;

import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import AdminSubNav from "../components/adminSubNav/adminSubNav";
import AdminDashboardHeader from "../components/adminDashboardHeader/adminDashboardHeader";
import { getRoomName } from "../utils/getRoomName";
import { useAdminFetchingReviews } from "../hooks/useAdminFetchingReviews";
import { useAdminFetchingRooms } from "../hooks/useAdminFetchingRooms";
import { Link } from "react-router-dom";
import ReviewFilterUI from "../components/reviewFilterUI/reviewFilterUI";
import { useFilteredReviews } from "../hooks/useFilteredReviews";

/**
 * This page will show all the reviews so that the Admin can get acquainted
 * with guests' feedback on their room/stay experience
 */

const AdminReviewsPage: React.FC = () => {
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
   * */
  const { data: reviews, isLoading, error } = useAdminFetchingReviews();
  const { data: rooms } = useAdminFetchingRooms();

  // Browser title
  useEffect(() => {
    document.title = `Reviews Admin Dashboard | GuestEase`;
  });

  // We set a useState for the filters and leave the fields as empty
  const [filters, setFilters] = useState({
    search: "",
    room_id: "",
    rating: "",
    created_at: "",
  });

  // We call the filteredReviews through the hook useFilteredReviews
  const filteredReviews = useFilteredReviews(reviews, rooms, filters);

  if (isLoading) {
    return (
      <Container sx={{ mt: 10, textAlign: "center" }}>
        <Box display="flex" justifyContent="center" mt={10}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 10, textAlign: "center" }}>
        <Typography color="error">Failed to load reviews</Typography>
      </Container>
    );
  }

  if (!reviews)
    return <Alert severity="error">Booking or room not found.</Alert>;

  return (
    <>
      <AdminDashboardHeader />
      <AdminSubNav />

      <Container sx={{ pb: 8, overflow: "visible" }}>
        <Box my={4}>
          <Typography variant="h4">Reviews</Typography>
        </Box>

        <ReviewFilterUI
          filters={filters}
          setFilters={setFilters}
          rooms={rooms ?? []}
        />

        <TableContainer
          component={Paper}
          sx={{
            mb: 6,
            // overflowX: "auto" ensures horizontal scrolling on smaller screens.
            //  https://developer.mozilla.org/en-US/docs/Web/CSS/overflow-x
            overflowX: "auto",
            overflowY: "auto",
            maxHeight: {
              xs: "50vh",
              sm: "150vh",
            },
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <Table sx={{ minWidth: 900 }}>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: "#f5f5f5",
                  position: "sticky",
                  top: 0,
                  zIndex: 2,
                }}
              >
                <TableCell sx={{ fontWeight: "bold" }}>Review ID</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Booking ID</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Room Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Rating</TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    display: { xs: "none", sm: "table-cell" },
                  }}
                >
                  Comment
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    display: { xs: "none", sm: "table-cell" },
                  }}
                >
                  Created At
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredReviews.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.id}</TableCell>
                  <TableCell>{r.booking_id}</TableCell>
                  <TableCell>
                    <Box
                      component={Link}
                      to={`/room/${r.room_id}`}
                      sx={{
                        color: "#472d30",
                        textDecoration: "none",
                        fontWeight: 500,
                        display: "inline-block",
                        "&:hover": { color: "#E26D5C" },
                      }}
                    >
                      {getRoomName(r.room_id, rooms)}
                    </Box>
                  </TableCell>
                  <TableCell>{r.rating}</TableCell>
                  <TableCell
                    sx={{
                      display: { xs: "none", sm: "table-cell" },
                      maxWidth: 250,
                    }}
                  >
                    {r.comment}
                  </TableCell>

                  <TableCell
                    sx={{
                      display: { xs: "none", sm: "table-cell" },
                    }}
                  >
                    {new Date(r.created_at).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </>
  );
};

export default AdminReviewsPage;

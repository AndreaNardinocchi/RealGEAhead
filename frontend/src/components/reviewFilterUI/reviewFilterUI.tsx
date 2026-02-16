import React, { useState } from "react";
import Drawer from "@mui/material/Drawer";
import Fab from "@mui/material/Fab";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { Box } from "@mui/material";
import ReviewFilterCard from "../filters/reviewFilteredCard";

/**
 * Props for the reviewFilterUI component.
 */
interface ReviewFilterUIProps {
  filters: any;
  rooms: any[];
  setFilters: (filters: any) => void;
}

const styles = {
  fab: {
    position: "fixed",
    top: {
      xs: "80%",
      sm: "90%",
      md: "90%",
      lg: "90%",
    },
    right: "1%",
    bgcolor: "#e26d5c",
    color: "white",
    zIndex: 2000,
  },
};

/**
 * This component displays a floating filter button
 *  - opening/closing the filter drawer
 *  - passing filter state down to reviewsFilteredCard
 * The filtering is handled by the 'useFilteredReviews' hook.
 * https://github.com/AndreaNardinocchi/MoviesApp/blob/main/src/components/movieFilterUI/index.tsx
 */
const ReviewFilterUI: React.FC<ReviewFilterUIProps> = ({
  filters,
  rooms,
  setFilters,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      {/* Floating Filter Button */}
      <Fab
        variant="extended"
        onClick={() => setDrawerOpen(true)}
        sx={{
          ...styles.fab,
          "&:hover": {
            bgcolor: "#ffe6f0",
            color: "#000",
          },
        }}
      >
        <FilterAltIcon />
        {/* Filters */}
      </Fab>
      {/* Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box
          sx={{
            width: {
              xs: "80vw",
              sm: "350px",
              md: "380px",
              lg: "400px",
            },

            p: 2,
          }}
        >
          <ReviewFilterCard
            filters={filters}
            setFilters={setFilters}
            // bookings={bookings}
            rooms={rooms}
          />
        </Box>
      </Drawer>
    </>
  );
};

export default ReviewFilterUI;

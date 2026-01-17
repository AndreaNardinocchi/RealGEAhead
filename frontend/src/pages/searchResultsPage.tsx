import { AppBar, Box, Toolbar, Typography } from "@mui/material";
// https://mui.com/material-ui/material-icons/
import HotelIcon from "@mui/icons-material/Hotel";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import React, { useEffect } from "react";

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

  return (
    <>
      {/* Top App Bar indicating the search dates*/}
      <AppBar position="static" sx={{ backgroundColor: "#EFF5E0" }}>
        <Toolbar>
          <HotelIcon sx={{ mr: 1, color: "#000000de" }} />

          <Typography variant="h6" sx={{ flexGrow: 1, color: "#000000de" }}>
            Search Results
          </Typography>

          {/* Show selected dates + guests */}
          <Box display="flex" alignItems="center" gap={1}>
            <CalendarMonthIcon sx={{ color: "#000000de" }} />
            <Typography variant="body2" sx={{ color: "#000000de" }}>
              {/* These are placeholder data */}
              2026-01-14 → 2026-01-14 (2 guests)
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
      {/* Page content goes here */}
      <Typography
        variant="h4"
        component="h1"
        style={{ padding: "2rem", textAlign: "center" }}
      >
        Search Results page under construction
      </Typography>
      <Typography
        variant="body2"
        style={{ padding: "2rem", textAlign: "center", fontWeight: "bold" }}
      >
        Room Card goes here
      </Typography>
      <Typography
        variant="body2"
        style={{ padding: "2rem", textAlign: "center", fontWeight: "bold" }}
      >
        Room Card goes here
      </Typography>
    </>
  );
};

export default SearchResultsPage;

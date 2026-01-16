import { Typography } from "@mui/material";
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
      {/* Page content goes here */}
      <Typography
        variant="h4"
        component="h1"
        style={{ padding: "2rem", textAlign: "center" }}
      >
        Search Results page under construction
      </Typography>
    </>
  );
};

export default SearchResultsPage;

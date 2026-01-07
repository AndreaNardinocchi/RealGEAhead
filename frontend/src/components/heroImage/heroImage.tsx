// Importing React core library
import React from "react";
import { Box, useTheme, useMediaQuery } from "@mui/material";

// Props expected by the HeroImage component
interface HeroImageProps {
  imageUrl: string;
}

const HeroImage: React.FC<HeroImageProps> = ({ imageUrl }) => {
  // Access the current Material UI theme
  const theme = useTheme();

  /**
   * Detects if the screen width is 'sm' or below.
   * Used to switch between a square image on mobile
   * and a wide banner (3:1 aspect ratio) on larger screens.
   */
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        width: "100%",
        /**
         * Responsive aspect ratio:
         * Mobile: 1:1 square (padding-top: 100%)
         * Desktop/tablet: 3:1 wide banner (padding-top: 33.33%)
         *
         * https://www.sitepoint.com/how-to-use-css-background-size-and-background-position/
         * https://web.dev/articles/aspect-ratio
         */
        pt: isMobile ? "100%" : "33.33%",
        backgroundImage: `url(${imageUrl})`, // Set background image
        backgroundSize: "cover", // Ensure image covers the box
        backgroundPosition: "center", // Center the image
      }}
    />
  );
};

export default HeroImage;

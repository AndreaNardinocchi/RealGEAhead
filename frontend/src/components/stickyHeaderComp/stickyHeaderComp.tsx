import React from "react";
import { Box } from "@mui/material";

/**
 * StickyHeaderComp is a reusable wrapper that creates a sticky navigation container using
 * Material‑UI's Box component.
 * It stays fixed on the top of the viewport.
 * https://react.dev/learn/your-first-component
 * https://mui.com/material-ui/react-box/
 * https://developer.mozilla.org/en-US/docs/Web/CSS/position#sticky
 */

/**
 * Props interface for StickyBox.
 * Accepts any React children to be rendered inside the sticky container.
 * https://stackoverflow.com/questions/53688899/what-is-the-type-of-the-children-prop
 */
interface StickyNavigationBarProps {
  children: React.ReactNode;
}

const StickyHeaderComp: React.FC<StickyNavigationBarProps> = ({ children }) => {
  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        width: "100%",
        zIndex: 1200,
        backgroundColor: "#e26d5c",
        boxShadow: "0px 2px 6px rgba(0,0,0,0.06)",
      }}
    >
      <Box
        /**
         * Inner container which centers content using 'mx: auto'.
         * https://mui.com/system/basics/#responsive-values
         */
        sx={{
          width: "100%",
          maxWidth: { xs: "90%", md: "800px", lg: "100%" },
          mx: "auto",
          px: { xs: 1, md: 0 },
        }}
      >
        {/* Render any children passed into the component */}
        {children}
      </Box>
    </Box>
  );
};

export default StickyHeaderComp;

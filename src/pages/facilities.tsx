import React, { useEffect } from "react";
import { Container, Typography, Box } from "@mui/material";

const FacilitiesPage: React.FC = () => {
  useEffect(() => {
    document.title = "Facilities | GuestEase";
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 1, mb: 10 }}>
      <Box textAlign="center" mb={8}>
        <Typography variant="h3" component="h1" gutterBottom>
          Lorem ipsum dolor sit amet
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ maxWidth: 800, mx: "auto", fontWeight: 300 }}
        >
          At GuestEase Guesthouse, we provide everything you need for a
          comfortable, relaxing, and convenient stay.
        </Typography>
      </Box>

      {/* Facilities list */}
      <Box mb={10}>
        <Box mb={10}>
          <Typography
            variant="h4"
            component="h2"
            textAlign="center"
            gutterBottom
            sx={{ fontWeight: 500 }}
          >
            Lorem Ipsum
          </Typography>

          {/* 2-column bullet list using Box grid */}

          {/*This Box uses CSS Grid to create a responsive 1‑column / 2‑column layout. 
        - display: "grid" Turns the Box into a CSS Grid container. 
        https://mui.com/system/grid/#css-grid-layout 
        - gridTemplateColumns: { xs: "1fr", sm: "1fr, 1fr" }
         • On extra‑small screens (xs): "1fr" shows a single column layout. 
         • On small screens and above (sm): "1fr, 1fr", it will show two equal-width columns. 
         This allows the cards to stack on mobile and sit side‑by‑side on desktop.  
         https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-columns */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: {
                xs: 0,
                sm: 4,
                md: 4,
              },
              mt: 4,
              maxWidth: 900,
              mx: "auto",
            }}
          >
            {/* Left list */}
            <Box component="ul" sx={{ pl: 2, m: 0 }}>
              <li>
                <Typography color="text.secondary">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </Typography>
              </li>
              <li>
                <Typography color="text.secondary">
                  Sed do eiusmod tempor incididunt ut labore et dolore magna
                  aliqua.
                </Typography>
              </li>
            </Box>

            {/* Right list */}
            <Box component="ul" sx={{ pl: 2, m: 0 }}>
              <li>
                <Typography color="text.secondary">
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco.
                </Typography>
              </li>
              <li>
                <Typography color="text.secondary">
                  Duis aute irure dolor in reprehenderit in voluptate velit
                  esse.
                </Typography>
              </li>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Closing */}
      <Box textAlign="center">
        <Typography variant="h5" gutterBottom>
          Lorem ipsum dolor sit amet
        </Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 800, mx: "auto" }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
          tristique, urna nec tincidunt tincidunt, sapien lorem posuere libero.
        </Typography>
      </Box>
    </Container>
  );
};

export default FacilitiesPage;

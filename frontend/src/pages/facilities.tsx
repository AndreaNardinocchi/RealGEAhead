import React, { useEffect } from "react";
import { Container, Typography, Box } from "@mui/material";

const FacilitiesPage: React.FC = () => {
  // Browser title
  useEffect(() => {
    document.title = "Facilities | GuestEase";
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 1, mb: 10 }}>
      <Box textAlign="center" mb={8}>
        <Typography variant="h3" component="h1" gutterBottom>
          Our Facilities
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
            Comfort & Convenience
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
                  Comfortable beds with fresh linens{" "}
                </Typography>
              </li>
              <li>
                <Typography color="text.secondary">
                  Private bathrooms with complimentary toiletries
                </Typography>
              </li>
              <li>
                <Typography color="text.secondary">
                  Heating and hot water throughout the year{" "}
                </Typography>
              </li>
              <li>
                <Typography color="text.secondary">
                  High-speed Wi-Fi and desk setups
                </Typography>
              </li>
            </Box>

            {/* Right list */}
            <Box component="ul" sx={{ pl: 2, m: 0 }}>
              <li>
                <Typography color="text.secondary">
                  Complimentary breakfast daily{" "}
                </Typography>
              </li>
              <li>
                <Typography color="text.secondary">
                  Tea and coffee available for guests{" "}
                </Typography>
              </li>
              <li>
                <Typography color="text.secondary">
                  Luggage storage before check-in or after check-out{" "}
                </Typography>
              </li>
              <li>
                <Typography color="text.secondary">
                  Free on-site parking and easy access to local attractions{" "}
                </Typography>
              </li>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Closing */}
      <Box textAlign="center">
        <Typography variant="h5" gutterBottom>
          Experience GuestEase
        </Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 800, mx: "auto" }}>
          Our facilities are designed to make your stay effortless and
          enjoyable. From cozy rooms to thoughtful amenities, we take care of
          the details so you can focus on relaxing and enjoying your time with
          us.
        </Typography>
      </Box>
    </Container>
  );
};

export default FacilitiesPage;

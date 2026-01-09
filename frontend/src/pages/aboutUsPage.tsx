import React, { useEffect } from "react";
import { Container, Typography, Box, Card, CardContent } from "@mui/material";

import { getPublicUrl } from "../utils/supabaseAssetsStorage";

/**
 * About Us Page 
 * All layout is handled using <Box display="grid"> instead of <Grid> in order
 * to avoid the nested Grid error below:
 * 'No overload matches this call.
  Overload 1 of 2, '(props: ....'
 * This keeps the structure simpler, lighter, and easier to maintain.
 */

const guesteasePhilosophyCards = [
  {
    title: "Comfort Without Compromise",
    text: "Premium beds, quiet spaces, and modern amenities that support true rest.",
  },
  {
    title: "Character With Purpose",
    text: "Irish-inspired design that feels authentic, never themed or forced.",
  },
  {
    title: "Service That Feels Human",
    text: "Attentive, warm, and never intrusive — just the right balance.",
  },
];

const AboutUsPage: React.FC = () => {
  // Browser title
  useEffect(() => {
    document.title = "About Us | GuestEase";
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mb: 10 }}>
      <Box textAlign="center" mb={8}>
        <Typography variant="h3" component="h1" gutterBottom>
          About GuestEase
        </Typography>

        <Typography
          variant="h6"
          component="h2"
          color="text.secondary"
          /**
           * 'mx' set as 'auto' horizontally centers the element inside its parent,
           * as long as the element has a fixed width or a max‑width.
           */
          sx={{ maxWidth: 800, mx: "auto" }}
        >
          A thoughtful stay, rooted in Irish hospitality — designed for comfort,
          calm, and connection.
        </Typography>
      </Box>

      {/* 2-column grid */}

      {/*This Box uses CSS Grid to create a responsive 1‑column / 2‑column layout. 
        - display: "grid" Turns the Box into a CSS Grid container. 
        https://mui.com/system/grid/#css-grid-layout 
        - gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" }
         • On extra‑small screens (xs): "1fr" shows a single column layout. 
         • On small screens and above (md): "repeat(2, 1fr)", it will show two equal-width columns. 
         This allows the cards to stack on mobile and sit side‑by‑side on desktop.  
         https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-columns */}
      <Box
        mb={10}
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          gap: 4,
          alignItems: "center",
        }}
      >
        {/* Left text column */}
        <Box>
          <Typography variant="h5" component="h3" gutterBottom>
            A Place That Feels Right
          </Typography>

          <Typography color="text.secondary" sx={{ mb: 2 }}>
            At <strong>GuestEase</strong>, we believe a great stay is more than
            a bed for the night — it’s a feeling. A sense of welcome. A place
            where comfort, character, and care come together effortlessly.
          </Typography>

          <Typography color="text.secondary">
            Nestled in the heart of Ireland, GuestEase was created for
            travellers who value calm over clutter, warmth over extravagance,
            and experiences that feel genuinely personal.
          </Typography>
        </Box>

        {/* Right image */}
        <Box
          component="img"
          src={getPublicUrl("bed-breakfast-a-bit-boutique.jpg")}
          alt="Placeholder"
          sx={{
            width: "100%",
            height: "100%",
            /**
             * objectFit ensures the image fills the area while keeping its aspect ratio;
             * parts of the image may be cropped to avoid distortion
             *
             * https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit
             */
            objectFit: "cover",
            borderRadius: 2,
            boxShadow: 4,
          }}
        />
      </Box>

      {/* GuestEase Philosophy cards*/}
      <Box mb={10}>
        <Typography variant="h4" component="h2" gutterBottom textAlign="center">
          Our Philosophy
        </Typography>

        <Typography
          color="text.secondary"
          textAlign="center"
          sx={{ maxWidth: 900, mx: "auto", mb: 3 }}
        >
          We design every stay around one simple idea: <strong>ease</strong>.
          From seamless booking to thoughtfully curated rooms, we remove
          friction so you can focus on what matters — your journey, your people,
          and your time.
        </Typography>

        {/* 3-card grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
            gap: 3,
            justifyItems: "center",
          }}
        >
          {guesteasePhilosophyCards.map((item) => (
            <Card
              /**
               * Unique key so React can efficiently track each item in the list
               *
               * https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key
               */
              key={item.title}
              sx={{
                width: "100%",
                boxShadow: 3,
                borderRadius: 2,
                textAlign: "center",
              }}
            >
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom>
                  {item.title}
                </Typography>
                <Typography color="text.secondary">{item.text}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>

      {/* Rooms story section */}
      <Box
        mb={8}
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          gap: 4,
          alignItems: "center",
        }}
      >
        {/* Image */}
        <Box
          component="img"
          src={getPublicUrl("SeanchaiNook3.jpg")}
          alt="Placeholder"
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: 2,
            boxShadow: 4,
          }}
        />

        {/* Text */}
        <Box>
          <Typography variant="h5" component="h3" gutterBottom>
            Rooms With a Story
          </Typography>

          <Typography color="text.secondary" sx={{ mb: 2 }}>
            No two GuestEase rooms are the same — and that’s intentional.{" "}
          </Typography>

          <Typography color="text.secondary">
            Each space is designed with a distinct purpose in mind, whether it’s
            focused work, restorative rest, family connection, or indulgent
            escape. Natural textures, calming tones, and locally inspired
            details create spaces that feel grounded and restorative — not
            generic.
          </Typography>
        </Box>
      </Box>

      {/* Modern Travellers section */}

      <Box mb={10}>
        <Typography
          variant="h4"
          component="h2"
          textAlign="center"
          gutterBottom
          sx={{ fontWeight: 500 }}
        >
          Designed for Modern Travellers
        </Typography>

        {/* 2-column bullet list using Box grid */}
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
                Remote workers seeking inspiring, functional spaces
              </Typography>
            </li>
            <li>
              <Typography color="text.secondary">
                Couples looking for warmth, privacy, and atmosphere
              </Typography>
            </li>
          </Box>

          {/* Right list */}
          <Box component="ul" sx={{ pl: 2, m: 0 }}>
            <li>
              <Typography color="text.secondary">
                Families who value flexibility, space, and ease
              </Typography>
            </li>
            <li>
              <Typography color="text.secondary">
                Explorers wanting a calm base between adventures
              </Typography>
            </li>
          </Box>
        </Box>
      </Box>

      {/* Closing ection */}
      <Box textAlign="center">
        <Typography variant="h5" component="h3" gutterBottom>
          Welcome to GuestEase
        </Typography>

        <Typography color="text.secondary" sx={{ maxWidth: 800, mx: "auto" }}>
          Whether you’re staying for a night or settling in for longer, we’re
          delighted to host you. At GuestEase, you’re not just checking in —
          you’re arriving.
        </Typography>
      </Box>
    </Container>
  );
};

export default AboutUsPage;

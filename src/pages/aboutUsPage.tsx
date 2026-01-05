import React, { useEffect } from "react";
import { Container, Typography, Box, Card, CardContent } from "@mui/material";

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
    title: "Lorem Ipsum",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    title: "Dolor Sit Amet",
    text: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    title: "Consectetur Adipiscing",
    text: "Ut enim ad minim veniam, quis nostrud exercitation ullamco.",
  },
];

const AboutUsPage: React.FC = () => {
  // Browser title
  useEffect(() => {
    document.title = "About Us | GuestEase";
  }, []);

  return (
    // Intro section
    <Container maxWidth="lg" sx={{ mt: 8, mb: 10 }}>
      <Box textAlign="center" mb={8}>
        <Typography variant="h3" component="h1" gutterBottom>
          Lorem Ipsum Dolor
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
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
          ullamcorper, sapien non gravida luctus, lorem arcu fermentum justo.
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
            Lorem Ipsum Heading
          </Typography>

          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Lorem ipsum dolor sit amet,{" "}
            <strong>consectetur adipiscing elit</strong>. Integer vitae justo
            nec urna facilisis tincidunt. Suspendisse potenti.
          </Typography>

          <Typography color="text.secondary">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
            feugiat, arcu id gravida aliquet, justo urna placerat libero.
          </Typography>
        </Box>

        {/* Right image */}
        <Box
          component="img"
          src="https://placehold.co/600x400"
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
          Lorem Ipsum Philosophy
        </Typography>

        <Typography
          color="text.secondary"
          textAlign="center"
          sx={{ maxWidth: 900, mx: "auto", mb: 6 }}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          <strong> Vivamus commodo </strong> urna vel sapien fermentum.
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
              sx={{ width: "100%", boxShadow: 3, borderRadius: 2 }}
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
          src="https://placehold.co/600x400"
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
            Lorem Ipsum Rooms
          </Typography>

          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </Typography>

          <Typography color="text.secondary">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
            tristique, urna nec tincidunt tincidunt, sapien lorem posuere
            libero.
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
          Lorem Ipsum for Modern Travellers
        </Typography>

        {/* 2-column bullet list using Box grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: {
              xs: 0,
              sm: 0,
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
                Duis aute irure dolor in reprehenderit in voluptate velit esse.
              </Typography>
            </li>
          </Box>
        </Box>
      </Box>

      {/* Closing ection */}
      <Box textAlign="center">
        <Typography variant="h5" component="h3" gutterBottom>
          Lorem Ipsum Welcome
        </Typography>

        <Typography color="text.secondary" sx={{ maxWidth: 800, mx: "auto" }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vel
          lorem nec sapien bibendum tincidunt.
        </Typography>
      </Box>
    </Container>
  );
};

export default AboutUsPage;

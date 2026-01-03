import React from "react";
// https://mui.com/material-ui/all-components/
import {
  Container,
  Typography,
  Box,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import HeroImage from "../components/heroImage/heroImage";
import HomepageExpCarousel from "../components/homepageExpCarousel/homepageExpCarousel";

/**
 * experiences
 *
 * This array provides the content for the Experience Carousel.
 * Each item includes:
 * - id: unique identifier
 * - title: heading text
 * - description: supporting paragraph
 * - image: placeholder image URL
 */
const experiences = [
  {
    id: 1,
    title: "Lorem Ipsum Dolor Sit Amet",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae justo vel lorem gravida aliquet.",
    image: "https://placehold.co/600x400",
  },
  {
    id: 2,
    title: "Consectetur Adipiscing Elit",
    description:
      "Suspendisse potenti. Integer non lorem non urna tincidunt fermentum. Curabitur ac sapien vel augue cursus.",
    image: "https://placehold.co/600x400",
  },
  {
    id: 3,
    title: "Sed Do Eiusmod Tempor",
    description:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    image: "https://placehold.co/600x400",
  },
  {
    id: 4,
    title: "Ut Labore Et Dolore Magna",
    description:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    image: "https://placehold.co/600x400",
  },
];

/**
 * HomePage
 *
 * This component renders the main landing page for GuestEase.
 * It includes:
 * - Hero section
 * - Booking form placeholder
 * - Introductory text
 * - "Why Choose Us" list
 * - Experience carousel
 * - Breakfast & Snacks cards
 * - Content-only card
 */
const HomePage: React.FC = () => {
  return (
    <>
      {/* Hero Section */}

      <HeroImage imageUrl="https://placehold.co/600x400" />

      {/* Welcome Heading + Intro Paragraph */}

      <Container maxWidth="lg">
        <Box textAlign="center" mt={4} mb={5}>
          <Typography variant="h2" component="h1" gutterBottom>
            Welcome to GuestEase
          </Typography>
          <Typography variant="h5" color="textSecondary" paragraph>
            Your comfort is our priority. Nestled in a peaceful location, our
            guesthouse offers cozy rooms, friendly service, and a relaxing
            atmosphere.
          </Typography>
        </Box>
      </Container>

      {/* Booking Form Placeholder here*/}

      <Typography
        variant="body1"
        paragraph
        sx={{ textAlign: "center", fontWeight: "bold" }}
      >
        Booking Form goes here
      </Typography>

      <Container maxWidth="lg" sx={{ mt: 14 }}>
        {/* Intro Text Section */}

        <Box textAlign="center" mb={5}>
          <Typography variant="body1" paragraph>
            Whether you're traveling for business or pleasure, GuestEase ensures
            a pleasant stay with clean, well-equipped rooms, fast Wi-Fi, and
            complimentary breakfast. Choose from a range of room options and
            enjoy facilities designed for your convenience.
          </Typography>
        </Box>

        {/* Why Choose Us Section */}

        <Box mb={6}>
          <Typography variant="h4" gutterBottom>
            Why Choose GuestEase?
          </Typography>
          <ul style={{ fontSize: "1.1rem", lineHeight: 1.8 }}>
            <li>✔️ Comfortable and clean accommodations</li>
            <li>✔️ Fast and free Wi-Fi</li>
            <li>✔️ Central location with easy access</li>
            <li>✔️ Friendly and attentive staff</li>
            <li>✔️ Affordable rates with flexible booking</li>
          </ul>
        </Box>

        {/**
         * EXPERIENCE Cards Section
         * This will be a slideshow, but we are working on it
         * */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 6,
          }}
        >
          <Box sx={{ flex: "1 1 100%", maxWidth: "100%" }}>
            <Typography
              variant="h3"
              component="h2"
              gutterBottom
              /**
               * gutterBottom adds a standard bottom margin to the Typography element.
               * It’s equivalent to writing: sx={{ marginBottom: "0.35em" }}
               * Thie will allow to keep headings and paragraphs from sticking too close to whatever comes next.
               *
               * https://mui.com/material-ui/api/typography/#typography-classes-MuiTypography-gutterBottom
               * https://stackoverflow.com/questions/53183721/material-ui-gutterbottom-vs-paragraph-difference
               * */
              textAlign="center"
            >
              Some heading
            </Typography>

            {/* Carousel component displaying experience cards */}
            <HomepageExpCarousel experiences={experiences} />
          </Box>
        </Box>

        {/* BREAKFAST & SNACKS Cards Section */}
        <Box sx={{ flex: "1 1 100%", maxWidth: "100%" }}>
          <Typography variant="h3" gutterBottom textAlign="center">
            Some Heading
          </Typography>
        </Box>

        {/* Grid layout for two cards */}
    
        {/*This Box uses CSS Grid to create a responsive 1‑column / 2‑column layout. 
        - display: "grid" Turns the Box into a CSS Grid container. 
        https://mui.com/system/grid/#css-grid-layout 
        - gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" }
         • On extra‑small screens (xs): "1fr" shows a single column layout. 
         • On medium screens and above (md): "repeat(2, 1fr)", it will show two equal-width columns. 
         This allows the cards to stack on mobile and sit side‑by‑side on desktop.  
         https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-columns 
         - gap: 32 / 8 
         MUI spacing uses a base unit of 8px. 32 / 8 = 4, it is equivalent to spacing={4}. 
         This keeps spacing consistent with MUI’s Grid component.  
         https://mui.com/system/spacing/ 
         - justifyContent: "center" Ensures the grid content stays centered horizontally when the grid width is smaller than the container. 
         https://developer.mozilla.org/en-US/docs/Web/CSS/justify-content */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
            gap: 32 / 8, // same as spacing={4} in Grid
            mb: 8,
            justifyContent: "center",
          }}
        >
          {/* Card 1 */}

          <Card
            sx={{
              display: "flex",
              flexDirection: "column",
              height: 380,
              width: "100%",
              maxWidth: 560,
              margin: "0 auto",
            }}
          >
            {/* Card image */}
            <CardMedia
              component="img"
              image="https://placehold.co/600x400"
              alt="Placeholder Image"
              sx={{ height: 200, objectFit: "cover" }}
            />

            {/* Card text content */}
            <CardContent sx={{ flex: 1, pb: 4 }}>
              <Typography variant="h6" gutterBottom noWrap>
                Lorem Ipsum Dolor
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  display: "-webkit-box",
                  overflow: "hidden",
                  WebkitLineClamp: 4,
                  WebkitBoxOrient: "vertical",
                }}
              >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                facilisis urna non commodo aliquet. Integer feugiat sapien vel
                ligula fermentum, vitae tincidunt lorem viverra.
              </Typography>
            </CardContent>
          </Card>

          {/* Card 2 */}

          <Card
            sx={{
              display: "flex",
              flexDirection: "column",
              height: 380,
              width: "100%",
              maxWidth: 560,
              margin: "0 auto",
            }}
          >
            {/* Card image */}
            <CardMedia
              component="img"
              image="https://placehold.co/600x400"
              alt="Placeholder Image"
              sx={{ height: 200, objectFit: "cover" }}
            />

            {/* Card text content */}
            <CardContent sx={{ flex: 1, overflow: "hidden" }}>
              <Typography variant="h6" gutterBottom noWrap>
                Sit Amet Consectetur
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  /**
                   * Enables multi‑line text truncation using the WebKit flexbox model, creating a vertical box container
                   * that allows line clamping.
                   * https://developer.mozilla.org/en-US/docs/Web/CSS/-webkit-line-clamp
                   */
                  display: "-webkit-box",
                  /**
                   * Ensures any text beyond the clamped lines is hidden instead of overflowing.
                   * https://developer.mozilla.org/en-US/docs/Web/CSS/overflow
                   */
                  overflow: "hidden",
                  /**
                   * Specifies the maximum number of lines to display before truncating.
                   * https://developer.mozilla.org/en-US/docs/Web/CSS/-webkit-line-clamp
                   */
                  WebkitLineClamp: 4,
                  /**
                   * Sets the box orientation to vertical, required for line clamping to work.
                   * https://developer.mozilla.org/en-US/docs/Web/CSS/box-orient
                   */
                  WebkitBoxOrient: "vertical",
                }}
              >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
                feugiat velit sed luctus posuere. Donec vitae augue non elit
                fermentum tincidunt.
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Content-only Card Section */}

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 8,
          }}
        >
          <Box sx={{ flex: "1 1 100%", maxWidth: "100%" }}>
            <Typography variant="h3" gutterBottom textAlign="center">
              Some Heading
            </Typography>

            {/* Centered content card with logo + text */}
            <Card
              sx={{
                textAlign: "center",
                px: { xs: 3, md: 4 },
                py: { xs: 3, md: 4 },
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {/* Logo image */}
              <Box
                component="img"
                src="/assets/GuestEaseLogo.png"
                alt="GuestEase"
                sx={{ width: 80, mb: 2 }}
              />

              {/* Text content */}
              <CardContent
                sx={{
                  flex: 1,
                  px: { xs: 2, md: 3 },
                  py: { xs: 2, md: 3 },
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Lorem Ipsum Dolor
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  facilisis urna non commodo aliquet. Integer feugiat sapien vel
                  ligula fermentum, vitae tincidunt lorem viverra. Curabitur non
                  risus vitae elit ullamcorper tincidunt vel vel ipsum.
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default HomePage;

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
import HomepageThreeCardComp from "../components/homepageThreeCardComp/homepageThreeCardComp";
// Importing the supabase 'assets' storage function
import { getPublicUrl } from "../utils/supabaseAssetsStorage";

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
    title: "Explore Cliff Trails",
    description:
      "Beautiful paths perfect for hiking, guiding you across cliffside trails and quiet stretches of coastline. Each turn reveals sweeping views of the Atlantic.",
    image: getPublicUrl("hiking-experience.jpg"),
  },
  {
    id: 2,
    title: "Seaweed Soak, Sure Why Not",
    description:
      "Slip into a warm Atlantic seaweed bath and let the stress melt away. Pure Irish wellness, with a bit of salty magic.",
    image: getPublicUrl("seaweed-bath.jpg"),
  },
  {
    id: 3,
    title: "A Drop of the Good Stuff",
    description:
      "Taste local Irish whiskey and soak up the stories behind every sip. A relaxed, friendly way to connect with the coast and its culture.",
    image: getPublicUrl("whiskey-tasting.jpg"),
  },
  {
    id: 4,
    title: "Paddle Your Own Way",
    description:
      "Explore calm bays, hidden inlets, or open water at your own pace. Perfect for a gentle adventure and a fresh Atlantic breeze.",
    image: getPublicUrl("kayaking-experience.jpg"),
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

      <HeroImage imageUrl={getPublicUrl("brigidshaven1.png")} />

      {/* Welcome Heading + Intro Paragraph */}
      <Box
        textAlign="center"
        sx={{ pt: "0.5%", pb: "0.05%", backgroundColor: "#EFF5E0" }}
      >
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
      </Box>

      {/* Booking Form Placeholder here*/}

      <Typography
        variant="body1"
        paragraph
        sx={{ textAlign: "center", fontWeight: "bold", pt: 5 }}
      >
        Booking Form goes here
      </Typography>

      <Container maxWidth="lg" sx={{ mt: 9 }}>
        {/* Intro Text Section */}

        <Box textAlign="center" mb={5}>
          <Typography variant="body1" color="text.secondary" paragraph>
            Whether you're traveling for business or pleasure, GuestEase ensures
            a pleasant stay with clean, well-equipped rooms, fast Wi-Fi, and
            complimentary breakfast. Choose from a range of room options and
            enjoy facilities designed for your convenience.
          </Typography>
        </Box>
        <HomepageThreeCardComp />
        {/* Why Choose Us Section */}

        <Box mb={6} sx={{ mt: 6 }}>
          <Typography variant="h4" component="h2" align="center" gutterBottom>
            Why Choose GuestEase?
          </Typography>
          <p style={{ fontSize: "1.1rem", lineHeight: 1.8 }}>
            ✓ Comfortable and clean accommodations
            <br />
            ✓ Fast and free Wi-Fi
            <br />
            ✓ Central location with easy access
            <br />
            ✓ Friendly and attentive staff
            <br />
            ✓ Affordable rates with flexible booking
            <br />
          </p>
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
              variant="h4"
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
              Experiences Around Us
            </Typography>

            {/* Carousel component displaying experience cards */}
            <HomepageExpCarousel experiences={experiences} />
          </Box>
        </Box>

        {/* BREAKFAST & SNACKS Cards Section */}
        <Box sx={{ flex: "1 1 100%", maxWidth: "100%" }}>
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            textAlign="center"
          >
            Your Foodie Experience With Us
          </Typography>
        </Box>

        {/* Grid layout for two cards Complimentary Breakfast & Snacks*/}

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
              height: 360,
              width: "100%",
              maxWidth: 560,
              margin: "0 auto",
            }}
          >
            {/* Card image */}
            <CardMedia
              component="img"
              image={getPublicUrl(
                "rich-and-abundant-irish-complimentary-breakfast-enjoy.jpg"
              )}
              alt="Complimentary Breakfast"
              sx={{ height: 200, objectFit: "cover" }}
            />

            {/* Card text content */}
            <CardContent sx={{ flex: 1, padding: 3 }}>
              <Typography variant="h5" component="h3" gutterBottom noWrap>
                Complimentary Breakfast
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
                Enjoy a fresh homemade breakfast with pastries, cereals, hot
                dishes, and locally sourced ingredients to start your day
                perfectly.
              </Typography>
            </CardContent>
          </Card>

          {/* Card 2 */}

          <Card
            sx={{
              display: "flex",
              flexDirection: "column",
              height: 360,
              width: "100%",
              maxWidth: 560,
              margin: "0 auto",
            }}
          >
            {/* Card image */}
            <CardMedia
              component="img"
              image={getPublicUrl(
                "snacks-refreshments-enjoy-complimentary-snacks-coffee.jpg"
              )}
              alt="Snacks & Refreshments"
              sx={{ height: 200, objectFit: "cover" }}
            />

            {/* Card text content */}
            <CardContent sx={{ flex: 1, overflow: "hidden", padding: 3 }}>
              <Typography variant="h5" component="h3" gutterBottom noWrap>
                Snacks & Refreshments
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
                Enjoy complimentary snacks, coffee, tea, and refreshing drinks
                available throughout the day for your comfort.
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
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              textAlign="center"
            >
              Discover GuestEase
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
                src={getPublicUrl("GuestEaseLogo.png")}
                alt="GuestEase"
                sx={{ width: 80 }}
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
                <Typography variant="h6" component={"h3"} gutterBottom>
                  Comfortable, Modern Rooms for Business & Leisure Travelers{" "}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  At GuestEase, we make sure every stay feels like home. Enjoy
                  cozy rooms, complimentary breakfast, and curated experiences
                  around our guesthouse.
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

import React from "react";
// https://mui.com/material-ui/all-components/
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";

/**
 * HomePage
 *
 * This page renders the main landing page for GuestEase.
 * It includes:
 * - Hero section
 * - Booking form placeholder
 * - Intro text
 * - "Why Choose Us" section
 * - Experience cards
 * - Content-only card
 */

const HomePage: React.FC = () => {
  return (
    <>
      {/**
       * Hero section coming soon
       * */}

      <Container maxWidth="lg">
        <Box textAlign="center" mb={5} sx={{ mt: 4 }}>
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

      {/* Booking Form goes here */}
      <Typography
        variant="body1"
        paragraph
        sx={{ textAlign: "center", fontWeight: "bold" }}
      >
        Booking Form goes here
      </Typography>

      <Container maxWidth="lg" sx={{ mt: 14 }}>
        <Box textAlign="center" mb={5}>
          <Typography variant="body1" paragraph>
            Whether you're traveling for business or pleasure, GuestEase ensures
            a pleasant stay with clean, well-equipped rooms, fast Wi-Fi, and
            complimentary breakfast. Choose from a range of room options and
            enjoy facilities designed for your convenience.
          </Typography>
        </Box>

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
         * This will be a slideshow, but we will work on it later
         * */}

        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={6}>
            <Typography
              variant="h3"
              component="h2"
              /**
               * gutterBottom adds a standard bottom margin to the Typography element.
               * It’s equivalent to writing: sx={{ marginBottom: "0.35em" }}
               * Thie will allow to keep headings and paragraphs from sticking too close to whatever comes next.
               *
               * https://mui.com/material-ui/api/typography/#typography-classes-MuiTypography-gutterBottom
               * https://stackoverflow.com/questions/53183721/material-ui-gutterbottom-vs-paragraph-difference
               * */
              gutterBottom
              sx={{ textAlign: "center" }}
            >
              Some heading{" "}
            </Typography>
            <Card
              sx={{
                display: "flex",
                flexDirection: {
                  // https://mui.com/material-ui/customization/breakpoints/
                  xs: "column", // On extra‑small screens (mobile), stack items vertically
                  md: "row", // On medium screens and larger (tablet/desktop), place items side‑by‑side horizontally
                },

                height: 300,
                width: "100%",
                margin: "0 auto",
              }}
            >
              <CardContent
                sx={{
                  flex: 1,
                  padding: 3,
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
                  ligula fermentum, vitae tincidunt lorem viverra.
                </Typography>
              </CardContent>

              <CardMedia
                component="img"
                image="https://placehold.co/600x400.png"
                alt="Placeholder"
                sx={{
                  width: { xs: "100%", md: "50%" },
                  height: 300,
                  /**
                   * objectFit ensures the image fills the area while keeping its aspect ratio;
                   * parts of the image may be cropped to avoid distortion
                   *
                   * https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit
                   */
                  objectFit: "cover",
                }}
              />
            </Card>
          </Grid>
        </Grid>

        {/* BREAKFAST & SNACKS Cards Section */}

        <Box mb={8}>
          <Typography
            variant="h4"
            align="center"
            sx={{ mt: 6, mb: 4 }}
            gutterBottom
          >
            Your Experience
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {/* Card 1 */}
            <Grid item xs={12} md={6}>
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
                <CardMedia
                  component="img"
                  image="https://placehold.co/600x400"
                  alt="Placeholder Image"
                  sx={{ height: 200, objectFit: "cover" }}
                />
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
                    facilisis urna non commodo aliquet. Integer feugiat sapien
                    vel ligula fermentum, vitae tincidunt lorem viverra.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Card 2 */}
            <Grid item xs={12} md={6}>
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
                <CardMedia
                  component="img"
                  image="https://placehold.co/600x400"
                  alt="Placeholder Image"
                  sx={{ height: 200, objectFit: "cover" }}
                />

                <CardContent sx={{ flex: 1, overflow: "hidden" }}>
                  <Typography variant="h6" gutterBottom noWrap>
                    Sit Amet Consectetur
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
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Integer feugiat velit sed luctus posuere. Donec vitae augue
                    non elit fermentum tincidunt.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
        <Grid container spacing={{ xs: 2, md: 4 }} justifyContent="center">
          <Grid item xs={12} md={6}>
            <Typography
              variant="h3"
              component="h2"
              gutterBottom
              sx={{ textAlign: "center" }}
            >
              Some Heading
            </Typography>

            <Card
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                margin: "0 auto",
                px: { xs: 0, md: 2 },
                py: { xs: 2, md: 2 },
              }}
            >
              <CardContent
                sx={{
                  flex: 1,
                  px: { xs: 2, sm: 3, md: 3 },
                  py: { xs: 2, sm: 3, md: 3 },
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
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default HomePage;

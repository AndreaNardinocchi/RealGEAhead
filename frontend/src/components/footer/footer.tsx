import React from "react";
import { Box, Typography, Link, Container, Divider } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
// Importing the supabase 'assets' storage function
import { getPublicUrl } from "../../utils/supabaseAssetsStorage";
/**
 * This footer is the same we used in past projects, which has been adjusted
 * to serve the purpose of our final project.
 * Note: we avoided using double grids (parent/child) as done in the past since the second grid
 * was consistently throwing an error, which we were unable to sort out.
 * We replaced the nested MUI Grid layout with a single Flexbox-based <Box> wrapper.
 * Each column is now just a <Box> with responsive widths, which avoids the double‑Grid error
 * we were encountering.
 * Flexbox handles the spacing, wrapping, and alignment cleanly, giving us the same three‑column
 * layout without relying on multiple Grid containers.
 *
 * https://mui.com/system/flexbox/
 */

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{ backgroundColor: "grey.900", color: "white", pt: 4, mt: 12 }}
    >
      <Container maxWidth="lg" sx={{ padding: "2rem" }}>
        {/**
         * MAIN FLEX WRAPPER
         * Stacked on mobile
         * 3 columns on tablet and up
         */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: { xs: "center", sm: "space-between" },
            alignItems: "stretch",
          }}
        >
          {/**  Column 1 */}
          <Box
            sx={{
              width: { xs: "100%", sm: "33.333%" },
              mb: { xs: 4, sm: 0 },
              textAlign: {
                xs: "center",
                sm: "left",
              },
            }}
          >
            <Box
              sx={{
                paddingLeft: {
                  xs: "0%",
                  sm: "10%",
                  md: "15%",
                  lg: "5%",
                },
              }}
            >
              <Typography variant="h4" gutterBottom>
                This Project
              </Typography>

              <Link
                href="https://docs.google.com/document/d/1XsyqzH4_szOmbkU0udpQFD0j48aD5wmy59QdARHP7ZQ/edit?tab=t.0"
                target="_blank"
                rel="noopener"
                color="inherit"
                underline="hover"
                display="block"
              >
                <Typography sx={{ fontSize: "1.3rem", pb: 0.5 }}>
                  Interim Report
                </Typography>
              </Link>

              <Link
                href="https://docs.google.com/document/d/1XsyqzH4_szOmbkU0udpQFD0j48aD5wmy59QdARHP7ZQ/edit?tab=t.0"
                target="_blank"
                rel="noopener"
                color="inherit"
                underline="hover"
                display="block"
              >
                <Typography sx={{ fontSize: "1.3rem", pb: 0.5 }}>
                  Final Report
                </Typography>
              </Link>

              <Link
                href="https://www.youtube.com/"
                target="_blank"
                rel="noopener"
                color="inherit"
                underline="hover"
                display="block"
              >
                <Typography sx={{ fontSize: "1.3rem", pb: 0.5 }}>
                  Video Presentation
                </Typography>
              </Link>

              <Link
                href="https://www.duckduckgo.com/"
                target="_blank"
                rel="noopener"
                color="inherit"
                underline="hover"
                display="block"
              >
                <Typography sx={{ fontSize: "1.3rem", pb: 0.5 }}>
                  Presentation Slides
                </Typography>
              </Link>
            </Box>
          </Box>

          {/** Column 2 */}
          <Box
            sx={{
              width: { xs: "100%", sm: "33.333%" },
              mb: { xs: 4, sm: 0 },
              textAlign: { xs: "center", sm: "left" },
            }}
          >
            <Box
              sx={{
                paddingLeft: {
                  xs: "0%",
                  sm: "10%",
                  md: "15%",
                  lg: "5%",
                },
              }}
            >
              <Typography variant="h4" gutterBottom>
                Past Projects
              </Typography>

              <Link
                href="https://movies-app-vqbl.vercel.app/"
                target="_blank"
                rel="noopener"
                color="inherit"
                underline="hover"
                display="block"
              >
                <Typography sx={{ fontSize: "1.3rem", pb: 0.5 }}>
                  MoviesApp
                </Typography>
              </Link>

              <Link
                href="https://whether-weather-an.netlify.app/"
                target="_blank"
                rel="noopener"
                color="inherit"
                underline="hover"
                display="block"
              >
                <Typography sx={{ fontSize: "1.3rem", pb: 0.5 }}>
                  (Whether) Weather
                </Typography>
              </Link>

              <Link
                href="https://cinzianardinocchi.netlify.app/"
                target="_blank"
                rel="noopener"
                color="inherit"
                underline="hover"
                display="block"
              >
                <Typography sx={{ fontSize: "1.3rem", pb: 0.5 }}>
                  CN Psychology
                </Typography>
              </Link>

              <Link
                href="https://placemarkyourjourney.netlify.app/"
                target="_blank"
                rel="noopener"
                color="inherit"
                underline="hover"
                display="block"
              >
                <Typography sx={{ fontSize: "1.3rem", pb: 0.5 }}>
                  PlaceMark
                </Typography>
              </Link>
            </Box>
          </Box>

          {/** Column 3 */}

          <Box
            sx={{
              width: { xs: "100%", sm: "33.333%" },
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mb: { xs: 4, sm: 0 },
            }}
          >
            <img
              src={getPublicUrl("GuestEaseLogo.png")}
              alt="GuestEase logo"
              style={{ maxHeight: "200px", width: "auto" }}
            />
          </Box>
        </Box>
      </Container>

      <Divider sx={{ borderColor: "grey.700" }} />

      {/** Bottom bar */}
      <Box sx={{ textAlign: "center", pb: 2, backgroundColor: "#363636" }}>
        <Link component={RouterLink} to="/" sx={{ color: "inherit" }}>
          <img
            src={getPublicUrl("GuestEaseLogo.svg")}
            alt="GuestEase logo"
            style={{
              height: "25px",
              width: "auto",
              marginLeft: "2%",
              position: "relative",
              top: "10px",
            }}
          />
        </Link>

        <Typography variant="body2" component="span" sx={{ paddingLeft: 0.5 }}>
          | © {new Date().getFullYear()} GuestEase. All rights reserved.
        </Typography>

        <Link
          href="https://www.linkedin.com/in/andrea-nardinocchi-53084056/"
          target="_blank"
          rel="noopener"
          sx={{ ml: 0.5 }}
        >
          <Typography
            variant="body2"
            component="span"
            sx={{ color: "#ebebeb" }}
          >
            Andrea Nardinocchi
          </Typography>
        </Link>
      </Box>
    </Box>
  );
};

export default Footer;

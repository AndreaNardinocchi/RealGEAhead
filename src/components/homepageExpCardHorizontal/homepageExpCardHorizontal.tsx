import React from "react";
import { Card, CardMedia, CardContent, Typography, Box } from "@mui/material";

type ExperienceCardProps = {
  title: string;
  description: string;
  image: string;
};

const HomepageExpCardHorizontal: React.FC<ExperienceCardProps> = ({
  title,
  description,
  image,
}) => {
  // Calling out the card height will enhance our testing process
  const cardHeight = 450;

  return (
    <Card
      sx={{
        display: "flex",
        // https://mui.com/material-ui/customization/breakpoints/
        flexDirection: {
          xs: "column", // On extra‑small screens (mobile), stack items vertically
          md: "row", // On medium screens and larger (tablet/desktop), place items side‑by‑side horizontally
        },
        width: "100%",
        height: { xs: "auto", sm: cardHeight },
        // boxShadow: 4,
        borderRadius: 2,
      }}
    >
      {/* Left image */}
      <CardMedia
        component="img"
        image={image}
        alt={title}
        sx={{
          width: { xs: "100%", sm: "50%", lg: "100%" },
          height: { xs: 220, sm: "100%" },
          /**
           * objectFit ensures the image fills the area while keeping its aspect ratio;
           * parts of the image may be cropped to avoid distortion
           *
           * https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit
           */
          objectFit: "cover",
        }}
      />

      {/* Right contnet */}
      <Box
        sx={{
          width: { xs: "100%", sm: "50%" },
          display: "flex",
          flexDirection: "column",
          paddingTop: { xs: "0%", sm: "13%", lg: "13%" },
        }}
      >
        <CardContent sx={{ padding: "24px", flexGrow: 1 }}>
          <Typography variant="h5" gutterBottom>
            {title}
          </Typography>
          <Typography
            variant="body1"
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
            {description}
          </Typography>
        </CardContent>
      </Box>
    </Card>
  );
};

export default HomepageExpCardHorizontal;

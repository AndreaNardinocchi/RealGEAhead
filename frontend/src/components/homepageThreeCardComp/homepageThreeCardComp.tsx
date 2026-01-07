import React from "react";
import { Box, Card, CardMedia, CardContent, Typography } from "@mui/material";

/**
 * Creating contnet for the below 3 cards.
 * The AI Copilot prompts used to create content for the below cards was:
 * 'Generate content for 3 cards such as productive stays for remote workers, relaxing weekends,
 * and mindful retreats. Each should have a catchy title and a soft, soothing description using an Irish tone.'
 *
 * https://copilot.microsoft.com/
 */
const homepageThreeCards = [
  {
    id: 1,
    title: "Work Done. Kettle On.",
    description:
      "GuestEase accomodates remote workers in rooms that feel just right. Solid Wi-Fi, a comfy chair, and a friendly face.",
    image: "https://placehold.co/600x400",
  },
  {
    id: 2,
    title: "Settle In and Switch Off",
    description:
      "GuestEase offers rooms designed for easy weekends. Settle in, take it handy, and enjoy the break.",
    image: "https://placehold.co/600x400",
  },
  {
    id: 3,
    title: "Rest, Reset, Breathe",
    description:
      "Spaces designed for calm and quiet moments. Ideal for meditation, mindfulness, or doing nothing at all.",
    image: "https://placehold.co/600x400",
  },
];

const HomepageThreeCardComp: React.FC = () => {
  return (
    <Box
      /**
       * Grid layout
       * On 'xs' we will have 1 column
       * On 'sm' onwards we will have 3 columns
       */
      sx={{
        display: "grid",
        /** gridTemplateColumns:
         * • On extra‑small screens (xs): "1fr" shows a single column layout.
         * • On small screens and above (md): "repeat(3, 1fr)", it will show three equal-width columns.
         * This allows the cards to stack on mobile and sit side‑by‑side on desktop.
         *
         * https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-columns
         */
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(3, 1fr)",
        },
        gap: 2,
        mt: 4,
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      {/* Mapping the cards content */}
      {homepageThreeCards.map((card) => (
        <Card key={card.id}>
          <CardMedia
            component="img"
            image={card.image}
            alt={card.title}
            sx={{
              width: "100%",
              aspectRatio: "1 / 1",
              objectFit: "cover",
            }}
          />

          <CardContent>
            <Typography variant="h6" component="h3" gutterBottom>
              {card.title}
            </Typography>

            <Typography variant="body2" color="textSecondary">
              {card.description}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default HomepageThreeCardComp;

import { useRef, useState } from "react";
import { Box, IconButton } from "@mui/material";

import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import HomepageExpCardHorizontal from "../homepageExpCardHorizontal/homepageExpCardHorizontal";
import type { Experience } from "../../types/interfaces";

const HomepageExpCarousel = ({
  experiences,
}: {
  experiences: Experience[];
}) => {
  /**
   * useRef is a hook used to directly control the scrollable container, which will enable to get a slideshow effect
   * It is basically used to manipulate the DOM element, and, it is initially set to null
   * until the component mounts.
   * After the component mounts and React renders the DOM node with ref={scrollRef}:
   * https://atomizedobjects.com/blog/react/how-to-use-useref-in-react/
   * https://medium.com/@juvitasaini/useref-understand-with-scroll-example-75ad7139557b
   * https://tj.ie/scrollable-container-controls-with-react-hooks/?
   * https://react.dev/reference/react/useRef
   * https://github.com/AndreaNardinocchi/MoviesApp/blob/main/src/pages/homePage.tsx
   */
  const scrollRef = useRef<HTMLDivElement>(null);

  /**
   * Tracks which slide is currently visible.
   *
   * https://react.dev/reference/react/useState
   */
  const [currentIndex, setCurrentIndex] = useState(0);

  /**
   * Moves the carousel left or right by updating the index
   * and scrolling the container to the correct position.
   *
   * scrollTo() reference:
   * https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollTo
   */
  const goTo = (direction: "next" | "prev") => {
    let newIndex = currentIndex;

    if (direction === "next" && currentIndex < experiences.length - 1) {
      newIndex = currentIndex + 1;
    }

    if (direction === "prev" && currentIndex > 0) {
      newIndex = currentIndex - 1;
    }

    setCurrentIndex(newIndex);

    // Scroll 'smoothly' to the new slide
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        left: scrollRef.current.clientWidth * newIndex,
        behavior: "smooth",
      });
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        mt: 4,
        mb: 1,
        width: "100%",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      }}
    >
      {/* 
        Left arrow: only shown when not on the first slide.
        Conditional rendering source:
        https://react.dev/learn/conditional-rendering
      */}
      {currentIndex > 0 && (
        <IconButton
          onClick={() => goTo("prev")}
          sx={{
            position: "absolute",
            top: "50%",
            left: 10,
            transform: "translateY(-50%)",
            zIndex: 10,
            bgcolor: "white",
            boxShadow: 2,
          }}
        >
          <ArrowBackIosNewIcon />
        </IconButton>
      )}

      {/* 
        We use flexbox for horizontal layout, while 'overflow: hidden' prevents
        showing off-screen slides.
        
        https://developer.mozilla.org/en-US/docs/Web/CSS/flex-direction
        https://developer.mozilla.org/en-US/docs/Web/CSS/overflow
      */}
      <Box
        ref={scrollRef}
        sx={{
          display: "flex",
          overflow: "hidden",
          width: "100%",
        }}
      >
        {/**
          We use map() to render a list of 'experiences' here:
          https://react.dev/learn/rendering-lists

          Each slide is full width and prevented from shrinking.
        */}
        {experiences.map((exp) => (
          <Box
            key={exp.id}
            sx={{
              width: "100%", // Full viewport width per slide
              // Prevent shrinking so slides stay full width https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/flex-shrink
              flexShrink: 0,
            }}
          >
            <HomepageExpCardHorizontal
              title={exp.title}
              description={exp.description}
              image={exp.image}
            />
          </Box>
        ))}
      </Box>

      {/* Right arrow: only shown when not on the last slide */}
      {currentIndex < experiences.length - 1 && (
        <IconButton
          onClick={() => goTo("next")}
          sx={{
            position: "absolute",
            top: "50%",
            right: 10,
            transform: "translateY(-50%)",
            zIndex: 10,
            bgcolor: "white",
            boxShadow: 2,
          }}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      )}
    </Box>
  );
};

export default HomepageExpCarousel;

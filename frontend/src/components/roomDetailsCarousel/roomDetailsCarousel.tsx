import React, { useRef, useState } from "react";
import { Box, IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

/**
 * RoomDetailsCarousel is a hero carousel built using 'React state + refs',
 * 'MUI Box + IconButton', and manual scroll-based slide navigation.
 * This approach is similar to the carousel logic we used in the MoviesApp assignment for
 * the FullStack2 module.
 * https://github.com/AndreaNardinocchi/MoviesApp/blob/main/src/pages/homePage.tsx
 * where we also relied on horizontal scrolling containers instead of external libraries.
 */

interface RoomDetailsCarouselProps {
  images: string[];
}

const RoomDetailsCarousel: React.FC<RoomDetailsCarouselProps> = ({
  images,
}) => {
  /**
   * 'scrollRef' is a reference to the scrollable container.
   * We manually scroll this element left/right to simulate a carousel.
   * Similar pattern used in MoviesApp homePage.tsx where we used refs
   * to control horizontal scroll for movie lists.
   * 'useRef' is a hook that associates a DOM element with it, in this case a <div>
   * It is basically used to manipulate the DOM element, and, it is initially set to null
   * until the component mounts.
   * After the component mounts and React renders the DOM node with ref={scrollRef}:
   * https://atomizedobjects.com/blog/react/how-to-use-useref-in-react/
   * https://medium.com/@juvitasaini/useref-understand-with-scroll-example-75ad7139557b
   * https://tj.ie/scrollable-container-controls-with-react-hooks/?
   */
  const scrollRef = useRef<HTMLDivElement>(null);
  /**
   * 'currentIndex' tracks which slide is currently visible.
   * to show or hide arrows and move scroll position
   */
  const [currentIndex, setCurrentIndex] = useState(0);

  /**
   * 'goTo(direction)' moves the carousel left or right.
   * This mirrors the logic in our MoviesApp where we scroll by container width.
   * The parameter 'direction' is a string that indicates the direction of the scroll.
   */
  const goTo = (direction: "next" | "prev") => {
    // Move forward if not at last slide
    let newIndex = currentIndex;

    // Move forward if not at last slide
    if (direction === "next" && currentIndex < images.length - 1) {
      newIndex = currentIndex + 1;
    }

    // Move backward if not at first slide
    if (direction === "prev" && currentIndex > 0) {
      newIndex = currentIndex - 1;
    }

    setCurrentIndex(newIndex);

    /**
     * The '.current' property holds a reference to the actual DOM element, once React assigns it.
     * https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollTo
     */
    if (scrollRef.current) {
      // We call 'scrollTo' on the DOM element 'current'
      scrollRef.current.scrollTo({
        // 'left' defines how far to scroll horizontally
        // as much as the 'clientWidth'
        // https://developer.mozilla.org/en-US/docs/Web/API/Element/clientWidth
        left: scrollRef.current.clientWidth * newIndex,
        behavior: "smooth",
      });
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
        mb: 4,
      }}
    >
      {/* 
        Left Arrow only shown when NOT on the first slide.
      */}
      {currentIndex > 0 && (
        <IconButton
          onClick={() => goTo("prev")}
          sx={{
            position: "absolute",
            top: "50%",
            left: 10,
            // It shifts the element up by 50% of its own height
            transform: "translateY(-50%)",
            zIndex: 10,
            bgcolor: "rgba(255,255,255,0.7)",
            boxShadow: 2,
          }}
        >
          <ArrowBackIosNewIcon />
        </IconButton>
      )}

      {/**
       * Scrollable Image Container
       */}
      <Box
        ref={scrollRef}
        sx={{
          // A flex row where each image takes 100% width.
          display: "flex",
          overflow: "hidden",
          width: "100%",
        }}
      >
        {images.map((img, index) => (
          <Box
            // We add the key to call in the slide 'index'
            key={index}
            sx={{
              width: "100%",
              flexShrink: 0, // Prevents shrinking so each slide stays full width
              aspectRatio: { xs: "1 / 1", sm: "3 / 2", md: "3/1" },
              backgroundImage: `url(${img})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        ))}
      </Box>

      {/* 
  Pagination Dots where each dot represents a slide.
  The active dot is highlighted based on 'currentIndex'.
*/}
      <Box
        sx={{
          position: "absolute",
          bottom: 10,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 1,
        }}
      >
        {images.map((img, index) => (
          <Box
            // We add the key to call in the slide 'index'
            key={index}
            sx={{
              width: 8,
              height: 8,
              // This will return a small dot
              borderRadius: "50%",
              bgcolor:
                // If 'index' is the current one, let's return the non-transparent dot..
                index === currentIndex
                  ? "rgba(255,255,255,1)"
                  : // ...otherwise, return the more transparent one
                    "rgba(255,255,255,0.5)",
              transition: "0.3s",
            }}
          />
        ))}
      </Box>

      {/* 
        Right Arrow only shown when NOT on the last slide.
      */}
      {currentIndex < images.length - 1 && (
        <IconButton
          onClick={() => goTo("next")}
          sx={{
            position: "absolute",
            top: "50%",
            right: 10,
            transform: "translateY(-50%)",
            zIndex: 10,
            bgcolor: "rgba(255,255,255,0.7)",
            boxShadow: 2,
          }}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      )}
    </Box>
  );
};

export default RoomDetailsCarousel;

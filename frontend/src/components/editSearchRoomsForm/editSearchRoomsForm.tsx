import React, { useState, useEffect } from "react";
import type { editSearchRoomsFormProps } from "../../types/interfaces";

/**
 * The editSearchRoomsForm component handles user input updates
 * for check‑in, check‑out, and guest count on the SearchResultsPage
 */

const EditSearchRoomsForm: React.FC<editSearchRoomsFormProps> = ({
  initialCheckIn,
  initialCheckOut,
  initialGuests,
}) => {
  /**
   * Today's date in YYYY-MM-DD format.
   * Used to prevent selecting past dates, and we use it inside the date inputs.
   * https://www.geeksforgeeks.org/javascript/javascript-date-toisostring-method/
   * https://stackoverflow.com/questions/47066555/remove-time-after-converting-date-toisostring#55231024
   */
  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  const [checkIn, setCheckIn] = useState(initialCheckIn);
  const [checkOut, setCheckOut] = useState(initialCheckOut);
  const [guests, setGuests] = useState(initialGuests);

  /**
   * Compute the minimum allowed check-out date.
   * If check-in is selected next day after check-in is
   * the minimum allowed date possible.
   * If not, then, 'tomorrow'
   * */
  const nextDayAfterCheckIn = checkIn
    ? new Date(new Date(checkIn).setDate(new Date(checkIn).getDate() + 1))
        .toISOString()
        .split("T")[0]
    : null;

  /**
   * Tracks whether the screen is mobile-sized.
   * Used to adjust layout direction and spacing.
   * https://dev.to/saiful7778/detecting-mobile-devices-in-react-with-a-custom-hook-4gil
   */
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  /**
   * useEffect is a React Hook that lets you synchronize a component with an external system.
   * https://react.dev/reference/react/useEffect#subscribing-to-events
   * https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
   * Listen for window resize events to update 'isMobile'.
   * This ensures the form layout adapts dynamically.
   * The logic will be used in the html form tag below.
   * https://dev.to/saiful7778/detecting-mobile-devices-in-react-with-a-custom-hook-4gil
   */
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /**
   * updateSearch validates date order, prevents invalid submissions, and
   * redirects to /search-results with updated query params
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
   * https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
   * */
  const updateSearch = () => {
    if (!checkIn || !checkOut) return alert("Please select valid dates");
    if (new Date(checkOut) <= new Date(checkIn))
      return alert("Check‑out must be after check‑in.");
    window.location.href = `/search-results?checkIn=${encodeURIComponent(checkIn)}&checkOut=${encodeURIComponent(checkOut)}&guests=${guests}`;
  };

  return (
    /**
     * Main form wrapper using responsive flexbox layout.
     * https://developer.mozilla.org/en-US/docs/Web/CSS/flex
     * https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout
     * */
    <form
      onSubmit={(e) => {
        e.preventDefault();
        updateSearch();
      }}
      style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        flexWrap: isMobile ? "nowrap" : "wrap",
        alignItems: isMobile ? "stretch" : "flex-end",
        justifyContent: "center",
        gap: isMobile ? "0.75rem" : "1rem",
        width: "100%",
        maxWidth: "100%",
        margin: "0 auto",
        padding: isMobile ? "0.5rem" : "1rem",
        boxSizing: "border-box",
        // Prevent horizontal scroll on small screens
        // https://developer.mozilla.org/en-US/docs/Web/CSS/overflow-x
        overflowX: "hidden",
      }}
    >
      {/* Check-in */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minWidth: isMobile ? "100%" : "180px",
        }}
      >
        <label
          /**
           * Label improves accessibility by linking text to input.
           * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label
           * */
          style={{ marginBottom: "0.5rem", fontWeight: "bold" }}
        >
          Check‑in
        </label>
        <input
          type="date"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          required
          /**
           * HTML date input min attribute:
           * Prevents selecting dates earlier than today.
           * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date#min
           */
          min={today}
          style={{
            padding: "0.75rem",
            fontSize: "1rem",
            borderRadius: "10px",
            border: "1px solid #ccc",
            width: "100%",
            boxSizing: "border-box",
          }}
        />
      </div>
      {/* Check-out */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minWidth: isMobile ? "100%" : "180px",
        }}
      >
        <label style={{ marginBottom: "0.5rem", fontWeight: "bold" }}>
          Check‑out
        </label>
        <input
          type="date"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          required
          /**
           * Ensures check-out cannot be before check-in, nor can it be the same day.
           * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date
           */
          min={nextDayAfterCheckIn || tomorrowStr}
          style={{
            padding: "0.75rem",
            fontSize: "1rem",
            borderRadius: "10px",
            border: "1px solid #ccc",
            width: "100%",
            boxSizing: "border-box",
          }}
        />
      </div>
      {/* Guests */}
      <div
        /** * Guests field container * Uses a slightly smaller minWidth on desktop */ style={{
          display: "flex",
          flexDirection: "column",
          minWidth: isMobile ? "100%" : "120px",
        }}
      >
        <label style={{ marginBottom: "0.5rem", fontWeight: "bold" }}>
          Guests
        </label>
        <input
          type="number"
          /**
           * HTML number input min attribute:
           * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/number#min
           * */
          min={1}
          max={4}
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          style={{
            padding: "0.85rem",
            paddingRight: "7.2rem",

            fontSize: "1rem",
            borderRadius: "10px",
            border: "1px solid #ccc",
            width: "100%",
            boxSizing: "border-box",
          }}
        />
      </div>
      {/* Submit */}
      <button
        type="submit"
        /**
         * Standard button styling.
         * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button
         * */
        style={{
          height: "3rem",
          padding: "0 1.5rem",
          fontSize: "1rem",
          fontWeight: 500,
          borderRadius: "10px",
          border: "none",
          backgroundColor: "#472d30",
          color: "#fff",
          cursor: "pointer",
          width: isMobile ? "100%" : "auto",
          transition: "transform 0.1s ease",
        }}
        /**
         * We are adding some styling when clicking on the 'Search Rooms'
         * button, so the user will get a response from the UI upon
         * submission.
         * https://www.w3schools.com/jsref/event_onmousedown.asp
         * https://www.w3schools.com/jsref/event_currenttarget.asp
         */
        onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
        onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        Update Search
      </button>
    </form>
  );
};

export default EditSearchRoomsForm;

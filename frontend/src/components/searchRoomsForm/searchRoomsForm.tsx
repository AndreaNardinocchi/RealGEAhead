import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SearchFormData } from "../../types/interfaces";
import useRoomsSearching from "../../hooks/useRoomsSearching";

/**
 * The SearchRoomsForm component handles user input for check‑in, check‑out, and guest count.
 */

const SearchRoomsForm: React.FC = () => {
  /**
   * Extract the searchAvailableRooms function from BookingContext.
   * This abstracts away Supabase logic from the UI.
   */
  const { availableRoomsSearchObjectType } = useRoomsSearching();

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

  const navigate = useNavigate();

  // Form state for check-in, check-out, and guest count
  const [formData, setFormData] = useState<SearchFormData>({
    checkIn: "",
    checkOut: "",
    guests: 1,
  });

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
   * Generic input handler for all form fields.
   * Converts guests to a number while keeping dates as strings.
   * */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Extract the input's name and value from the event.
    const { name, value } = e.target;
    // Update the formData state by keeping all previous fields (...prev)
    // https://www.geeksforgeeks.org/reactjs/how-to-get-previous-state-in-reactjs-functional-component/
    setFormData((prev) => ({
      ...prev,
      // Convert "guests" to a number (because input values are strings)
      [name]: name === "guests" ? Number(value) : value,
    }));
  };

  /**
   * Form submission handler prevents default form behavior
   * Calls the searchAvailableRooms RPC wrapper in supabase
   * Redirects to /search-results with query params on success
   *
   * https://jsdev.space/react-form-events-guide/
   * */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    /**
     * Call the context function that queries available rooms.
     * This function wraps the Supabase RPC call in availableRooms.ts :
     * https://supabase.com/docs/reference/javascript/rpc
     *
     * It returns a normalized object:
     * {
     *   success: boolean,
     *   rooms: Room[],
     *   message?: string
     * }
     */
    const result = await availableRoomsSearchObjectType(
      formData.checkIn,
      formData.checkOut,
      formData.guests,
    );

    /**
     * If the search failed, it shows the error message to the user and stop the submission flow.
     * https://developer.mozilla.org/en-US/docs/Web/API/Window/alert
     */
    if (!result.success) {
      alert(result.message);
      return;
    }

    /**
     * If the search succeeded, navigate to the Search Results page.
     * The selected parameters are passed through the URL query string.
     *
     * React Router navigate():
     * https://reactrouter.com/en/main/hooks/use-navigate
     */

    // https://docs.scala-lang.org/toolkit/http-client-uris.html
    // https://developer.mozilla.org/en-US/docs/Web/URI/Reference/Query
    navigate(
      `/search-results?checkIn=${formData.checkIn}&checkOut=${formData.checkOut}&guests=${formData.guests}`,
    );
  };

  /**
   * Compute the minimum allowed check-out date.
   * If check-in is selected next day after check-in is
   * the minimum allowed date possible.
   * If not, then, 'tomorrow'
   * */
  const nextDayAfterCheckIn = formData.checkIn
    ? new Date(
        new Date(formData.checkIn).setDate(
          new Date(formData.checkIn).getDate() + 1,
        ),
      )
        .toISOString()
        .split("T")[0]
    : null;

  return (
    /**
     * Main form wrapper which uses a responsive flexbox layout:
     * https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout
     * https://react.dev/learn#adding-styles
     */
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row", // Stack on mobile, row on desktop
        flexWrap: isMobile ? "nowrap" : "wrap", // Prevent wrapping on mobile
        alignItems: isMobile ? "stretch" : "flex-end",
        justifyContent: "center",
        gap: isMobile ? "0.75rem" : "1rem",
        width: "100%",
        maxWidth: "100%",
        margin: "0 auto",
        padding: isMobile ? "0.5rem" : "1rem",
        boxSizing: "border-box",
        // Prevent horizontal scroll on small screens
        // https://www.w3docs.com/learn-css/overflow-x.html
        overflowX: "hidden",
      }}
    >
      {/* Check-in Field */}
      <div
        /**
         * Column layout for label + input.
         * Full width on mobile for usability.
         * https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design
         */
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
           */
          style={{ marginBottom: "0.5rem", fontWeight: "bold" }}
        >
          Check-in
        </label>

        <input
          type="date"
          name="checkIn"
          value={formData.checkIn}
          // This will handle the data inputted by the guest
          onChange={handleChange}
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

      {/*  Check-out Field */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minWidth: isMobile ? "100%" : "180px",
        }}
      >
        <label style={{ marginBottom: "0.5rem", fontWeight: "bold" }}>
          Check-out
        </label>

        <input
          type="date"
          name="checkOut"
          value={formData.checkOut}
          // This will handle the data inputted by the guest
          onChange={handleChange}
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

      {/* Guests Field */}
      <div
        style={{
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
          name="guests"
          value={formData.guests}
          onChange={handleChange}
          /**
           * HTML number input min attribute:
           * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/number#min
           */
          min={1}
          style={{
            padding: "0.85rem",
            fontSize: "1rem",
            borderRadius: "10px",
            border: "1px solid #ccc",
            width: "100%",
            boxSizing: "border-box",
          }}
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        /**
         * Standard button styling.
         * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button
         */
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
        Search Rooms
      </button>
    </form>
  );
};

export default SearchRoomsForm;

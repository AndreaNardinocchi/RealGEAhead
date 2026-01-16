import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SearchFormData } from "../../types/interfaces";
import { useSearchRooms } from "../../contexts/searchRoomsContext";

/**
 * The SearchRoomsForm component handles user input for check‑in, check‑out, and guest count.
 */

const SearchRoomsForm: React.FC = () => {
  // Access the context function, as this extracts the searchRooms
  // function from the context
  const { searchRooms } = useSearchRooms();

  /**
   * Today's date in YYYY-MM-DD format.
   * Used to prevent selecting past dates, and we use it inside the date inputs.
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
   */
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  /**
   * Listen for window resize events to update 'isMobile'.
   */
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /** -----------------------------
   * Handle input changes
   * ----------------------------- */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "guests" ? Number(value) : value,
    }));
  };

  /** -----------------------------
   * Handle form submission
   * ----------------------------- */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Call the context function, as this will make
    // the form actually use the context
    searchRooms(formData);

    navigate(
      `/search-results?checkIn=${formData.checkIn}&checkOut=${formData.checkOut}&guests=${formData.guests}`
    );
  };

  /**
   * Compute the minimum allowed check-out date.
   */
  const nextDayAfterCheckIn = formData.checkIn
    ? new Date(
        new Date(formData.checkIn).setDate(
          new Date(formData.checkIn).getDate() + 1
        )
      )
        .toISOString()
        .split("T")[0]
    : null;

  return (
    /**
     * Main form wrapper which uses a responsive flexbox layout
     */
    <form
      onSubmit={handleSubmit}
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
        overflowX: "hidden",
      }}
    >
      {/* Check-in Field */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minWidth: isMobile ? "100%" : "180px",
        }}
      >
        <label style={{ marginBottom: "0.5rem", fontWeight: "bold" }}>
          Check-in
        </label>

        <input
          type="date"
          name="checkIn"
          value={formData.checkIn}
          onChange={handleChange}
          required
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
          onChange={handleChange}
          required
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
        }}
      >
        Search Rooms
      </button>
    </form>
  );
};

export default SearchRoomsForm;

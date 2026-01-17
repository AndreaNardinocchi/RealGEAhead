import { useContext } from "react";
import { SearchRoomContext } from "../contexts/searchRoomsContext";

/**
 * 'useRoomSearching' is a custom React hook that provides access to the 'SearchRoomContext'.
 * This ensures components can easily consume booking‑related functions
 * without manually importing or calling useContext everywhere.
 * https://react.dev/reference/react/useContext
 * https://react.dev/learn/reusing-logic-with-custom-hooks
 */
export default function useRoomsSearching() {
  // Retrieve the current context value
  const ctx = useContext(SearchRoomContext);

  /**
   * If the hook is used outside of <BookingProvider>,
   * the context value will be undefined.
   * Throwing an error here prevents silent failures and
   * makes debugging much easier.
   */
  if (!ctx) {
    throw new Error("useBooking must be used inside BookingProvider");
  }

  // Return the validated context object
  return ctx;
}

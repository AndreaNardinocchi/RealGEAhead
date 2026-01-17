import React, { createContext } from "react";
import { searchAvailableRooms } from "../supabase/availableRooms";
import { SearchRoomContextType } from "../types/interfaces";

/**
 * Creating the const SearchRoomContext with the interface SearchRoomContext.
 * It provides a shared searchRooms function to the entire app, letting the
 * searchRoomForm trigger a room search.
 *
 * https://github.com/AndreaNardinocchi/MoviesApp/blob/main/src/contexts/moviesContext.tsx
 *
 * SearchRoomProvider wraps the application with SearchRoomContext,
 * making booking‑related functions available to all child components.
 *
 * https://react.dev/reference/react/createContext
 *
 * This context currently only logs the data. The next steps,
 * we will expand with a real async function
 * that calls a service layer to search available rooms.
 */
export const SearchRoomContext = createContext<
  SearchRoomContextType | undefined
>(undefined);

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  /**
   * Calls the service layers 'searchAvailableRooms.ts' to fetch available rooms
   * based on check‑in date, check‑out date, and number of guests.
   * It wraps the service call in a try/catch block preventing unhandled
   * promise rejections inside the context.
   * Finally, its name must match the BookingContextType name through which we pass the user inputted data.
   * As a matter of fact, the context provider exposes this function through its 'value' prop.
   * If the names do not match, TypeScript will report a type mismatch.
   **/

  const availableRoomsSearchObjectType = async (
    checkIn: string,
    checkOut: string,
    guests: number
  ) => {
    try {
      const result = await searchAvailableRooms(checkIn, checkOut, guests);
      return result;
    } catch {
      return { success: false, rooms: [], message: "Error fetching rooms." };
    }
  };

  // Providing the context to all children.
  // Value is now called in from the interface
  return (
    <SearchRoomContext.Provider value={{ availableRoomsSearchObjectType }}>
      {children}
    </SearchRoomContext.Provider>
  );
};

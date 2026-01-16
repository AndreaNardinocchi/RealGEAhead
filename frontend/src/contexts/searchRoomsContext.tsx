import React, { createContext, useContext } from "react";
import { SearchFormData } from "../types/interfaces";

/**
 * Creating the const SearchRoomContext with the interface SearchRoomContext.
 * It provides a shared searchRooms function to the entire app, letting the
 * searchRoomForm trigger a room search.
 *
 * https://github.com/AndreaNardinocchi/MoviesApp/blob/main/src/contexts/moviesContext.tsx
 */
interface SearchRoomContextType {
  searchRooms: (data: SearchFormData) => void;
}

/**
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
  // Placeholder search function.
  const searchRooms = (data: SearchFormData) => {
    console.log("Pretend searching rooms:", data);
  };

  /** The value object passed to the provider.
   *
   * This object will later include the values needed:
   * availableRooms
   * loading state
   * error state
   * */

  const value: SearchRoomContextType = {
    searchRooms,
  };

  // Providing the context to all children.
  return (
    <SearchRoomContext.Provider value={value}>
      {children}
    </SearchRoomContext.Provider>
  );
};

// Custom hook to access the SearchRoomContext
export const useSearchRooms = () => {
  const ctx = useContext(SearchRoomContext);
  if (!ctx) {
    throw new Error("useSearchRooms must be used inside a SearchProvider");
  }
  return ctx;
};

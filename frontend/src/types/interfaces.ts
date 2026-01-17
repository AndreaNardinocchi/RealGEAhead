/**
 * The below interface type is being used in the 'homepageExpCarousel.tsx' component
 * as a prop
 */
export type Experience = {
  id: number;
  title: string;
  description: string;
  image: string;
};

/**
 * The below interface type is being used in the 'roomsPage.tsx' component
 * as a prop
 */
export interface Room {
  id: string;
  name: string;
  description?: string;
  capacity?: number;
  price?: number;
  images: string[];
  amenities?: string[];
}

/**
 * Shape of the data collected by the Search Rooms form.
 * Represents the user's booking criteria before searching for available rooms.
 */
export interface SearchFormData {
  checkIn: string;
  checkOut: string;
  guests: number;
}

export type SearchRoomContextType = {
  /**
   * availableRoomsSearchObjectType is a function that queries available rooms based on:
   * checkIn, checkOut, and guests number.
   * It returns a Promise resolving to an object
   * This function is implemented in the 'SearchRoomContext.ts' which wraps
   * the Supabase RPC call in searchAvailableRooms.ts.
   * https://react.dev/reference/react/use
   */
  availableRoomsSearchObjectType: (
    checkIn: string,
    checkOut: string,
    guests: number
  ) => Promise<{
    success: boolean; // Indicates whether the search was successful
    rooms: any[]; // Array of available rooms returned from the database
    message?: string; // Optional message for errors or additional info
  }>;
};

/**
 * Props for rendering the 'roomHorizontalCard' in the SearchResultsPage.
 *
 * */
export type RoomHorizontalCardProps = {
  id: string;
  name: string;
  description?: string;
  // This is just a placeholder image which will be removed as soon as data is fetched from supabase
  // firstImage?: string | null;
  price?: number;
  images?: string[];
  amenities?: string[];
  checkIn: string;
  checkOut: string;
  guests: number;
  capacity: number;
};

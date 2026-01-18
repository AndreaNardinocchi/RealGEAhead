import { getPublicUrl } from "../utils/supabaseAssetsStorage";

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
 * experiences
 *
 * This array provides the content for the Experience Carousel.
 * Each item includes:
 * - id: unique identifier
 * - title: heading text
 * - description: supporting paragraph
 * - image: placeholder image URL
 */
export const experiences: Experience[] = [
  {
    id: 1,
    title: "Explore Cliff Trails",
    description:
      "Beautiful paths perfect for hiking, guiding you across cliffside trails and quiet stretches of stunning Atlantic coastline. ",
    image: getPublicUrl("hiking-experience.jpg"),
  },
  {
    id: 2,
    title: "Seaweed Soak, Sure Why Not",
    description:
      "Slip into a warm Atlantic seaweed bath and let the stress melt away. Pure Irish wellness, with a bit of salty magic.",
    image: getPublicUrl("seaweed-bath.jpg"),
  },
  {
    id: 3,
    title: "A Drop of the Good Stuff",
    description:
      "Taste local Irish whiskey and soak up the stories behind every sip. A relaxed, friendly way to connect with the coast and its culture.",
    image: getPublicUrl("whiskey-tasting.jpg"),
  },
  {
    id: 4,
    title: "Paddle Your Own Way",
    description:
      "Explore calm bays, hidden inlets, or open water at your own pace. Perfect for a gentle adventure and a fresh Atlantic breeze.",
    image: getPublicUrl("kayaking-experience.jpg"),
  },
];

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
    guests: number,
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

// Signed up User interface
export interface User {
  first_name: string;
  last_name: string;
  zip_code: string;
  id: string;
  email: string;
  role?: string;
  country: string;
  created_at: string;
}

/**
 * Interface describing the shape of the authentication context.
 */
export interface AuthContextInterface {
  // Indicates whether authentication-related operations are in progress
  loading: any;
  // The current authentication token, or null if not authenticated
  token: string | null;
  user: User | null;
  /**
   * Handles authentication using Supabase session data.
   * supabaseData is the object containing user and session information from Supabase
   */
  authenticate: (supabaseData: { user: any; session: any }) => Promise<void>;
  // Signs the user out and clears authentication state
  signout: () => void;
}

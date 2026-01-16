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
export interface BookingFormData {
  checkIn: string;
  checkOut: string;
  guests: number;
}

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

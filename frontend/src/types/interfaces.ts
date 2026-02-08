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
 * 'experiences'
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
  // Triggers a password reset process for the given user
  resetPassword: (
    email: string,
  ) => Promise<{ success?: boolean; error?: string }>;
}

// Represents a country with its ISO code and display name.
export interface Country {
  //Two‑letter ISO country code
  code: string;
  // Full country name
  name: string;
}

// List of all countries that we are using in the sign up dropdown
export const countries: Country[] = [
  { code: "AF", name: "Afghanistan" },
  { code: "AL", name: "Albania" },
  { code: "DZ", name: "Algeria" },
  { code: "AS", name: "American Samoa" },
  { code: "AD", name: "Andorra" },
  { code: "AO", name: "Angola" },
  { code: "AI", name: "Anguilla" },
  { code: "AQ", name: "Antarctica" },
  { code: "AG", name: "Antigua and Barbuda" },
  { code: "AR", name: "Argentina" },
  { code: "AM", name: "Armenia" },
  { code: "AW", name: "Aruba" },
  { code: "AU", name: "Australia" },
  { code: "AT", name: "Austria" },
  { code: "AZ", name: "Azerbaijan" },
  { code: "BS", name: "Bahamas" },
  { code: "BH", name: "Bahrain" },
  { code: "BD", name: "Bangladesh" },
  { code: "BB", name: "Barbados" },
  { code: "BY", name: "Belarus" },
  { code: "BE", name: "Belgium" },
  { code: "BZ", name: "Belize" },
  { code: "BJ", name: "Benin" },
  { code: "BM", name: "Bermuda" },
  { code: "BT", name: "Bhutan" },
  { code: "BO", name: "Bolivia" },
  { code: "BA", name: "Bosnia and Herzegovina" },
  { code: "BW", name: "Botswana" },
  { code: "BR", name: "Brazil" },
  { code: "IO", name: "British Indian Ocean Territory" },
  { code: "BN", name: "Brunei" },
  { code: "BG", name: "Bulgaria" },
  { code: "BF", name: "Burkina Faso" },
  { code: "BI", name: "Burundi" },
  { code: "CV", name: "Cabo Verde" },
  { code: "KH", name: "Cambodia" },
  { code: "CM", name: "Cameroon" },
  { code: "CA", name: "Canada" },
  { code: "KY", name: "Cayman Islands" },
  { code: "CF", name: "Central African Republic" },
  { code: "TD", name: "Chad" },
  { code: "CL", name: "Chile" },
  { code: "CN", name: "China" },
  { code: "CX", name: "Christmas Island" },
  { code: "CC", name: "Cocos (Keeling) Islands" },
  { code: "CO", name: "Colombia" },
  { code: "KM", name: "Comoros" },
  { code: "CG", name: "Congo" },
  { code: "CD", name: "Congo (DRC)" },
  { code: "CK", name: "Cook Islands" },
  { code: "CR", name: "Costa Rica" },
  { code: "CI", name: "Côte d’Ivoire" },
  { code: "HR", name: "Croatia" },
  { code: "CU", name: "Cuba" },
  { code: "CY", name: "Cyprus" },
  { code: "CZ", name: "Czech Republic" },
  { code: "DK", name: "Denmark" },
  { code: "DJ", name: "Djibouti" },
  { code: "DM", name: "Dominica" },
  { code: "DO", name: "Dominican Republic" },
  { code: "EC", name: "Ecuador" },
  { code: "EG", name: "Egypt" },
  { code: "SV", name: "El Salvador" },
  { code: "GQ", name: "Equatorial Guinea" },
  { code: "ER", name: "Eritrea" },
  { code: "EE", name: "Estonia" },
  { code: "SZ", name: "Eswatini" },
  { code: "ET", name: "Ethiopia" },
  { code: "FK", name: "Falkland Islands" },
  { code: "FO", name: "Faroe Islands" },
  { code: "FJ", name: "Fiji" },
  { code: "FI", name: "Finland" },
  { code: "FR", name: "France" },
  { code: "GF", name: "French Guiana" },
  { code: "PF", name: "French Polynesia" },
  { code: "GA", name: "Gabon" },
  { code: "GM", name: "Gambia" },
  { code: "GE", name: "Georgia" },
  { code: "DE", name: "Germany" },
  { code: "GH", name: "Ghana" },
  { code: "GI", name: "Gibraltar" },
  { code: "GR", name: "Greece" },
  { code: "GL", name: "Greenland" },
  { code: "GD", name: "Grenada" },
  { code: "GP", name: "Guadeloupe" },
  { code: "GU", name: "Guam" },
  { code: "GT", name: "Guatemala" },
  { code: "GG", name: "Guernsey" },
  { code: "GN", name: "Guinea" },
  { code: "GW", name: "Guinea-Bissau" },
  { code: "GY", name: "Guyana" },
  { code: "HT", name: "Haiti" },
  { code: "HN", name: "Honduras" },
  { code: "HK", name: "Hong Kong" },
  { code: "HU", name: "Hungary" },
  { code: "IS", name: "Iceland" },
  { code: "IN", name: "India" },
  { code: "ID", name: "Indonesia" },
  { code: "IR", name: "Iran" },
  { code: "IQ", name: "Iraq" },
  { code: "IE", name: "Ireland" },
  { code: "IM", name: "Isle of Man" },
  { code: "IL", name: "Israel" },
  { code: "IT", name: "Italy" },
  { code: "JM", name: "Jamaica" },
  { code: "JP", name: "Japan" },
  { code: "JE", name: "Jersey" },
  { code: "JO", name: "Jordan" },
  { code: "KZ", name: "Kazakhstan" },
  { code: "KE", name: "Kenya" },
  { code: "KI", name: "Kiribati" },
  { code: "KW", name: "Kuwait" },
  { code: "KG", name: "Kyrgyzstan" },
  { code: "LA", name: "Laos" },
  { code: "LV", name: "Latvia" },
  { code: "LB", name: "Lebanon" },
  { code: "LS", name: "Lesotho" },
  { code: "LR", name: "Liberia" },
  { code: "LY", name: "Libya" },
  { code: "LI", name: "Liechtenstein" },
  { code: "LT", name: "Lithuania" },
  { code: "LU", name: "Luxembourg" },
  { code: "MO", name: "Macao" },
  { code: "MG", name: "Madagascar" },
  { code: "MW", name: "Malawi" },
  { code: "MY", name: "Malaysia" },
  { code: "MV", name: "Maldives" },
  { code: "ML", name: "Mali" },
  { code: "MT", name: "Malta" },
  { code: "MH", name: "Marshall Islands" },
  { code: "MQ", name: "Martinique" },
  { code: "MR", name: "Mauritania" },
  { code: "MU", name: "Mauritius" },
  { code: "YT", name: "Mayotte" },
  { code: "MX", name: "Mexico" },
  { code: "FM", name: "Micronesia" },
  { code: "MD", name: "Moldova" },
  { code: "MC", name: "Monaco" },
  { code: "MN", name: "Mongolia" },
  { code: "ME", name: "Montenegro" },
  { code: "MS", name: "Montserrat" },
  { code: "MA", name: "Morocco" },
  { code: "MZ", name: "Mozambique" },
  { code: "MM", name: "Myanmar" },
  { code: "NA", name: "Namibia" },
  { code: "NR", name: "Nauru" },
  { code: "NP", name: "Nepal" },
  { code: "NL", name: "Netherlands" },
  { code: "NC", name: "New Caledonia" },
  { code: "NZ", name: "New Zealand" },
  { code: "NI", name: "Nicaragua" },
  { code: "NE", name: "Niger" },
  { code: "NG", name: "Nigeria" },
  { code: "NU", name: "Niue" },
  { code: "KP", name: "North Korea" },
  { code: "MK", name: "North Macedonia" },
  { code: "MP", name: "Northern Mariana Islands" },
  { code: "NO", name: "Norway" },
  { code: "OM", name: "Oman" },
  { code: "PK", name: "Pakistan" },
  { code: "PW", name: "Palau" },
  { code: "PS", name: "Palestine" },
  { code: "PA", name: "Panama" },
  { code: "PG", name: "Papua New Guinea" },
  { code: "PY", name: "Paraguay" },
  { code: "PE", name: "Peru" },
  { code: "PH", name: "Philippines" },
  { code: "PL", name: "Poland" },
  { code: "PT", name: "Portugal" },
  { code: "PR", name: "Puerto Rico" },
  { code: "QA", name: "Qatar" },
  { code: "RO", name: "Romania" },
  { code: "RU", name: "Russia" },
  { code: "RW", name: "Rwanda" },
  { code: "KN", name: "Saint Kitts and Nevis" },
  { code: "LC", name: "Saint Lucia" },
  { code: "VC", name: "Saint Vincent and the Grenadines" },
  { code: "WS", name: "Samoa" },
  { code: "SM", name: "San Marino" },
  { code: "ST", name: "Sao Tome and Principe" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "SN", name: "Senegal" },
  { code: "RS", name: "Serbia" },
  { code: "SC", name: "Seychelles" },
  { code: "SL", name: "Sierra Leone" },
  { code: "SG", name: "Singapore" },
  { code: "SK", name: "Slovakia" },
  { code: "SI", name: "Slovenia" },
  { code: "SB", name: "Solomon Islands" },
  { code: "SO", name: "Somalia" },
  { code: "ZA", name: "South Africa" },
  { code: "KR", name: "South Korea" },
  { code: "SS", name: "South Sudan" },
  { code: "ES", name: "Spain" },
  { code: "LK", name: "Sri Lanka" },
  { code: "SD", name: "Sudan" },
  { code: "SR", name: "Suriname" },
  { code: "SE", name: "Sweden" },
  { code: "CH", name: "Switzerland" },
  { code: "SY", name: "Syria" },
  { code: "TW", name: "Taiwan" },
  { code: "TJ", name: "Tajikistan" },
  { code: "TZ", name: "Tanzania" },
  { code: "TH", name: "Thailand" },
  { code: "TL", name: "Timor-Leste" },
  { code: "TG", name: "Togo" },
  { code: "TO", name: "Tonga" },
  { code: "TT", name: "Trinidad and Tobago" },
  { code: "TN", name: "Tunisia" },
  { code: "TR", name: "Turkey" },
  { code: "TM", name: "Turkmenistan" },
  { code: "TV", name: "Tuvalu" },
  { code: "UG", name: "Uganda" },
  { code: "UA", name: "Ukraine" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "GB", name: "United Kingdom" },
  { code: "US", name: "United States" },
  { code: "UY", name: "Uruguay" },
  { code: "UZ", name: "Uzbekistan" },
  { code: "VU", name: "Vanuatu" },
  { code: "VA", name: "Vatican City" },
  { code: "VE", name: "Venezuela" },
  { code: "VN", name: "Vietnam" },
  { code: "YE", name: "Yemen" },
  { code: "ZM", name: "Zambia" },
  { code: "ZW", name: "Zimbabwe" },
];

/**
 * These props are needed on the SearchResultsPage
 */
export interface editSearchRoomsFormProps {
  initialCheckIn: string;
  initialCheckOut: string;
  initialGuests: number;
}

/**
 * Props definition for RoomDetailsCard which describes all the data,
 * and callback functions that the RoomDetailsCard component needs to render.
 * The parent component (RoomDetailsPage) controls the booking state,
 * while RoomDetailsCard focuses purely on displaying the UI and sending out
 * the user actions.
 */
export interface RoomDetailsCardProps {
  room: {
    name: string;
    description: string;
    amenities: string[];
    price: number;
    capacity: number;
  };
  // These values will be passed by the RoomDetailsPage
  // State values
  guests: number;
  checkIn: string;
  checkOut: string;
  // State setters
  // https://www.typescriptlang.org/docs/handbook/2/functions.html
  setGuests: (n: number) => void;
  setCheckIn: (date: string) => void;
  setCheckOut: (date: string) => void;
  // Action callback
  onBook: () => void;
}

/**
 * This Booking interface is used in the AccountMyTripsPage
 * As the API function 'getUserBookings' enriches each booking by attaching
 * the full room object, we need an interface reflecting that.
 *
 *
 */
export interface Booking {
  id: string;
  user_id: string;
  created_at: string;
  check_in: string;
  check_out: string;
  guests: number;
  total_price: string;
  room_id: string;
  /**
   * Supabase returns the related room as a single nested object
   * because each booking belongs to exactly one room.
   * This structure comes directly from the relational join:
   *   select(`*, rooms(id, name, images, price)`)
   */
  rooms: {
    id: string;
    name: string;
    images: string[];
    price: string;
    capacity: string;
  };
}

/**
 * Props for the EditProfileDialog component, which defines the shape
 * of data passed from the userProfilePage.
 */
export interface EditProfileDialogProps {
  // This is the prop for the modal
  open: boolean;
  // The user data that will be passed to update
  formData: {
    first_name: string;
    last_name: string;
    country: string;
    zip_code: string;
  };
  // Modal functions
  setFormData: (data: any) => void;
  onClose: () => void;
  onSave: () => void;
}

/**
 * This interface is used in adminBookingsPage to render the joined
 * Bookings and auth.users table as per rpc function 'get_all_bookings'
 */
export interface BookingWithUser {
  id: string;
  room_id: string;
  user_id: string;
  user_email: string;
  first_name: string;
  last_name: string;
  check_in: string;
  check_out: string;
  guests: number;
  total_price: number;
  created_at: string;
  charged: boolean;
}

/**
 * Props for the AdminBookingModal component.
 * Defines all data and handlers required to display and manage the
 * admin booking form modal.
 */
export interface BookingModalProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  // List of available rooms used to populate the room dropdown
  rooms: Room[];
  // If provided, the modal is in "edit" mode; otherwise it's creating a new booking
  editingBooking: BookingWithUser | null;
  // Current values of the booking form fields
  bookingForm: {
    room_id: string;
    user_email: string;
    check_in: string;
    check_out: string;
    guests: string;
  };
  /**
   * State setter used to update individual booking form fields.
   * Passed down from the parent so the modal can modify form state.
   * http://stackoverflow.com/questions/65823778/ddg#65824149
   * https://www.xjavascript.com/blog/how-can-i-define-type-for-setstate-when-react-dispatch-react-setstateaction-string-not-accepted/
   */
  setBookingForm: React.Dispatch<
    React.SetStateAction<{
      room_id: string;
      user_email: string;
      check_in: string;
      check_out: string;
      guests: string;
    }>
  >;
}

/**
 * Props for the AdminUserModal component.
 * Defines all data and handlers required to display and manage the
 * admin user form modal.
 */
export interface UserModalProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  countries: Country[];
  // If provided, the modal is in "edit" mode; otherwise it's creating a new user
  editingUser: User | null;
  // Current values of the user form fields
  userForm: {
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    country: string;
    zip_code: string;
  };
  /**
   * State setter used to update individual user form fields.
   * Passed down from the parent so the modal can modify form state.
   * http://stackoverflow.com/questions/65823778/ddg#65824149
   * https://www.xjavascript.com/blog/how-can-i-define-type-for-setstate-when-react-dispatch-react-setstateaction-string-not-accepted/
   */
  setUserForm: React.Dispatch<
    React.SetStateAction<{
      first_name: string;
      last_name: string;
      email: string;
      role: string;
      country: string;
      zip_code: string;
    }>
  >;
}

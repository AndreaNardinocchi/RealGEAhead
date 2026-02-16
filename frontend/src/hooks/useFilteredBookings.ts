import { getRoomName } from "../utils/getRoomName";

export function useFilteredBookings(
  bookings: any[] | undefined,
  rooms: any[] | undefined,
  filters: any,
) {
  const list = bookings ?? [];
  const roomList = rooms ?? [];

  return list.filter((b: any) => {
    // Creating search variable
    const search = filters.search.toLowerCase();

    // Filtered data
    // https://www.kindacode.com/article/how-to-create-a-filter-search-list-in-react
    // https://www.cybrosys.com/blog/how-to-build-a-search-bar-to-filter-data-in-react
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes
    const searchString = [
      b.id,
      b.first_name,
      b.last_name,
      b.user_email,
      getRoomName(b.room_id, roomList),
      b.check_in,
      b.check_out,
      b.guests,
      b.total_price,
      new Date(b.created_at).toLocaleString(),
      b.charged,
    ]
      // We combine all the booking fields to be able to search anything that is included in the rows
      .join(" ")
      .toLowerCase();

    // Check if the global search text appears anywhere in the combined search string
    const matchesSearch = searchString.includes(search);

    // Match room by exact room_id (empty filter means "match all")
    const matchesRoom = filters.room
      ? String(b.room_id) === String(filters.room)
      : true;

    // Match first name (case‑insensitive)
    const matchesFirst = filters.first_name
      ? b.first_name?.toLowerCase().includes(filters.first_name.toLowerCase())
      : true;

    // Match last name (case‑insensitive)
    const matchesLast = filters.last_name
      ? b.last_name?.toLowerCase().includes(filters.last_name.toLowerCase())
      : true;

    // Match email (case‑insensitive)
    const matchesEmail = filters.email
      ? b.user_email?.toLowerCase().includes(filters.email.toLowerCase())
      : true;

    // Match number of guests (string → number)
    const matchesGuests = filters.guests
      ? b.guests === Number(filters.guests)
      : true;

    // Match check‑in date (compare only the date portion)
    const matchesCheckIn = filters.check_in
      ? new Date(b.check_in).toDateString() ===
        new Date(filters.check_in).toDateString()
      : true;

    // Match check‑out date
    const matchesCheckOut = filters.check_out
      ? new Date(b.check_out).toDateString() ===
        new Date(filters.check_out).toDateString()
      : true;

    // Match created_at date
    const matchesCreatedAt = filters.created_at
      ? new Date(b.created_at).toDateString() ===
        new Date(filters.created_at).toDateString()
      : true;

    // Match charged status ("Yes" means true, "No" means false)
    let matchesCharged = true;

    // If the user selected "Yes", then the booking must have charged === true
    if (filters.charged === "Yes") {
      matchesCharged = b.charged === true;
      // If the user selected "No", then the booking must have charged === false
    } else if (filters.charged === "No") {
      matchesCharged = b.charged === false;
      // If the user selected nothing (""), we leave matchesCharged = true
      // Meaning: do not filter by charged status
    }

    // Booking passes only if all filters match
    return (
      matchesSearch &&
      matchesRoom &&
      matchesFirst &&
      matchesLast &&
      matchesEmail &&
      matchesGuests &&
      matchesCheckIn &&
      matchesCheckOut &&
      matchesCreatedAt &&
      matchesCharged
    );
  });
}

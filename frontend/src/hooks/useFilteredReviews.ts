import { getRoomName } from "../utils/getRoomName";

export function useFilteredReviews(
  reviews: any[] | undefined,
  rooms: any[] | undefined,
  filters: any,
) {
  const reviewList = reviews ?? [];
  const roomList = rooms ?? [];

  return reviewList.filter((r: any) => {
    // Creating search variable
    const search = filters.search.toLowerCase();

    // Filtered data
    // https://www.kindacode.com/article/how-to-create-a-filter-search-list-in-react
    // https://www.cybrosys.com/blog/how-to-build-a-search-bar-to-filter-data-in-react
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes
    const searchString = [
      r.room_id,
      r.rating,
      r.comment,
      getRoomName(r.room_id, roomList),
      new Date(r.created_at).toLocaleString(),
    ]
      // We combine all the booking fields to be able to search anything that is included in the rows
      .join(" ")
      .toLowerCase();

    // Check if the global search text appears anywhere in the combined search string
    const matchesSearch = searchString.includes(search);

    // Match room ID (exact match)
    const matchesRoomId = filters.room_id
      ? String(r.room_id) === String(filters.room_id)
      : true;

    // Match rating (exact number match)
    const matchesRating = filters.rating
      ? r.rating === Number(filters.rating)
      : true;

    // Match created_at date (compare only the date portion)
    const matchesCreatedAt = filters.created_at
      ? new Date(r.created_at).toDateString() ===
        new Date(filters.created_at).toDateString()
      : true;

    // Room passes only if all filters match
    return matchesSearch && matchesRoomId && matchesRating && matchesCreatedAt;
  });
}

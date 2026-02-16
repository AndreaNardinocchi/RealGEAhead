export function useFilteredUsers(users: any[] | undefined, filters: any) {
  const list = users ?? [];

  return list.filter((u: any) => {
    // Creating search variable
    const search = filters.search.toLowerCase();

    // Filtered data
    // https://www.kindacode.com/article/how-to-create-a-filter-search-list-in-react
    // https://www.cybrosys.com/blog/how-to-build-a-search-bar-to-filter-data-in-react
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes
    const searchString = [
      u.email,
      u.first_name,
      u.last_name,
      u.country,
      u.zip_code,
      u.role,
      new Date(u.created_at).toLocaleString(),
    ]
      // We combine all the booking fields to be able to search anything that is included in the rows
      .join(" ")
      .toLowerCase();

    // Check if the global search text appears anywhere in the combined search string
    const matchesSearch = searchString.includes(search);

    // Match email (case‑insensitive, partial match)
    const matchesEmail = filters.email
      ? String(u.email).toLowerCase().includes(filters.email.toLowerCase())
      : true;

    // Match first name (case‑insensitive, partial match)
    const matchesFirst = filters.first_name
      ? u.first_name?.toLowerCase().includes(filters.first_name.toLowerCase())
      : true;

    // Match last name (case‑insensitive, partial match)
    const matchesLast = filters.last_name
      ? u.last_name?.toLowerCase().includes(filters.last_name.toLowerCase())
      : true;

    // Match country (case‑insensitive, partial match)
    const matchesCountry = filters.country
      ? u.country?.toLowerCase().includes(filters.country.toLowerCase())
      : true;

    // Match role (exact match)
    const matchesRole = filters.role ? u.role === filters.role : true;

    // Match created_at date (compare only the date portion)
    const matchesCreatedAt = filters.created_at
      ? new Date(u.created_at).toDateString() ===
        new Date(filters.created_at).toDateString()
      : true;

    // User passes only if all filters match
    return (
      matchesSearch &&
      matchesEmail &&
      matchesFirst &&
      matchesLast &&
      matchesCountry &&
      matchesRole &&
      matchesCreatedAt
    );
  });
}

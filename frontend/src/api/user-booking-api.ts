/**
 * This is a helper which sends a POST request to the backend to create a new booking.
 */
export const createBookingApi = async (bookingData: {
  room_id: string;
  check_in: string;
  check_out: string;
  guests: number;
  userId: string;
}) => {
  /**
   * Send the booking data to the backend.
   * The backend route is defined in Express as:
   * POST /user/create_booking
   * https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
   */
  const res = await fetch("http://localhost:3000/user/create_booking", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    /**
     * Convert the booking object into JSON before sending.
     * Express.json() on the backend will parse this automatically.
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
     */
    body: JSON.stringify(bookingData),
  });

  /**
   * Parse the JSON response from the backend.
   * If the backend returns an error, it will be included here.
   */
  const data = await res.json();

  /**
   * If the HTTP status is not in the 200–299 range,
   * throw an error so the frontend can handle it.
   * https://developer.mozilla.org/en-US/docs/Web/API/Response/ok
   */
  if (!res.ok) {
    throw new Error(data.error || "Failed to create booking");
  }

  // Return the booking data to the caller.
  return data;
};

/**
 * Update Booking
 * This is a helper which sends a POST request to the backend to update an existing booking.
 */
export const updateBookingApi = async (updateData: {
  bookingId: string;
  userId: string;
  updates: {
    room_id: string;
    check_in: string;
    check_out: string;
    guests: number;
  };
}) => {
  /**
   * Send the updated booking data to the backend.
   * The backend route is defined in Express as:
   * POST /user/update_booking
   */
  const res = await fetch("http://localhost:3000/user/update-booking", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    /**
     * Convert the update object into JSON before sending.
     * Express.json() on the backend will parse this automatically.
     */
    body: JSON.stringify(updateData),
  });

  /**
   * Parse the JSON response from the backend.
   */
  const data = await res.json();

  /**
   * If the HTTP status is not in the 200–299 range,
   * throw an error so the frontend can handle it.
   */
  if (!res.ok) {
    throw new Error(data.error || "Failed to update booking");
  }

  // Return the updated booking data to the caller.
  return data;
};

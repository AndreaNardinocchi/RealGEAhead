/**
 * Create Booking (Admin)
 * Sends a POST request to the admin backend to create a booking.
 */
export const adminCreateBookingApi = async (bookingData: {
  room_id: string;
  user_email: string;
  check_in: string;
  check_out: string;
  guests: number;
}) => {
  const res = await fetch(
    "https://realgeahead-1.onrender.com/admin/create-booking",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingData),
    },
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to create booking");
  }

  return data;
};

/**
 * Update Booking (Admin)
 */
export const adminUpdateBookingApi = async (updateData: {
  booking_id: string;
  room_id: string;
  check_in: string;
  check_out: string;
  guests: number;
  payment_method_id?: string;
}) => {
  const res = await fetch(
    "https://realgeahead-1.onrender.com/admin/update-booking",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData),
    },
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to update booking");
  }

  return data;
};

/**
 * Delete / Cancel Booking (Admin)
 */
export const adminCancelBookingApi = async (booking_id: string) => {
  const res = await fetch(
    "https://realgeahead-1.onrender.com/admin/cancel-booking",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ booking_id }),
    },
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to cancel booking");
  }

  return data;
};

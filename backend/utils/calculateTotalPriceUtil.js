/**
 * This is a helper to calculate the 'total_nights' parameter for the
 * 'booking' object
 */
export function calculateStay(check_in, check_out, roomPrice) {
  /**
   * check_in and check_out are strings and not dates, and this was causing
   * 'check_in.getTime' is not a function' error.
   * Hence, we are trasforming them into proper dates
   */
  const checkInDate = new Date(check_in);
  const checkOutDate = new Date(check_out);

  const nights =
    (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24);

  if (nights < 1) {
    throw new Error("Stay must be at least 1 night");
  }

  const total_price = nights * roomPrice;

  return { nights, total_price };
}

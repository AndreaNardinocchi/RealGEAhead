/**
 * This util will calculate the number of nights of each booking
 */
export function calculateNumberOfNights(checkIn: string, checkOut: string) {
  const start = new Date(checkIn).getTime();
  const end = new Date(checkOut).getTime();

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/max
  // https://stackoverflow.com/questions/51078140/calculation-of-countdown-timer
  // https://stackoverflow.com/questions/3224834/get-difference-between-2-dates-in-javascript
  const nights = Math.max(0, (end - start) / (1000 * 60 * 60 * 24));
  return nights;
}

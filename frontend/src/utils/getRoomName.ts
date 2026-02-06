/**
 * Safely returns the room name for a given roomId.
 * If the room is not found, returns a readable fallback.
 */
export const getRoomName = (
  roomId: string,
  rooms: { id: string; name: string }[] | undefined,
): string => {
  return (
    rooms?.find((r) => r.id === roomId)?.name || `Unknown room (${roomId})`
  );
};

import { supabase } from "../../supabaseClient";

/**
 * Returns a public URL for a file stored in the 'assets/ bucket in supabase.
 * The images used on GuestEase are uploaded to this storage, and are fetched
 * via the below function.
 *
 * https://supabase.com/dashboard/project/xxxxx/storage/files/buckets/assets
 * https://supabase.com/docs/reference/javascript/storage-from-getpublicurl
 */
export function getPublicUrl(path: string) {
  /**
   * supabase.storage.from("assets") selects the bucket named 'assets'
   * getPublicUrl(path) returns an object containing { data: { publicUrl } }
   */
  return supabase.storage.from("assets").getPublicUrl(path).data.publicUrl;
}

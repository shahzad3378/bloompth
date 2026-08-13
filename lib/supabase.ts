import { createClient } from "@supabase/supabase-js";
import { getSupabasePublicConfig } from "@/lib/supabase/config";

const { url, key } = getSupabasePublicConfig();

export const supabase = createClient(
  url,
  key
);

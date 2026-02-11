import { createClient } from "@/lib/supabase/server";
import { SuitcaseSim } from "@/components/simulation/suitcase-sim";
import type { Item } from "@/types";

export default async function SuitcasePage() {
  const supabase = await createClient();

  const { data: items } = await supabase
    .from("items")
    .select("*, category:categories(*)")
    .order("created_at", { ascending: false });

  return <SuitcaseSim items={(items as Item[]) ?? []} />;
}

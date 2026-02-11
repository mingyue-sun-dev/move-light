import { createClient } from "@/lib/supabase/server";
import type { Item, Category } from "@/types";
import { DashboardClient } from "./dashboard-client";

export default async function DashboardPage() {
  const supabase = await createClient();

  const [{ data: items }, { data: categories }] = await Promise.all([
    supabase
      .from("items")
      .select("*, category:categories(*)")
      .order("created_at", { ascending: false }),
    supabase.from("categories").select("*").order("name"),
  ]);

  return (
    <DashboardClient
      items={(items as Item[]) ?? []}
      categories={(categories as Category[]) ?? []}
    />
  );
}

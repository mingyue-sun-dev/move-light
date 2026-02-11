import { createClient } from "@/lib/supabase/server";
import { ItemTable } from "@/components/inventory/item-table";
import type { Item, Category } from "@/types";

export default async function InventoryPage() {
  const supabase = await createClient();

  const [{ data: items }, { data: categories }] = await Promise.all([
    supabase
      .from("items")
      .select("*, category:categories(*)")
      .order("created_at", { ascending: false }),
    supabase.from("categories").select("*").order("name"),
  ]);

  return (
    <ItemTable
      initialItems={(items as Item[]) ?? []}
      categories={(categories as Category[]) ?? []}
    />
  );
}

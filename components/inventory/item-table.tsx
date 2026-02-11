"use client";

import { createClient } from "@/lib/supabase/client";
import type { Item, Category } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CategoryBadge } from "./category-badge";
import { ItemForm } from "./item-form";
import { formatWeight, formatDate } from "@/lib/utils";

interface ItemTableProps {
  initialItems: Item[];
  categories: Category[];
}

type SortKey = "name" | "weight_grams" | "created_at" | "last_used_at";

export function ItemTable({ initialItems, categories }: ItemTableProps) {
  const [editingItem, setEditingItem] = useState<Item | undefined>();
  const [showForm, setShowForm] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortAsc, setSortAsc] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const sorted = [...initialItems].sort((a, b) => {
    let cmp = 0;
    if (sortKey === "name") {
      cmp = a.name.localeCompare(b.name);
    } else if (sortKey === "weight_grams") {
      cmp = a.weight_grams - b.weight_grams;
    } else if (sortKey === "created_at") {
      cmp =
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    } else if (sortKey === "last_used_at") {
      const aTime = a.last_used_at
        ? new Date(a.last_used_at).getTime()
        : 0;
      const bTime = b.last_used_at
        ? new Date(b.last_used_at).getTime()
        : 0;
      cmp = aTime - bTime;
    }
    return sortAsc ? cmp : -cmp;
  });

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  }

  async function handleDelete(id: string) {
    await supabase.from("items").delete().eq("id", id);
    router.refresh();
  }

  function sortIndicator(key: SortKey) {
    if (sortKey !== key) return "";
    return sortAsc ? " \u2191" : " \u2193";
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {initialItems.length} item{initialItems.length !== 1 && "s"}
        </p>
        <button
          onClick={() => {
            setEditingItem(undefined);
            setShowForm(true);
          }}
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
        >
          Add item
        </button>
      </div>

      {initialItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16">
          <p className="text-sm text-muted-foreground">No items yet</p>
          <button
            onClick={() => {
              setEditingItem(undefined);
              setShowForm(true);
            }}
            className="mt-2 text-sm font-medium text-accent hover:underline"
          >
            Add your first item
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th
                  className="cursor-pointer px-4 py-3 text-left font-medium text-muted-foreground hover:text-foreground"
                  onClick={() => handleSort("name")}
                >
                  Name{sortIndicator("name")}
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Category
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Essential
                </th>
                <th
                  className="cursor-pointer px-4 py-3 text-left font-medium text-muted-foreground hover:text-foreground"
                  onClick={() => handleSort("weight_grams")}
                >
                  Weight{sortIndicator("weight_grams")}
                </th>
                <th
                  className="cursor-pointer px-4 py-3 text-left font-medium text-muted-foreground hover:text-foreground"
                  onClick={() => handleSort("last_used_at")}
                >
                  Last used{sortIndicator("last_used_at")}
                </th>
                <th
                  className="cursor-pointer px-4 py-3 text-left font-medium text-muted-foreground hover:text-foreground"
                  onClick={() => handleSort("created_at")}
                >
                  Added{sortIndicator("created_at")}
                </th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-border last:border-0 hover:bg-muted/30"
                >
                  <td className="px-4 py-3 font-medium">{item.name}</td>
                  <td className="px-4 py-3">
                    {item.category ? (
                      <CategoryBadge
                        name={item.category.name}
                        color={item.category.color}
                      />
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {item.is_essential ? (
                      <span className="text-xs font-medium text-accent">
                        Yes
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">No</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatWeight(item.weight_grams)}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {item.last_used_at
                      ? formatDate(item.last_used_at)
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDate(item.created_at)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => {
                        setEditingItem(item);
                        setShowForm(true);
                      }}
                      className="mr-2 text-xs text-muted-foreground hover:text-foreground"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-xs text-destructive hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <ItemForm
          categories={categories}
          item={editingItem}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}

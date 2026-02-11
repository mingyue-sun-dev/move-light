"use client";

import { createClient } from "@/lib/supabase/client";
import type { Item, Category } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ItemFormProps {
  categories: Category[];
  item?: Item;
  onClose: () => void;
}

export function ItemForm({ categories, item, onClose }: ItemFormProps) {
  const isEdit = !!item;
  const router = useRouter();
  const supabase = createClient();

  const [name, setName] = useState(item?.name ?? "");
  const [categoryId, setCategoryId] = useState(item?.category_id ?? "");
  const [isEssential, setIsEssential] = useState(item?.is_essential ?? false);
  const [weightGrams, setWeightGrams] = useState(item?.weight_grams ?? 0);
  const [tags, setTags] = useState(item?.tags?.join(", ") ?? "");
  const [lastUsedAt, setLastUsedAt] = useState(item?.last_used_at ?? "");
  const [notes, setNotes] = useState(item?.notes ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Category creation
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#6b7280");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    let finalCategoryId = categoryId || null;

    // Create new category if needed
    if (showNewCategory && newCategoryName.trim()) {
      const { data: newCat, error: catError } = await supabase
        .from("categories")
        .insert({ name: newCategoryName.trim(), color: newCategoryColor })
        .select()
        .single();

      if (catError) {
        setError(catError.message);
        setLoading(false);
        return;
      }
      finalCategoryId = newCat.id;
    }

    const payload = {
      name: name.trim(),
      category_id: finalCategoryId,
      is_essential: isEssential,
      weight_grams: weightGrams,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      last_used_at: lastUsedAt || null,
      notes: notes.trim() || null,
    };

    if (isEdit) {
      const { error } = await supabase
        .from("items")
        .update(payload)
        .eq("id", item.id);
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
    } else {
      const { error } = await supabase.from("items").insert(payload);
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
    }

    router.refresh();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-lg border border-border bg-background p-6 shadow-lg">
        <h2 className="mb-4 text-lg font-semibold">
          {isEdit ? "Edit Item" : "Add Item"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Name</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Category</label>
            {!showNewCategory ? (
              <div className="flex gap-2">
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/50"
                >
                  <option value="">None</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowNewCategory(true)}
                  className="rounded-md border border-border px-3 py-2 text-sm hover:bg-muted"
                >
                  New
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Category name"
                    className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/50"
                  />
                  <input
                    type="color"
                    value={newCategoryColor}
                    onChange={(e) => setNewCategoryColor(e.target.value)}
                    className="h-9 w-9 cursor-pointer rounded-md border border-border"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowNewCategory(false)}
                  className="text-xs text-muted-foreground hover:underline"
                >
                  Use existing category
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Weight (grams)</label>
              <input
                type="number"
                min={0}
                value={weightGrams}
                onChange={(e) => setWeightGrams(Number(e.target.value))}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/50"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Last used</label>
              <input
                type="date"
                value={lastUsedAt}
                onChange={(e) => setLastUsedAt(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/50"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="essential"
              checked={isEssential}
              onChange={(e) => setIsEssential(e.target.checked)}
              className="rounded border-border"
            />
            <label htmlFor="essential" className="text-sm font-medium">
              Essential item
            </label>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Tags (comma-separated)</label>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="travel, daily, tech"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/50"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md px-4 py-2 text-sm text-muted-foreground hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Saving..." : isEdit ? "Save" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

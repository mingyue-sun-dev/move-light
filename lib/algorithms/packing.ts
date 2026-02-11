import type { Item, PackingResult } from "@/types";

export function packSuitcase(
  items: Item[],
  capacityGrams: number
): PackingResult {
  const essentials = items.filter((i) => i.is_essential);
  const nonEssentials = items.filter((i) => !i.is_essential);

  // Sort essentials by last-used recency (most recent first)
  essentials.sort((a, b) => {
    const aDate = a.last_used_at ? new Date(a.last_used_at).getTime() : 0;
    const bDate = b.last_used_at ? new Date(b.last_used_at).getTime() : 0;
    return bDate - aDate;
  });

  // Sort non-essentials by last-used recency
  nonEssentials.sort((a, b) => {
    const aDate = a.last_used_at ? new Date(a.last_used_at).getTime() : 0;
    const bDate = b.last_used_at ? new Date(b.last_used_at).getTime() : 0;
    return bDate - aDate;
  });

  const packed: Item[] = [];
  const overflow: Item[] = [];
  let remaining = capacityGrams;
  let essentialsPacked = 0;

  // Pack essentials first
  for (const item of essentials) {
    if (item.weight_grams <= remaining) {
      packed.push(item);
      remaining -= item.weight_grams;
      essentialsPacked++;
    } else {
      overflow.push(item);
    }
  }

  // Then non-essentials
  for (const item of nonEssentials) {
    if (item.weight_grams <= remaining) {
      packed.push(item);
      remaining -= item.weight_grams;
    } else {
      overflow.push(item);
    }
  }

  const essentialCoverage =
    essentials.length > 0 ? (essentialsPacked / essentials.length) * 100 : 100;

  return { packed, overflow, essentialCoverage };
}

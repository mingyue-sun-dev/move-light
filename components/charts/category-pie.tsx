"use client";

import type { Item, Category } from "@/types";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface CategoryPieProps {
  items: Item[];
  categories: Category[];
}

export function CategoryPie({ items, categories }: CategoryPieProps) {
  const categoryMap = new Map(categories.map((c) => [c.id, c]));

  const countByCategory = new Map<string, number>();
  for (const item of items) {
    const key = item.category_id ?? "uncategorized";
    countByCategory.set(key, (countByCategory.get(key) ?? 0) + 1);
  }

  const data = Array.from(countByCategory.entries()).map(([id, count]) => {
    const cat = categoryMap.get(id);
    return {
      name: cat?.name ?? "Uncategorized",
      value: count,
      color: cat?.color ?? "#a3a3a3",
    };
  });

  if (data.length === 0) return null;

  return (
    <div className="rounded-lg border border-border p-5">
      <h3 className="mb-4 text-sm font-semibold">Items by Category</h3>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={90}
            paddingAngle={2}
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              fontSize: 12,
              borderRadius: 8,
              border: "1px solid var(--border)",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-3 flex flex-wrap gap-3">
        {data.map((d) => (
          <div key={d.name} className="flex items-center gap-1.5 text-xs">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: d.color }}
            />
            {d.name} ({d.value})
          </div>
        ))}
      </div>
    </div>
  );
}

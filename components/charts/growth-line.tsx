"use client";

import type { Item } from "@/types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface GrowthLineProps {
  items: Item[];
}

export function GrowthLine({ items }: GrowthLineProps) {
  if (items.length === 0) return null;

  // Group by month and compute cumulative count
  const sorted = [...items].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  const monthMap = new Map<string, number>();
  let cumulative = 0;

  for (const item of sorted) {
    const d = new Date(item.created_at);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    cumulative++;
    monthMap.set(key, cumulative);
  }

  const data = Array.from(monthMap.entries()).map(([month, total]) => ({
    month,
    total,
  }));

  return (
    <div className="rounded-lg border border-border p-5">
      <h3 className="mb-4 text-sm font-semibold">Inventory Growth</h3>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data}>
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              fontSize: 12,
              borderRadius: 8,
              border: "1px solid var(--border)",
            }}
          />
          <Line
            type="monotone"
            dataKey="total"
            stroke="#2563eb"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

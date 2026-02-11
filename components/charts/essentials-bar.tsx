"use client";

import type { Item } from "@/types";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface EssentialsBarProps {
  items: Item[];
}

export function EssentialsBar({ items }: EssentialsBarProps) {
  const essential = items.filter((i) => i.is_essential).length;
  const nonEssential = items.length - essential;

  const data = [
    { name: "Essential", count: essential, fill: "#2563eb" },
    { name: "Non-essential", count: nonEssential, fill: "#a3a3a3" },
  ];

  if (items.length === 0) return null;

  return (
    <div className="rounded-lg border border-border p-5">
      <h3 className="mb-4 text-sm font-semibold">Essential vs Non-essential</h3>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} barSize={40}>
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              fontSize: 12,
              borderRadius: 8,
              border: "1px solid var(--border)",
            }}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

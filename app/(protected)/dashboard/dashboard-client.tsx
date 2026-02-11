"use client";

import type { Item, Category } from "@/types";
import { CategoryPie } from "@/components/charts/category-pie";
import { EssentialsBar } from "@/components/charts/essentials-bar";
import { GrowthLine } from "@/components/charts/growth-line";

interface DashboardClientProps {
  items: Item[];
  categories: Category[];
}

export function DashboardClient({ items, categories }: DashboardClientProps) {
  const essentialCount = items.filter((i) => i.is_essential).length;
  const essentialRatio =
    items.length > 0 ? Math.round((essentialCount / items.length) * 100) : 0;

  const now = new Date();
  const thisMonth = items.filter((i) => {
    const d = new Date(i.created_at);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  return (
    <div className="space-y-6">
      {/* Metric cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <MetricCard label="Total items" value={String(items.length)} />
        <MetricCard label="Essential ratio" value={`${essentialRatio}%`} />
        <MetricCard label="Categories" value={String(categories.length)} />
        <MetricCard label="Added this month" value={String(thisMonth)} />
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16">
          <p className="text-sm text-muted-foreground">
            No data yet — add items in Inventory to see charts
          </p>
          <a
            href="/inventory"
            className="mt-2 text-sm font-medium text-accent hover:underline"
          >
            Go to Inventory
          </a>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <CategoryPie items={items} categories={categories} />
          <EssentialsBar items={items} />
          <div className="lg:col-span-2">
            <GrowthLine items={items} />
          </div>
        </div>
      )}
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  );
}

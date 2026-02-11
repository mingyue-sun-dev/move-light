"use client";

import type { Item } from "@/types";
import { packSuitcase } from "@/lib/algorithms/packing";
import { formatWeight } from "@/lib/utils";
import { useState } from "react";
import { PackingList } from "./packing-list";

interface SuitcaseSimProps {
  items: Item[];
}

export function SuitcaseSim({ items }: SuitcaseSimProps) {
  const [capacityKg, setCapacityKg] = useState(10);
  const capacityGrams = capacityKg * 1000;

  const result = packSuitcase(items, capacityGrams);
  const packedWeight = result.packed.reduce((s, i) => s + i.weight_grams, 0);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16">
        <p className="text-sm text-muted-foreground">
          No items in your inventory yet
        </p>
        <a
          href="/inventory"
          className="mt-2 text-sm font-medium text-accent hover:underline"
        >
          Add items first
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="rounded-lg border border-border p-5">
        <label className="mb-3 block text-sm font-medium">
          Suitcase capacity: {capacityKg} kg
        </label>
        <input
          type="range"
          min={1}
          max={30}
          step={0.5}
          value={capacityKg}
          onChange={(e) => setCapacityKg(Number(e.target.value))}
          className="w-full accent-accent"
        />
        <div className="mt-1 flex justify-between text-xs text-muted-foreground">
          <span>1 kg</span>
          <span>30 kg</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          label="Packed"
          value={`${result.packed.length} / ${items.length}`}
        />
        <StatCard label="Weight" value={formatWeight(packedWeight)} />
        <StatCard
          label="Remaining"
          value={formatWeight(capacityGrams - packedWeight)}
        />
        <StatCard
          label="Essential coverage"
          value={`${Math.round(result.essentialCoverage)}%`}
          highlight={result.essentialCoverage < 100}
        />
      </div>

      {/* Packing lists */}
      <div className="grid gap-6 lg:grid-cols-2">
        <PackingList
          title="Packed"
          items={result.packed}
          variant="packed"
        />
        <PackingList
          title="Overflow"
          items={result.overflow}
          variant="overflow"
        />
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-lg border border-border p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p
        className={`mt-1 text-xl font-semibold ${
          highlight ? "text-destructive" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}

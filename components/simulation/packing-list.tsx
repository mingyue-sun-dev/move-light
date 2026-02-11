"use client";

import type { Item } from "@/types";
import { formatWeight } from "@/lib/utils";
import { CategoryBadge } from "@/components/inventory/category-badge";
import { useState } from "react";

interface PackingListProps {
  title: string;
  items: Item[];
  variant: "packed" | "overflow";
}

export function PackingList({ title, items, variant }: PackingListProps) {
  const [copied, setCopied] = useState(false);

  function exportMarkdown() {
    const lines = items.map(
      (item) =>
        `- [${variant === "packed" ? "x" : " "}] ${item.name} (${formatWeight(item.weight_grams)})${item.is_essential ? " *essential*" : ""}`
    );
    const md = `## ${title}\n${lines.join("\n")}`;
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-lg border border-border">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h3 className="text-sm font-semibold">
          {title}{" "}
          <span className="font-normal text-muted-foreground">
            ({items.length})
          </span>
        </h3>
        {items.length > 0 && (
          <button
            onClick={exportMarkdown}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            {copied ? "Copied!" : "Copy checklist"}
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <p className="px-4 py-6 text-center text-sm text-muted-foreground">
          {variant === "packed" ? "Nothing packed yet" : "No overflow items"}
        </p>
      ) : (
        <ul className="divide-y divide-border">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between px-4 py-2.5"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm ${
                    variant === "overflow" ? "text-muted-foreground" : ""
                  }`}
                >
                  {item.name}
                </span>
                {item.is_essential && (
                  <span className="rounded bg-accent/10 px-1.5 py-0.5 text-[10px] font-medium text-accent">
                    Essential
                  </span>
                )}
                {item.category && (
                  <CategoryBadge
                    name={item.category.name}
                    color={item.category.color}
                  />
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                {formatWeight(item.weight_grams)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

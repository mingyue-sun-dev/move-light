export default function InventoryLoading() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-5 w-20 rounded bg-muted" />
        <div className="h-9 w-24 rounded-md bg-muted" />
      </div>
      <div className="rounded-lg border border-border">
        <div className="border-b border-border bg-muted/50 px-4 py-3">
          <div className="h-4 w-full rounded bg-muted" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="border-b border-border px-4 py-3 last:border-0">
            <div className="h-4 w-full rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}

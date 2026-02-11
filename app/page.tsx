import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Nav */}
      <header className="flex items-center justify-between px-6 py-4">
        <span className="text-lg font-semibold tracking-tight">MoveLight</span>
        <div className="flex gap-3">
          <Link
            href="/login"
            className="rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
          >
            Get started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <h1 className="max-w-xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          Own less, live more.
        </h1>
        <p className="mt-4 max-w-md text-lg text-muted-foreground">
          MoveLight is a Life OS for minimalists. Track your inventory, simulate
          what fits in one suitcase, and see your progress over time.
        </p>
        <div className="mt-8 flex gap-3">
          <Link
            href="/signup"
            className="rounded-md bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
          >
            Start for free
          </Link>
          <Link
            href="/login"
            className="rounded-md border border-border px-6 py-3 text-sm font-medium transition-colors hover:bg-muted"
          >
            Sign in
          </Link>
        </div>

        {/* Features */}
        <div className="mt-20 grid max-w-3xl gap-8 sm:grid-cols-3">
          <Feature
            title="Inventory"
            description="Catalog everything you own with categories, weights, and tags."
          />
          <Feature
            title="Suitcase Sim"
            description="See what fits in one bag. Essentials packed first, by recency."
          />
          <Feature
            title="Dashboard"
            description="Charts and metrics to track your minimalism journey over time."
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-muted-foreground">
        MoveLight
      </footer>
    </div>
  );
}

function Feature({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="text-left">
      <h3 className="text-sm font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

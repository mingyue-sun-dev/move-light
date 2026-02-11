"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Inventory", href: "/inventory" },
  { label: "Suitcase", href: "/suitcase" },
];

export function Sidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <aside className="flex w-[var(--sidebar-width)] flex-col border-r border-border bg-muted/50">
      <div className="flex h-14 items-center px-5">
        <Link href="/dashboard" className="text-lg font-semibold tracking-tight">
          MoveLight
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "block rounded-md px-3 py-2 text-sm font-medium transition-colors",
              pathname === item.href
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-border p-4">
        <p className="mb-2 truncate text-xs text-muted-foreground">
          {userEmail}
        </p>
        <button
          onClick={handleLogout}
          className="w-full rounded-md px-3 py-1.5 text-left text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}

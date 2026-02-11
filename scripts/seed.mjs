import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const email = process.argv[2] || "test@test.com";
const password = process.argv[3] || "password";

async function seed() {
  // Sign in as the user
  const { error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (authError) {
    console.error("Auth failed:", authError.message);
    console.log("Usage: node scripts/seed.mjs <email> <password>");
    process.exit(1);
  }
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user.id;
  console.log(`Signed in as ${email} (${userId})`);

  // Insert categories
  const categories = [
    { name: "Clothing", color: "#3b82f6" },
    { name: "Tech", color: "#8b5cf6" },
    { name: "Toiletries", color: "#10b981" },
    { name: "Documents", color: "#f59e0b" },
    { name: "Accessories", color: "#ec4899" },
  ];

  const { data: cats, error: catError } = await supabase
    .from("categories")
    .insert(categories.map((c) => ({ ...c, user_id: userId })))
    .select();

  if (catError) {
    console.error("Category insert failed:", catError.message);
    process.exit(1);
  }
  console.log(`Inserted ${cats.length} categories`);

  const catMap = Object.fromEntries(cats.map((c) => [c.name, c.id]));

  // Insert items
  const items = [
    { name: "Laptop", category: "Tech", weight: 1400, essential: true, tags: ["work", "daily"], lastUsed: "2026-02-10", notes: "MacBook Air M3" },
    { name: "Phone charger", category: "Tech", weight: 80, essential: true, tags: ["daily"], lastUsed: "2026-02-11", notes: null },
    { name: "Kindle", category: "Tech", weight: 160, essential: false, tags: ["leisure"], lastUsed: "2026-02-08", notes: "Paperwhite" },
    { name: "USB-C hub", category: "Tech", weight: 120, essential: false, tags: ["work"], lastUsed: "2026-01-28", notes: null },
    { name: "Wireless earbuds", category: "Tech", weight: 55, essential: true, tags: ["daily", "travel"], lastUsed: "2026-02-11", notes: "AirPods Pro" },
    { name: "T-shirts (x4)", category: "Clothing", weight: 600, essential: true, tags: ["daily"], lastUsed: "2026-02-11", notes: "Black, white, grey, navy" },
    { name: "Jeans (x2)", category: "Clothing", weight: 900, essential: true, tags: ["daily"], lastUsed: "2026-02-11", notes: null },
    { name: "Hoodie", category: "Clothing", weight: 450, essential: false, tags: ["casual"], lastUsed: "2026-02-09", notes: null },
    { name: "Rain jacket", category: "Clothing", weight: 300, essential: true, tags: ["travel", "outdoor"], lastUsed: "2026-01-20", notes: "Packable" },
    { name: "Sneakers", category: "Clothing", weight: 700, essential: true, tags: ["daily"], lastUsed: "2026-02-11", notes: null },
    { name: "Sandals", category: "Clothing", weight: 350, essential: false, tags: ["summer"], lastUsed: "2025-12-15", notes: null },
    { name: "Underwear (x5)", category: "Clothing", weight: 200, essential: true, tags: ["daily"], lastUsed: "2026-02-11", notes: null },
    { name: "Socks (x5 pairs)", category: "Clothing", weight: 150, essential: true, tags: ["daily"], lastUsed: "2026-02-11", notes: null },
    { name: "Toothbrush", category: "Toiletries", weight: 20, essential: true, tags: ["daily"], lastUsed: "2026-02-11", notes: "Electric" },
    { name: "Toothpaste", category: "Toiletries", weight: 80, essential: true, tags: ["daily"], lastUsed: "2026-02-11", notes: null },
    { name: "Deodorant", category: "Toiletries", weight: 75, essential: true, tags: ["daily"], lastUsed: "2026-02-11", notes: null },
    { name: "Sunscreen", category: "Toiletries", weight: 100, essential: false, tags: ["travel", "summer"], lastUsed: "2026-01-05", notes: "SPF 50" },
    { name: "Shampoo bar", category: "Toiletries", weight: 60, essential: true, tags: ["daily", "travel"], lastUsed: "2026-02-11", notes: "Solid, no liquid" },
    { name: "Passport", category: "Documents", weight: 40, essential: true, tags: ["travel"], lastUsed: "2026-01-15", notes: "Expires 2029" },
    { name: "Wallet", category: "Accessories", weight: 80, essential: true, tags: ["daily"], lastUsed: "2026-02-11", notes: null },
    { name: "Watch", category: "Accessories", weight: 65, essential: false, tags: ["daily"], lastUsed: "2026-02-10", notes: "Casio" },
    { name: "Backpack", category: "Accessories", weight: 800, essential: true, tags: ["travel", "daily"], lastUsed: "2026-02-11", notes: "40L, carry-on size" },
    { name: "Packing cubes", category: "Accessories", weight: 150, essential: false, tags: ["travel"], lastUsed: "2026-01-15", notes: "Set of 3" },
    { name: "Sleep mask", category: "Accessories", weight: 25, essential: false, tags: ["travel"], lastUsed: "2026-01-15", notes: null },
    { name: "Notebook", category: "Documents", weight: 180, essential: false, tags: ["work"], lastUsed: "2026-02-06", notes: "Moleskine" },
  ];

  // Spread created_at dates over the past 3 months for the growth chart
  const now = Date.now();
  const threeMonthsMs = 90 * 24 * 60 * 60 * 1000;

  const rows = items.map((item, i) => ({
    user_id: userId,
    name: item.name,
    category_id: catMap[item.category],
    is_essential: item.essential,
    weight_grams: item.weight,
    tags: item.tags,
    last_used_at: item.lastUsed,
    notes: item.notes,
    created_at: new Date(now - threeMonthsMs + (threeMonthsMs / items.length) * i).toISOString(),
  }));

  const { data: inserted, error: itemError } = await supabase
    .from("items")
    .insert(rows)
    .select();

  if (itemError) {
    console.error("Item insert failed:", itemError.message);
    process.exit(1);
  }
  console.log(`Inserted ${inserted.length} items`);
  console.log("Done! Refresh your browser to see the data.");
}

seed();

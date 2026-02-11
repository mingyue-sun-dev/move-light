-- MoveLight: Run this in Supabase SQL Editor

-- Categories table
create table categories (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  color text not null default '#6b7280',
  created_at timestamptz default now() not null
);

alter table categories enable row level security;

create policy "Users can view own categories"
  on categories for select using (auth.uid() = user_id);
create policy "Users can insert own categories"
  on categories for insert with check (auth.uid() = user_id);
create policy "Users can update own categories"
  on categories for update using (auth.uid() = user_id);
create policy "Users can delete own categories"
  on categories for delete using (auth.uid() = user_id);

-- Items table
create table items (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  category_id uuid references categories(id) on delete set null,
  is_essential boolean default false not null,
  weight_grams integer default 0 not null,
  tags text[] default '{}' not null,
  last_used_at date,
  notes text,
  created_at timestamptz default now() not null
);

alter table items enable row level security;

create policy "Users can view own items"
  on items for select using (auth.uid() = user_id);
create policy "Users can insert own items"
  on items for insert with check (auth.uid() = user_id);
create policy "Users can update own items"
  on items for update using (auth.uid() = user_id);
create policy "Users can delete own items"
  on items for delete using (auth.uid() = user_id);

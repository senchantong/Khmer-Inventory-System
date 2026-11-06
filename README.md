# Khmer Inventory System

A starter inventory website using HTML, CSS, JavaScript and Supabase Auth/Database.

## Files
- `index.html` — website structure
- `style.css` — responsive design
- `app.js` — Supabase connection, login and product CRUD

## Important Supabase setup
This frontend expects a table named `products` with these columns:
- `id` — uuid primary key, default `gen_random_uuid()`
- `name` — text, required
- `sku` — text, optional
- `quantity` — integer, default 0
- `price` — numeric, default 0
- `created_at` — timestamptz, default `now()`

Example SQL (run in Supabase SQL Editor):

```sql
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sku text,
  quantity integer not null default 0,
  price numeric(12,2) not null default 0,
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;

create policy "Authenticated users can read products"
on public.products for select to authenticated using (true);

create policy "Authenticated users can add products"
on public.products for insert to authenticated with check (true);

create policy "Authenticated users can update products"
on public.products for update to authenticated using (true) with check (true);

create policy "Authenticated users can delete products"
on public.products for delete to authenticated using (true);
```

## Run the website
For a quick local test, open `index.html` in a browser. For deployment, upload all files to your GitHub repository and connect the repository to a static hosting service such as Vercel or Netlify.

## Security
The publishable key in `app.js` is designed to be public in a browser. Never use a Supabase `service_role` or secret key in frontend code. Keep Row Level Security enabled. The example policies allow any authenticated user to manage products; adjust them before using this for a real business.

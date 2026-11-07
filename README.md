# Khmer Inventory System PRO

## Installation
1. Back up your GitHub repository and Supabase database.
2. Extract this ZIP and replace root `index.html`, `style.css`, `app.js` in your existing GitHub repo.
3. Upload `supabase/migration_v2.sql` into the repo as well (for version history).
4. In Supabase Dashboard → SQL Editor → New query, paste the migration and run it once.
5. Wait for GitHub Pages to publish, then sign in.

## Included
- All 16 requested navigation menus and responsive mobile layout.
- Supabase email/password login and session persistence.
- Basic CRUD forms for products, categories, brands, customers, suppliers and expenses.
- POS cart preview.
- Additive migration for supporting tables.

## Important: this is a first PRO foundation, not yet a completed accounting release
Invoices, completed POS checkout, stock deduction/workflows, reports, persistent currency/settings and staff role management are placeholders pending confirmation of your existing sales schema and permissions. POS cart does not yet save sales or reduce stock. Do not rely on dashboard numbers for accounting yet.

Migration preserves existing `products.price` values without conversion. It assumes `products.id` is BIGINT. If it is not, do not run the migration until the foreign key is adjusted. The starter RLS policy grants all authenticated users access to the new support tables; tighten this before creating staff accounts.

Only use a Supabase publishable key in browser code. Never expose service_role/secret keys.

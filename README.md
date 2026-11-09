# Khmer Inventory Pro — Modern Khmer Edition

កំណែរចនាថ្មី៖ UI ទំនើប ពណ៌ Navy/Purple, responsive សម្រាប់ទូរស័ព្ទ និងម៉ឺនុយជាភាសាខ្មែរ។

# Khmer Inventory System — Full POS package

This is a mobile-friendly, Supabase-backed starter release with the requested core modules:
Dashboard, POS checkout, products, categories, brands, invoices/print, sales history, customers, suppliers, stock in/out, expenses, reports/export, USD/KHR, owner/staff roles and shop settings.

## Important compatibility notes
- This package expects the existing `public.products` table to have: `id BIGINT`, `name`, `sku`, `quantity`, `price`.
- It expects `public.profiles` to have `id UUID` referencing `auth.users(id)` and `display_name`, `role`. The SQL adds missing display_name/role columns but cannot safely guess a different existing primary-key structure.
- Existing products and profiles are preserved. Do not drop existing tables.
- Back up your Supabase project before running any SQL.
- The app uses the publishable key in the browser. Never put a Supabase service_role/secret key in `app.js`.

## Setup
1. In Supabase, open SQL Editor. Back up your project first.
2. Verify `products.id` is BIGINT and that `name`, `sku`, `quantity`, `price` exist. If not, stop and ask for a schema-specific migration.
3. Run `supabase/full_setup.sql` once.
4. Ensure the owner already has a row in `profiles` with `role='owner'` and `id` equal to the Auth user's UUID.
5. Keep Supabase Auth email sign-in enabled. Sign in with the existing owner account.
6. Upload the CONTENTS of this folder to the ROOT of the existing GitHub repository (index.html, app.js, style.css, supabase folder, README.md), replacing files at the same paths. Do not upload this whole folder as a nested folder.
7. Open GitHub Pages and sign in.

## Staff accounts
Create each staff account in Supabase Authentication first. Then add a matching `profiles` row with the exact Auth UUID, display name and role `staff`. Do not allow public sign-up for a private shop. Only the owner should be able to change roles.

## Included transactional behavior
- POS checkout calls `create_sale`, which validates payment, locks product rows, inserts invoice/items, reduces stock and records stock movement atomically.
- Stock In/Out calls `record_stock_movement`, which validates stock and updates quantity atomically.
- Sales reports and CSV export are included.

## Current release limitations to verify before live business use
- Product images are stored as image URLs; a Supabase Storage bucket and upload UI are not provisioned.
- No barcode scanner workflow, refunds/voids, purchase-order receiving, tax/VAT rules, cash drawer, offline mode, or multi-branch support.
- Staff permissions are role-level (owner/staff), not per-action configurable.
- Test checkout, stock movements, role restrictions, invoice print, currency conversion, and backups with sample records before using real sales.
- The app is not a certified accounting/tax system. Verify financial calculations and local compliance independently.

## Troubleshooting
- "Could not find table in schema cache": verify the SQL ran successfully in the correct Supabase project; then wait briefly and refresh. Check Table Editor for the table.
- Login failure: verify Auth user exists, email/password are correct, and the matching profile row exists.
- Permission denied: verify migration ran, `profiles.role` is owner/staff, and the logged-in user's profile UUID matches Auth UUID.
- Never share a service_role key or database password.


## ចំណាំអំពីកំណែ UI ថ្មី
- កំណែនេះធ្វើបច្ចុប្បន្នភាពរូបរាង និងឈ្មោះផលិតផលជា Khmer Inventory Pro ព្រមទាំងបកប្រែម៉ឺនុយសំខាន់ៗជាភាសាខ្មែរ។
- មុខងារទិន្នន័យនៅតែអាស្រ័យលើ Supabase schema និង SQL setup ដែលមានក្នុងថត `supabase/`។
- មុខងារបង្ហោះរូបភាពទំនិញ, បំណុលពេញលេញ, ការទិញចូលពេញលេញ, ការបង្វិលទំនិញ និងការគ្រប់គ្រងសិទ្ធិលម្អិត ត្រូវការការអភិវឌ្ឍបន្ថែម មិនត្រូវសន្មតថាមានរួចទេ។
- សូមសាកល្បងលើ Supabase project សាកល្បង និង Backup ទិន្នន័យមុន deploy ទៅ production។

# Khmer Inventory System — Login Fix v2

1. Back up the current GitHub files.
2. Replace root `index.html`, `style.css`, and `app.js` with these files.
3. Commit to the `main` branch and wait for GitHub Pages to publish.
4. Open the site, refresh it, and try logging in again.

The app now restores an existing Supabase session, listens for login/logout events, and displays the actual Supabase error instead of silently staying on the login page.

This frontend expects the existing Supabase project and these database objects:
- `products` with `id` BIGINT, `name`, `sku`, `quantity`, `price`, `cost_price`
- `sales` table
- RPC `public.create_sale(...)`

**Do not run the migration again if it already completed successfully.** This package does not replace your database migration.

Product prices and cost prices are treated as USD. KHR payment uses the exchange rate entered on the POS screen.

Never put a Supabase `service_role` or secret key in browser code. The publishable key in `app.js` is intended for public browser use. Review and tighten RLS policies before giving staff access.

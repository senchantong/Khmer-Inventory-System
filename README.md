# Khmer Inventory System POS v2

1. Backup GitHub repository ដើម (Download ZIP) ជាមុន។ កុំលុប repository ឬ Supabase table `products` ចាស់។
2. ពិនិត្យតម្លៃ `products.price`៖ កំណែនេះសន្មត់ថាតម្លៃគឺ USD។ បើតម្លៃចាស់ជារៀល សូមកុំប្រើ POS រហូតដល់បម្លែងតម្លៃឱ្យត្រឹមត្រូវ។
3. Supabase project ដដែល → SQL Editor → New query → copy `supabase/migration_v2.sql` ទាំងអស់ → Run។ SQL រំពឹងថា `products.id` ជា BIGINT និងមាន columns `name`, `sku`, `quantity`, `price`។ បើមាន error សូមឈប់ និងផ្ញើ screenshot មក។
4. GitHub repository `senchantong/Khmer-Inventory-System` ដដែល៖ replace `index.html`, `style.css`, `app.js`; upload folder `supabase` និង `README.md`; commit ទៅ `main`។ Refresh GitHub Pages ក្រោយ 1–3 នាទី។

រួមមាន login, product tiles/search, cart, customer info, discount, USD/KHR payment, exchange rate, printable invoice (Print → Save as PDF), sales history, daily sales/cost/profit estimate, និង stock deduction តាម database RPC។

សំខាន់៖ `cost_price` ត្រូវបញ្ចូលសម្រាប់គណនាចំណេញ។ Policy ផលិតផលក្នុង migration នេះអនុញ្ញាត CRUD ដល់អ្នក login ទាំងអស់ ដូច្នេះប្រើតែអ្នកដែលទុកចិត្តបាន; មុនបើកឱ្យបុគ្គលិកច្រើន គួររឹតបន្តឹង policy តាម role។ កំណែនេះមិនទាន់មានការទូទាត់បំបែក USD និង KHR ក្នុងប្រតិបត្តិការតែមួយទេ។ ប្រើតែ publishable/anon key ក្នុង browser; កុំដាក់ service_role key។

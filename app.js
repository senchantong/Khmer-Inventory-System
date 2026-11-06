// Supabase project configuration
// The publishable key is intended for browser use. Never put a service_role/secret key here.
const SUPABASE_URL = "https://zkjvcnhweldqqyvvgcqo.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_XcYuP69wWGnQ2XJ-z_YFHA_DPshuI6D";
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

const $ = (id) => document.getElementById(id);
let products = [];

function showMessage(id, message, success=false) {
  const el = $(id); el.textContent = message; el.style.color = success ? "#72d6a1" : "#f6b9a9";
}
function setLoggedIn(user) {
  $("login-panel").classList.toggle("hidden", !!user);
  $("app-panel").classList.toggle("hidden", !user);
  $("logout-btn").classList.toggle("hidden", !user);
  $("user-label").textContent = user ? user.email : "មិនទាន់ចូលគណនី";
}
async function loadSession() {
  const {data:{session}} = await supabaseClient.auth.getSession();
  setLoggedIn(session?.user || null);
  if (session?.user) await loadProducts();
}
$("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  showMessage("login-message", "កំពុងចូល...");
  const {error} = await supabaseClient.auth.signInWithPassword({
    email: $("email").value.trim(), password: $("password").value
  });
  if (error) return showMessage("login-message", error.message);
  showMessage("login-message", "ចូលគណនីបានជោគជ័យ", true);
  await loadSession();
});
$("logout-btn").addEventListener("click", async () => {
  await supabaseClient.auth.signOut(); products=[]; setLoggedIn(null);
});
supabaseClient.auth.onAuthStateChange((_event, session) => {
  setLoggedIn(session?.user || null);
});

async function loadProducts() {
  $("product-list").innerHTML = '<tr><td colspan="5" class="empty">កំពុងផ្ទុក...</td></tr>';
  // Expected table: products(id, name, sku, quantity, price)
  const {data, error} = await supabaseClient.from("products")
    .select("id,name,sku,quantity,price").order("created_at", {ascending:false});
  if (error) {
    $("product-list").innerHTML = `<tr><td colspan="5" class="empty">មិនអាចទាញទិន្នន័យបាន៖ ${escapeHtml(error.message)}</td></tr>`;
    showMessage("global-message", "សូមបង្កើតតារាង products និងកំណត់ RLS policy ជាមុន។ មើល README.md");
    return;
  }
  products = data || []; renderProducts();
}
function renderProducts() {
  const q = $("search").value.trim().toLowerCase();
  const filtered = products.filter(p => `${p.name||""} ${p.sku||""}`.toLowerCase().includes(q));
  $("total-items").textContent = products.length;
  $("total-stock").textContent = products.reduce((s,p)=>s+Number(p.quantity||0),0);
  $("low-stock").textContent = products.filter(p=>Number(p.quantity||0)<=5).length;
  $("product-list").innerHTML = filtered.length ? filtered.map(p => `
    <tr><td>${escapeHtml(p.name)}</td><td>${escapeHtml(p.sku||"-")}</td>
    <td>${Number(p.quantity||0)}</td><td>${Number(p.price||0).toLocaleString()} ៛</td>
    <td><div class="actions"><button onclick="editProduct('${p.id}')">កែ</button><button class="delete" onclick="deleteProduct('${p.id}')">លុប</button></div></td></tr>`).join("")
    : '<tr><td colspan="5" class="empty">មិនមានទំនិញទេ</td></tr>';
}
function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}
$("product-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = $("product-id").value;
  const record = {name:$("product-name").value.trim(), sku:$("product-sku").value.trim(),
    quantity:Number($("product-quantity").value), price:Number($("product-price").value||0)};
  const request = id ? supabaseClient.from("products").update(record).eq("id",id)
                     : supabaseClient.from("products").insert(record);
  const {error} = await request;
  if (error) return showMessage("form-message", error.message);
  showMessage("form-message", id ? "កែប្រែបានជោគជ័យ" : "បន្ថែមបានជោគជ័យ", true);
  resetForm(); await loadProducts();
});
window.editProduct = (id) => {
  const p = products.find(x => String(x.id)===String(id)); if(!p) return;
  $("product-id").value=p.id; $("product-name").value=p.name||""; $("product-sku").value=p.sku||"";
  $("product-quantity").value=p.quantity??0; $("product-price").value=p.price??0;
  $("form-title").textContent="កែប្រែទំនិញ"; $("save-btn").textContent="រក្សាទុកការកែប្រែ";
  $("cancel-edit").classList.remove("hidden"); window.scrollTo({top:0,behavior:"smooth"});
};
window.deleteProduct = async (id) => {
  if (!confirm("តើអ្នកប្រាកដថាចង់លុបទំនិញនេះមែនទេ?")) return;
  const {error}=await supabaseClient.from("products").delete().eq("id",id);
  if(error) return showMessage("global-message",error.message);
  await loadProducts();
};
function resetForm() {
  $("product-form").reset(); $("product-id").value=""; $("product-quantity").value=0; $("product-price").value=0;
  $("form-title").textContent="បន្ថែមទំនិញថ្មី"; $("save-btn").textContent="រក្សាទុក";
  $("cancel-edit").classList.add("hidden");
}
$("cancel-edit").addEventListener("click", resetForm);
$("refresh-btn").addEventListener("click", loadProducts);
$("search").addEventListener("input", renderProducts);
loadSession();

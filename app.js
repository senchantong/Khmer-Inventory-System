(() => {
"use strict";
// Use only the public publishable/anon key in browser code. Never use service_role.
const URL="https://zkjvcnhweldqqyvvgcqo.supabase.co";
const KEY="sb_publishable_XcYuP69wWGnQ2XJ-z_YFHA_DPshuI6D";
const $=id=>document.getElementById(id);
let db, products=[], cart=[];
function note(s,type="info"){const n=$("msg");n.textContent=s;n.className=type; n.classList.remove("hide");}
function show(session){const ok=!!session?.user;$("login").classList.toggle("hide",ok);$("dashboard").classList.toggle("hide",!ok);$("logout").classList.toggle("hide",!ok);$("who").textContent=ok?`ចូលជា៖ ${session.user.email||session.user.id}`:"";}
function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
const money=n=>"$"+Number(n||0).toFixed(2);
async function refresh(){
 try{let r=await db.from("products").select("id,name,sku,quantity,price,cost_price").order("name");if(r.error)throw r.error;products=r.data||[];
 $("products").innerHTML=products.length?products.map(p=>`<tr><td>${esc(p.name)}</td><td>${esc(p.sku||"-")}</td><td>${p.quantity}</td><td>${money(p.price)}</td></tr>`).join(""):'<tr><td colspan="4">មិនទាន់មានផលិតផល</td></tr>';
 $("chooseProduct").innerHTML=products.filter(p=>Number(p.quantity)>0).map(p=>`<option value="${p.id}">${esc(p.name)} — ${money(p.price)} (ស្តុក ${p.quantity})</option>`).join("")||'<option value="">គ្មានស្តុក</option>';
 let s=await db.from("sales").select("invoice_no,customer_name,total,created_at").order("created_at",{ascending:false}).limit(20);if(s.error)throw s.error;
 $("sales").innerHTML=(s.data||[]).map(x=>`<tr><td>${esc(x.invoice_no)}</td><td>${esc(x.customer_name||"អតិថិជនទូទៅ")}</td><td>${money(x.total)}</td><td>${new Date(x.created_at).toLocaleString()}</td></tr>`).join("")||'<tr><td colspan="4">មិនទាន់មានប្រវត្តិលក់</td></tr>';
 drawCart();
 }catch(e){console.error(e);note("មិនអាចផ្ទុកទិន្នន័យ៖ "+(e.message||e.code||"Unknown error"),"error");}
}
function drawCart(){ $("cart").innerHTML=cart.map((x,i)=>`<tr><td>${esc(x.name)}</td><td>${x.quantity}</td><td>${money(x.price*x.quantity)}</td><td><button class="secondary" data-remove="${i}" type="button">ដក</button></td></tr>`).join("")||'<tr><td colspan="4">កន្ត្រកទទេ</td></tr>';const sub=cart.reduce((a,x)=>a+x.price*x.quantity,0);$("total").textContent="សរុប: "+money(Math.max(0,sub-Number($("discount").value||0)));}
async function login(e){e.preventDefault();const b=$("loginBtn");b.disabled=true;b.textContent="កំពុងចូល...";try{const {data,error}=await db.auth.signInWithPassword({email:$("email").value.trim(),password:$("password").value});if(error)throw error;if(!data.session)throw Error("គ្មាន Session បន្ទាប់ពី Login។");show(data.session);note("Login ជោគជ័យ។","success");await refresh();}catch(err){console.error("SIGN IN:",err);note("Login មិនបានសម្រេច៖ "+(err.message||err.code||"Unknown error"),"error");}finally{b.disabled=false;b.textContent="ចូលប្រព័ន្ធ";}}
async function addProduct(e){e.preventDefault();try{const {error}=await db.from("products").insert({name:$("pname").value.trim(),sku:$("psku").value.trim()||null,quantity:Number($("pqty").value),price:Number($("pprice").value),cost_price:Number($("pcost").value||0)});if(error)throw error;$("productForm").reset();$("pqty").value="0";$("pprice").value="0";$("pcost").value="0";await refresh();note("បានរក្សាទុកផលិតផល។","success");}catch(err){note("រក្សាទុកមិនបាន៖ "+err.message,"error");}}
function addCart(){const p=products.find(x=>String(x.id)===$("chooseProduct").value),q=Number($("qty").value);if(!p||q<=0)return note("សូមជ្រើសផលិតផល និងចំនួនត្រឹមត្រូវ។","error");let x=cart.find(i=>String(i.product_id)===String(p.id));if((x?.quantity||0)+q>Number(p.quantity))return note("ស្តុកមិនគ្រប់គ្រាន់។","error");if(x)x.quantity+=q;else cart.push({product_id:p.id,name:p.name,price:Number(p.price),quantity:q});drawCart();}
async function finish(){if(!cart.length)return note("កន្ត្រកទទេ។","error");const b=$("finish");b.disabled=true;try{const sub=cart.reduce((a,x)=>a+x.price*x.quantity,0),disc=Number($("discount").value||0),rate=Number($("rate").value||4100),currency=$("currency").value,paid=Number($("paid").value||0);if(disc<0||disc>sub)throw Error("បញ្ចុះតម្លៃមិនត្រឹមត្រូវ");if(rate<=0)throw Error("អត្រាប្តូរប្រាក់មិនត្រឹមត្រូវ");if(paid<(currency==="USD"?sub-disc:(sub-disc)*rate))throw Error("ប្រាក់បង់មិនគ្រប់");const invoice="INV-"+Date.now();const {error}=await db.rpc("create_sale",{p_invoice_no:invoice,p_customer_name:$("customer").value.trim()||"អតិថិជនទូទៅ",p_customer_phone:$("phone").value.trim()||null,p_discount:disc,p_paid_amount:paid,p_payment_currency:currency,p_exchange_rate:rate,p_items:cart.map(x=>({product_id:x.product_id,quantity:x.quantity}))});if(error)throw error;cart=[];$("customer").value="";$("phone").value="";$("discount").value="0";$("paid").value="0";await refresh();note("លក់ជោគជ័យ! វិក្កយបត្រ "+invoice,"success");}catch(e){console.error(e);note("លក់មិនបាន៖ "+e.message,"error");}finally{b.disabled=false;}}
async function init(){if(!window.supabase?.createClient){note("Supabase library មិនទាន់ដំណើរការ។ សូមពិនិត្យ Internet និង Refresh។","error");return;}
 db=window.supabase.createClient(URL,KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
 $("loginForm").addEventListener("submit",login);$("productForm").addEventListener("submit",addProduct);$("refresh").addEventListener("click",refresh);$("addCart").addEventListener("click",addCart);$("finish").addEventListener("click",finish);$("discount").addEventListener("input",drawCart);
 $("cart").addEventListener("click",e=>{const b=e.target.closest("[data-remove]");if(b){cart.splice(Number(b.dataset.remove),1);drawCart();}});
 $("logout").addEventListener("click",async()=>{const {error}=await db.auth.signOut();if(error)note(error.message,"error");else{show(null);note("បានចាកចេញ។","success");}});
 const {data,error}=await db.auth.getSession();if(error)note("Session error: "+error.message,"error");show(data?.session||null);
 db.auth.onAuthStateChange((event,session)=>{show(session);if(event==="SIGNED_IN"&&session)setTimeout(refresh,0);});
 if(data?.session)await refresh();
}
document.addEventListener("DOMContentLoaded",init);
})();
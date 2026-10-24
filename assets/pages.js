/* GrModPro — per-page logic. Each page sets <body data-page="..."> */
import { icon, esc, MODS, CATS, findMod, renderCards, cardHTML, toast } from "./app.js?v=8";
import * as auth from "./auth.js";

const CODE_RE = new RegExp("\\x60([^\\x60]+)\\x60", "g");
const $ = s => document.querySelector(s);
const page = document.body.dataset.page;
const params = new URLSearchParams(location.search);
const ready = MODS.filter(m => m.ready);
const catCount = id => MODS.filter(m => m.category === id).length;

function catTiles(target) {
  if (!target) return;
  target.innerHTML = CATS.map(c => `<a class="cat-tile" href="discover.html?cat=${encodeURIComponent(c.id)}">
    <span class="cat-icon">${icon(c.icon)}</span><strong>${esc(c.label)}</strong><span>${esc(c.blurb)}</span>
    <small>${catCount(c.id)} ${catCount(c.id) === 1 ? "project" : "projects"}</small></a>`).join("");
}
function rerenderOnUser(fn) { document.addEventListener("gmp:user", fn); }

/* ---------- Home ---------- */
if (page === "home") {
  const draw = () => {
    renderCards($("#popular"), ready.slice(0, 3));
    renderCards($("#soon"), MODS.filter(m => !m.ready).slice(0, 3));
  };
  draw(); rerenderOnUser(draw);
  catTiles($("#cats"));
  $("#hero-search")?.addEventListener("submit", e => {
    e.preventDefault();
    const q = $("#hero-q").value.trim();
    location.href = "discover.html" + (q ? "?q=" + encodeURIComponent(q) : "");
  });
  const cta = $("#account-cta");
  rerenderOnUser(e => { if (cta) cta.hidden = !!e.detail; });
}

/* ---------- Browse / Discover ---------- */
if (page === "discover") {
  const state = { q: params.get("q") || "", cat: params.get("cat") || "All", readyOnly: params.get("ready") === "1" };
  const q = $("#q"), chips = $("#chips"), only = $("#ready-only"), grid = $("#results"), line = $("#result-line"), empty = $("#empty");
  q.value = state.q; only.checked = state.readyOnly;
  chips.innerHTML = ["All", ...CATS.map(c => c.id)].map(c => `<button class="chip" type="button" data-cat="${esc(c)}" aria-pressed="${c === state.cat}">${c === "All" ? "Everything" : esc(c)}</button>`).join("");
  function draw() {
    const term = state.q.toLowerCase();
    const list = MODS.filter(m => (state.cat === "All" || m.category === state.cat) && (!state.readyOnly || m.ready) &&
      (!term || [m.title, m.category, m.short, m.description].join(" ").toLowerCase().includes(term)));
    renderCards(grid, list);
    empty.hidden = list.length > 0;
    line.textContent = list.length === MODS.length ? `Showing all ${list.length} projects` : `Showing ${list.length} of ${MODS.length} projects`;
    chips.querySelectorAll(".chip").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.cat === state.cat)));
    const u = new URLSearchParams();
    if (state.q) u.set("q", state.q); if (state.cat !== "All") u.set("cat", state.cat); if (state.readyOnly) u.set("ready", "1");
    history.replaceState(null, "", location.pathname + (u.toString() ? "?" + u : ""));
  }
  q.addEventListener("input", () => { state.q = q.value.trim(); draw(); });
  $("#search-form").addEventListener("submit", e => e.preventDefault());
  chips.addEventListener("click", e => { const b = e.target.closest(".chip"); if (b) { state.cat = b.dataset.cat; draw(); } });
  only.addEventListener("change", () => { state.readyOnly = only.checked; draw(); });
  $("#clear").addEventListener("click", () => { state.q = ""; state.cat = "All"; state.readyOnly = false; q.value = ""; only.checked = false; draw(); q.focus(); });
  draw(); rerenderOnUser(draw);
}

/* ---------- Categories ---------- */
if (page === "categories") catTiles($("#cats"));

/* ---------- Popular / New ---------- */
if (page === "trending") {
  const draw = () => renderCards($("#results"), MODS.filter(m => m.trending).sort((a, b) => a.trending - b.trending));
  draw(); rerenderOnUser(draw);
}
if (page === "recent") {
  const draw = () => renderCards($("#results"), MODS.filter(m => m.added).sort((a, b) => b.added.localeCompare(a.added)));
  draw(); rerenderOnUser(draw);
}

/* ---------- Project details ---------- */
if (page === "project") {
  const m = findMod(params.get("id"));
  const root = $("#project");
  if (!m) {
    root.innerHTML = `<div class="empty" style="margin:40px 0"><h3>We couldn't find that add-on</h3><p>The link may be old, or the project may have moved.</p><a class="btn btn-primary" href="discover.html">Browse all add-ons</a></div>`;
  } else {
    document.title = m.title + " · GrModPro";
    $("#crumb-title").textContent = m.title;
    const fmt = d => new Date(d + "T12:00:00").toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });
    const draw = () => {
      const fav = auth.getFavorites().includes(m.id);
      root.innerHTML = `<div class="project">
        <div class="project-cover"><img src="${esc(m.cover)}" alt="" width="1280" height="720"></div>
        <div class="project-info">
          <span class="badge ${m.ready ? (m.experimental ? "badge-early" : "badge-ready") : "badge-soon"}">${esc(m.badge)}</span>
          <h1>${esc(m.title)}</h1>
          <p class="lead">${esc(m.description)}</p>
          <div class="project-actions">
            ${m.ready ? `<a class="btn btn-primary btn-lg" href="https://github.com/leoissac123-art/GRModPro/raw/refs/heads/main/${esc(m.download)}" target="_blank" rel="noopener noreferrer">${icon("download")}Download ${esc(m.fileType)}</a>` : `<span class="btn btn-lg" aria-disabled="true">Not available to download yet</span>`}
            <div class="row">
              <button class="btn" type="button" data-fav="${esc(m.id)}" data-fav-label aria-pressed="${fav}" aria-label="${fav ? "Remove from" : "Save to"} favorites: ${esc(m.title)}">${icon("heart")}<span>${fav ? "Saved" : "Save"}</span></button>
              ${(m.extras || []).map(x => `<a class="btn" href="https://github.com/leoissac123-art/GRModPro/raw/refs/heads/main/${esc(x.href)}" target="_blank" rel="noopener noreferrer">${icon("download")}${esc(x.label)}</a>`).join("")}
            </div>
          </div>
          ${m.note ? `<div class="notice">${icon("alert")}<span>${esc(m.note)} Always back up your world before adding new packs.</span></div>` : ""}
          <dl class="facts">
            <div><dt>Category</dt><dd>${esc(m.category)}</dd></div>
            <div><dt>Version</dt><dd>${esc(m.version || "Not released")}</dd></div>
            <div><dt>Works with</dt><dd>${esc(m.works || "Not released yet")}</dd></div>
            <div><dt>${m.added ? "Added" : "Status"}</dt><dd>${m.added ? fmt(m.added) : esc(m.badge)}</dd></div>
          </dl>
        </div></div>
        ${m.ready ? `<section class="install"><h2>How to install</h2><ol>${m.steps.map(s => `<li><span>${esc(s).replace(CODE_RE, "<code>$1</code>")}</span></li>`).join("")}</ol>
          <div class="notice info" style="margin-top:22px">${icon("info")}<span>These are free community downloads, not Minecraft Marketplace items. Achievements may be turned off in worlds that use them.</span></div></section>`
          : `<div class="notice info">${icon("info")}<span>This project isn't released yet. Save it to your favorites and check back — the download button will appear here when a real file is ready.</span></div>`}
        <section class="section" style="padding-top:56px"><div class="section-head"><div><h2>You might also like</h2></div><a class="link-more" href="discover.html">See everything ${icon("arrow")}</a></div>
          <div class="grid">${MODS.filter(x => x.id !== m.id && x.ready).slice(0, 3).map(cardHTML).join("")}</div></section>`;
    };
    draw(); rerenderOnUser(draw);
  }
}

/* ---------- Form helpers ---------- */
function setBusy(btn, busy, label) {
  btn.disabled = busy;
  if (busy) { btn.dataset.label = btn.innerHTML; btn.innerHTML = `<span class="spinner" aria-hidden="true"></span>${label}`; }
  else if (btn.dataset.label) btn.innerHTML = btn.dataset.label;
}
function message(el, kind, text) {
  el.hidden = false;
  el.className = "notice " + kind;
  el.replaceChildren();
  const iconHolder = document.createElement("span");
  iconHolder.innerHTML = icon(kind === "ok" ? "check" : kind === "error" ? "alert" : "info");
  const textHolder = document.createElement("span");
  textHolder.textContent = String(text ?? "");
  el.append(iconHolder.firstElementChild, textHolder);
  el.setAttribute("role", kind === "error" ? "alert" : "status");
}
document.querySelectorAll(".pw-toggle").forEach(b => b.addEventListener("click", () => {
  const input = b.previousElementSibling; const show = input.type === "password";
  input.type = show ? "text" : "password"; b.textContent = show ? "Hide" : "Show";
  b.setAttribute("aria-label", show ? "Hide password" : "Show password");
}));
const safeNext = () => { const n = params.get("next") || ""; return /^[a-z0-9_-]+\.html(\?[^\s]*)?$/i.test(n) ? n : "account.html"; };
const validEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

/* ---------- Guest buttons (log in, sign up, account pages) ---------- */
document.querySelectorAll("[data-guest]").forEach(b => b.addEventListener("click", () => {
  auth.startGuest();
  toast("You're browsing as a guest");
  const n = params.get("next");
  setTimeout(() => location.href = (n && /^[a-z0-9_-]+\.html(\?[^\s]*)?$/i.test(n) && n !== "account.html") ? n : "discover.html", 500);
}));

/* ---------- Sign up ---------- */
if (page === "signup") {
  auth.ready.then(u => { if (u) location.replace(safeNext()); });
  const form = $("#signup-form"), msg = $("#form-msg"), btn = form.querySelector("button[type=submit]");
  form.addEventListener("submit", async e => {
    e.preventDefault();
    const name = form.name.value.trim(), email = form.email.value.trim(), password = form.password.value;
    form.querySelectorAll(".input").forEach(i => i.removeAttribute("aria-invalid"));
    if (!name) { form.name.setAttribute("aria-invalid", "true"); return message(msg, "error", "Please tell us what to call you."); }
    if (!validEmail(email)) { form.email.setAttribute("aria-invalid", "true"); return message(msg, "error", "Please enter a valid email address, like name@example.com."); }
    if (password.length < 8) { form.password.setAttribute("aria-invalid", "true"); return message(msg, "error", "Your password needs at least 8 characters."); }
    setBusy(btn, true, "Creating your account…");
    try {
      const data = await auth.signUp({ name, email, password });
      if (data.session) { toast("Welcome to GrModPro, " + name + "!"); setTimeout(() => location.href = safeNext(), 600); }
      else {
        form.hidden = true; $("#switch-line").hidden = true;
        message(msg, "ok", `Almost done! Check your email. We sent a link to ${email}. Click it to confirm your account, then you can log in. If you can’t find it, check your spam folder.`);
      }
    } catch (err) { message(msg, "error", auth.friendlyError(err)); }
    finally { setBusy(btn, false); }
  });
}

/* ---------- Log in ---------- */
if (page === "login") {
  auth.ready.then(u => { if (u) location.replace(safeNext()); });
  const form = $("#login-form"), msg = $("#form-msg"), btn = form.querySelector("button[type=submit]");
  if (params.get("reset") === "1") message(msg, "ok", "Your password was updated. Log in with your new password.");
  const nextLink = $("#signup-link"); if (nextLink && params.get("next")) nextLink.href = "signup.html?next=" + encodeURIComponent(params.get("next"));
  form.addEventListener("submit", async e => {
    e.preventDefault();
    const email = form.email.value.trim(), password = form.password.value;
    if (!validEmail(email)) { form.email.setAttribute("aria-invalid", "true"); return message(msg, "error", "Please enter a valid email address."); }
    if (!password) { form.password.setAttribute("aria-invalid", "true"); return message(msg, "error", "Please enter your password."); }
    setBusy(btn, true, "Logging in…");
    try {
      await auth.logIn({ email, password });
      toast("Welcome back, " + auth.displayName() + "!");
      setTimeout(() => location.href = safeNext(), 500);
    } catch (err) { message(msg, "error", esc(auth.friendlyError(err))); setBusy(btn, false); }
  });
}

/* ---------- Forgot password ---------- */
if (page === "forgot") {
  const form = $("#forgot-form"), msg = $("#form-msg"), btn = form.querySelector("button[type=submit]");
  form.addEventListener("submit", async e => {
    e.preventDefault();
    const email = form.email.value.trim();
    if (!validEmail(email)) return message(msg, "error", "Please enter a valid email address.");
    setBusy(btn, true, "Sending…");
    try {
      await auth.sendReset(email);
      form.hidden = true;
      message(msg, "ok", `If an account exists for ${email}, we’ve sent a link to reset your password. It may take a minute — check your spam folder too.`);
    } catch (err) { message(msg, "error", esc(auth.friendlyError(err))); }
    finally { setBusy(btn, false); }
  });
}

/* ---------- Reset password (from email link) ---------- */
if (page === "reset") {
  const form = $("#reset-form"), msg = $("#form-msg"), btn = form.querySelector("button[type=submit]");
  auth.ready.then(u => {
    setTimeout(() => { if (!auth.getUser()) { form.hidden = true; message(msg, "error", 'This reset link has expired or was already used. <a href="forgot.html">Request a new one</a>.'); } }, 1200);
  });
  form.addEventListener("submit", async e => {
    e.preventDefault();
    const a = form.password.value, b = form.confirm.value;
    if (a.length < 8) return message(msg, "error", "Your new password needs at least 8 characters.");
    if (a !== b) return message(msg, "error", "The two passwords don't match.");
    setBusy(btn, true, "Saving…");
    try { await auth.updatePassword(a); await auth.logOut(); location.href = "login.html?reset=1"; }
    catch (err) { message(msg, "error", esc(auth.friendlyError(err))); setBusy(btn, false); }
  });
}

/* ---------- Account ---------- */
if (page === "account") {
  const out = $("#signed-out"), inn = $("#signed-in"), gv = $("#guest-view");
  $("[data-exit-guest-page]")?.addEventListener("click", () => { auth.endGuest(); toast("Guest mode ended"); });
  if (params.get("welcome") === "1") toast("Your email is confirmed. Welcome to GrModPro!");
  const draw = user => {
    const guest = !user && auth.isGuest();
    out.hidden = !!user || guest; inn.hidden = !user; gv.hidden = !guest;
    if (guest) {
      const favs = auth.getFavorites().map(findMod).filter(Boolean);
      $("#guest-grid").innerHTML = favs.map(cardHTML).join("");
      $("#guest-empty").hidden = favs.length > 0;
    }
    if (!user) return;
    const name = auth.displayName(user);
    $("#p-avatar").textContent = (name[0] || "?").toUpperCase();
    $("#p-name").textContent = name; $("#p-email").textContent = user.email;
    $("#p-since").textContent = "Member since " + new Date(user.created_at).toLocaleDateString(undefined, { month: "long", year: "numeric" });
    const nameInput = $("#name-form").name; if (document.activeElement !== nameInput) nameInput.value = name;
    const favs = auth.getFavorites(user).map(findMod).filter(Boolean);
    $("#fav-count").textContent = favs.length ? `${favs.length} saved` : "";
    $("#fav-grid").innerHTML = favs.map(cardHTML).join("");
    $("#fav-empty").hidden = favs.length > 0;
  };
  auth.ready.then(() => auth.onUserChange(draw));
  $("#name-form").addEventListener("submit", async e => {
    e.preventDefault(); const f = e.target, btn = f.querySelector("button"), name = f.name.value.trim();
    if (!name) return toast("Please enter a name", "alert");
    setBusy(btn, true, "Saving…");
    try { await auth.updateName(name); toast("Your name was updated"); } catch (err) { toast(auth.friendlyError(err), "alert"); }
    finally { setBusy(btn, false); }
  });
  $("#pw-form").addEventListener("submit", async e => {
    e.preventDefault(); const f = e.target, btn = f.querySelector("button[type=submit]"), msg = $("#pw-msg");
    if (f.password.value.length < 8) return message(msg, "error", "Your new password needs at least 8 characters.");
    setBusy(btn, true, "Saving…");
    try { await auth.updatePassword(f.password.value); f.reset(); message(msg, "ok", "Your password was changed."); }
    catch (err) { message(msg, "error", esc(auth.friendlyError(err))); }
    finally { setBusy(btn, false); }
  });
}

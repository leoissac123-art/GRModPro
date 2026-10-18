/* GrModPro — shared page behavior */
import { ready, onUserChange, getUser, displayName, logOut, getFavorites, toggleFavorite, friendlyError, isGuest, startGuest, endGuest } from "./auth.js";

const ICONS = {
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  heart: '<path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z"/>',
  download: '<path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/>',
  arrow: '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  alert: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/>',
  sparkle: '<path d="M12 3 13.9 9.1 20 11l-6.1 1.9L12 19l-1.9-6.1L4 11l6.1-1.9Z"/>',
  leaf: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10Z"/><path d="M2 21c0-3 1.9-5.4 5.1-6"/>',
  paw: '<circle cx="11" cy="4" r="2"/><circle cx="18" cy="8" r="2"/><circle cx="20" cy="16" r="2"/><path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.8 1.2 3.5 3.5 0 0 0-2.4-2.4A3.5 3.5 0 0 1 6 10.4 5 5 0 0 1 9 10Z"/>',
  bolt: '<path d="M13 2 3 14h9l-1 8 10-12h-9Z"/>',
  wrench: '<path d="M14.7 6.3a4 4 0 0 0 5 5L22 14l-8 8-2.3-2.3a4 4 0 0 0-5-5L4.3 12.3l2-2 3 3 3.4-3.4-3-3 2-2Z"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/>',
  menu: '<path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>'
};
export const icon = (name, cls = "icon") => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ""}</svg>`;
window.gmpIcon = icon;

export const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
export const MODS = window.GMP_MODS || [];
export const CATS = window.GMP_CATEGORIES || [];
export const findMod = id => MODS.find(m => m.id === id);

const downloadHref = path => "https://github.com/leoissac123-art/GRModPro/raw/refs/heads/main/" + String(path || "").replace(/^\/+/, "");

/* Toast */
let toastTimer;
export function toast(message, kind = "check") {
  document.querySelector(".toast")?.remove();
  const t = document.createElement("div");
  t.className = "toast"; t.setAttribute("role", "status");
  t.innerHTML = icon(kind) + "<span>" + esc(message) + "</span>";
  document.body.appendChild(t);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.remove(), 3200);
}

/* Cards */
function badgeClass(m) { return m.ready ? (m.experimental ? "badge-early" : "badge-ready") : "badge-soon"; }
export function cardHTML(m) {
  const favs = getFavorites();
  const isFav = favs.includes(m.id);
  const details = "project.html?id=" + encodeURIComponent(m.id);
  const action = m.ready
    ? `<a class="btn btn-primary" href="${esc(downloadHref(m.download))}" target="_blank" rel="noopener noreferrer" data-download="${esc(m.id)}">${icon("download")}Download</a><a class="btn" href="${details}">Details</a>`
    : `<a class="btn btn-block" href="${details}">Learn more</a>`;
  return `<article class="card${m.ready ? "" : " is-soon"}">
    <div class="card-cover">
      <img src="${esc(m.cover)}" alt="" loading="lazy" width="640" height="360">
      <span class="badge ${badgeClass(m)}">${esc(m.badge)}</span>
      <button class="fav-btn" type="button" data-fav="${esc(m.id)}" aria-pressed="${isFav}" aria-label="${isFav ? "Remove from" : "Save to"} favorites: ${esc(m.title)}">${icon("heart")}</button>
    </div>
    <div class="card-body">
      <span class="card-cat">${esc(m.category)}</span>
      <h3><a href="${details}">${esc(m.title)}</a></h3>
      <p>${esc(m.short)}</p>
      ${m.version ? `<span class="card-meta">Version ${esc(m.version)} · ${esc(m.fileType || "")}</span>` : ""}
      <div class="card-actions">${action}</div>
    </div>
  </article>`;
}
export function renderCards(target, list) {
  if (!target) return;
  target.innerHTML = list.map(cardHTML).join("");
}

/* Favorite buttons work anywhere on the page */
document.addEventListener("click", async e => {
  const btn = e.target.closest("[data-fav]");
  if (!btn) return;
  e.preventDefault(); e.stopPropagation();
  const firstGuestSave = !getUser() && !isGuest();
  if (firstGuestSave) startGuest();
  const id = btn.dataset.fav;
  btn.disabled = true;
  try {
    const saved = await toggleFavorite(id);
    if (!getUser() && saved) toast(firstGuestSave ? "Saved on this device. Sign up free to keep favorites everywhere." : "Saved to your favorites on this device", "heart");
    else toast(saved ? "Saved to your favorites" : "Removed from favorites", saved ? "heart" : "check");
  } catch (err) { toast(friendlyError(err), "alert"); }
  finally { btn.disabled = false; }
});

function syncFavButtons() {
  const favs = getFavorites();
  document.querySelectorAll("[data-fav]").forEach(b => {
    const on = favs.includes(b.dataset.fav);
    b.setAttribute("aria-pressed", String(on));
    const label = b.getAttribute("aria-label") || "";
    b.setAttribute("aria-label", label.replace(/^(Remove from|Save to)/, on ? "Remove from" : "Save to"));
    if (b.dataset.favLabel !== undefined) b.querySelector("span").textContent = on ? "Saved" : "Save";
  });
}

/* Header: account area */
function renderAuth(user) {
  const slot = document.getElementById("auth-slot");
  const mobile = document.getElementById("mobile-auth");
  if (!slot) return;
  if (!user && isGuest()) {
    const n = getFavorites().length;
    slot.innerHTML = `<div class="account-menu">
      <button class="avatar-btn" type="button" aria-haspopup="menu" aria-expanded="false" id="account-btn"><span class="avatar avatar-guest">${icon("user")}</span><span>Guest</span></button>
      <div class="dropdown" role="menu" id="account-dropdown" hidden>
        <div class="who"><strong>Browsing as a guest</strong><span>Favorites are saved on this device only</span></div>
        <a href="account.html#favorites" role="menuitem">${icon("heart")}My favorites${n ? ` (${n})` : ""}</a>
        <a href="signup.html" role="menuitem">${icon("user")}Create free account</a>
        <a href="login.html" role="menuitem">${icon("arrow")}Log in</a>
        <button type="button" role="menuitem" data-exit-guest>${icon("logout")}Exit guest mode</button>
      </div></div>`;
    if (mobile) mobile.innerHTML = `<a class="btn" href="account.html">${icon("heart")}Guest favorites</a><a class="btn btn-primary" href="signup.html">Sign up free</a>`;
  } else if (!user) {
    slot.innerHTML = `<a class="btn btn-ghost" href="login.html">Log in</a><a class="btn btn-primary" href="signup.html">Sign up free</a>`;
    if (mobile) mobile.innerHTML = `<a class="btn" href="login.html">Log in</a><a class="btn btn-primary" href="signup.html">Sign up free</a>`;
  } else {
    const name = displayName(user);
    slot.innerHTML = `<div class="account-menu">
      <button class="avatar-btn" type="button" aria-haspopup="menu" aria-expanded="false" id="account-btn"><span class="avatar">${esc(name[0] || "?")}</span><span>${esc(name)}</span></button>
      <div class="dropdown" role="menu" id="account-dropdown" hidden>
        <div class="who"><strong>${esc(name)}</strong><span>${esc(user.email)}</span></div>
        <a href="account.html" role="menuitem">${icon("user")}My account</a>
        <a href="account.html#favorites" role="menuitem">${icon("heart")}My favorites</a>
        <button type="button" role="menuitem" data-logout>${icon("logout")}Log out</button>
      </div></div>`;
    if (mobile) mobile.innerHTML = `<a class="btn" href="account.html">${icon("user")}My account</a><button class="btn" type="button" data-logout>${icon("logout")}Log out</button>`;
  }
  document.querySelectorAll("[data-exit-guest]").forEach(b => b.addEventListener("click", () => {
    endGuest(); toast("Guest mode ended. Favorites on this device were cleared.");
  }));
  document.querySelectorAll("[data-logout]").forEach(b => b.addEventListener("click", async () => {
    await logOut(); toast("You're logged out. See you soon!");
    if (document.body.dataset.private) setTimeout(() => location.href = "index.html", 700);
  }));
}

function setDropdown(open) {
  const btn = document.getElementById("account-btn"), dd = document.getElementById("account-dropdown");
  if (!btn || !dd) return;
  dd.hidden = !open; btn.setAttribute("aria-expanded", String(open));
}
document.addEventListener("click", e => {
  if (e.target.closest("#account-btn")) { setDropdown(document.getElementById("account-dropdown").hidden); return; }
  if (!e.target.closest(".account-menu")) setDropdown(false);
});
document.addEventListener("keydown", e => { if (e.key === "Escape") setDropdown(false); });

/* Mobile menu */
const menuBtn = document.getElementById("menu-btn");
const mobileNav = document.getElementById("mobile-nav");
menuBtn?.addEventListener("click", () => {
  const open = !mobileNav.classList.contains("open");
  mobileNav.classList.toggle("open", open);
  menuBtn.setAttribute("aria-expanded", String(open));
  menuBtn.innerHTML = icon(open ? "x" : "menu");
});

ready.then(() => onUserChange(user => { renderAuth(user); syncFavButtons(); document.dispatchEvent(new CustomEvent("gmp:user", { detail: user })); }));

/* Year */
document.querySelectorAll("[data-year]").forEach(el => el.textContent = new Date().getFullYear());

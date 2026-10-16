/* GrModPro accounts — powered by Supabase Auth.
   The publishable key below is designed to be public; it only allows what
   Supabase's security rules permit. Never put a service_role/secret key here. */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const SUPABASE_URL = "https://tgpkgzvgttulqtwnodde.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_bCC2hqVQr48HOe_gXdgHig_OuYJIaRR";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
});

let currentUser = null;
const listeners = new Set();

/* Guest mode: browse and save favorites on this device without an account. */
const GUEST_KEY = "gmp-guest-v1";
function readGuest() { try { return JSON.parse(localStorage.getItem(GUEST_KEY) || "null"); } catch (e) { return null; } }
function writeGuest(g) { try { g ? localStorage.setItem(GUEST_KEY, JSON.stringify(g)) : localStorage.removeItem(GUEST_KEY); } catch (e) {} }
export function isGuest() { return !currentUser && !!readGuest(); }
export function startGuest() { if (!readGuest()) writeGuest({ favorites: [], started: Date.now() }); emit(); }
export function endGuest() { writeGuest(null); emit(); }
function guestFavorites() { const g = readGuest(); return Array.isArray(g?.favorites) ? g.favorites : []; }

/* After sign-in, move any guest favorites onto the real account. */
async function adoptGuestFavorites() {
  const extra = guestFavorites();
  if (!currentUser || !readGuest()) return;
  if (extra.length) {
    const mine = getFavorites();
    const merged = [...new Set([...mine, ...extra])].slice(-100);
    if (merged.length !== mine.length) {
      const { data, error } = await supabase.auth.updateUser({ data: { favorites: merged } });
      if (!error) currentUser = data.user;
    }
  }
  writeGuest(null); emit();
}

export function getUser() { return currentUser; }
export function onUserChange(fn) { listeners.add(fn); fn(currentUser); return () => listeners.delete(fn); }
function emit() { listeners.forEach(fn => { try { fn(currentUser); } catch (e) { console.error(e); } }); }

export const ready = supabase.auth.getSession().then(({ data }) => {
  currentUser = data.session?.user ?? null;
  emit();
  if (currentUser) adoptGuestFavorites();
  return currentUser;
}).catch(() => { emit(); return null; });

supabase.auth.onAuthStateChange((_event, session) => {
  currentUser = session?.user ?? null;
  emit();
});

export function pageUrl(file) { return new URL(file, location.href).href; }

export function displayName(user = currentUser) {
  if (!user) return isGuest() ? "Guest" : "";
  return user.user_metadata?.name || (user.email || "").split("@")[0] || "Player";
}

/* Turn technical Supabase errors into plain language. */
export function friendlyError(error) {
  const msg = (error?.message || String(error || "")).toLowerCase();
  if (msg.includes("invalid login")) return "That email and password don't match. Check for typos, or reset your password.";
  if (msg.includes("email not confirmed")) return "Please confirm your email first. Check your inbox for the link we sent you.";
  if (msg.includes("already registered") || msg.includes("already been registered")) return "An account with this email already exists. Try logging in instead.";
  if (msg.includes("password should be") || msg.includes("weak")) return "Please choose a stronger password — at least 8 characters with a mix of letters and numbers.";
  if (msg.includes("rate limit") || msg.includes("too many")) return "Too many tries in a short time. Please wait a minute and try again.";
  if (msg.includes("invalid email") || msg.includes("unable to validate email")) return "That email address doesn't look right. Please check it.";
  if (msg.includes("failed to fetch") || msg.includes("network")) return "We couldn't reach the server. Check your internet connection and try again.";
  if (msg.includes("same password") || msg.includes("different from the old")) return "Your new password must be different from your old one.";
  return error?.message || "Something went wrong. Please try again.";
}

export async function signUp({ name, email, password }) {
  const { data, error } = await supabase.auth.signUp({
    email, password,
    options: { data: { name, favorites: guestFavorites() }, emailRedirectTo: pageUrl("account.html?welcome=1") }
  });
  if (error) throw error;
  if (data.session) { currentUser = data.session.user; writeGuest(null); emit(); }
  // Supabase hides "already registered" by returning a user with no identities.
  if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
    throw new Error("User already registered");
  }
  return data;
}

export async function logIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  currentUser = data.user;
  await adoptGuestFavorites();
  return data;
}

export async function logOut() {
  await supabase.auth.signOut();
}

export async function sendReset(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: pageUrl("reset.html") });
  if (error) throw error;
}

export async function updatePassword(password) {
  const { error } = await supabase.auth.updateUser({ password });
  if (error) throw error;
}

export async function updateName(name) {
  const { data, error } = await supabase.auth.updateUser({ data: { name } });
  if (error) throw error;
  currentUser = data.user; emit();
}

/* Favorites are stored on the user's own account profile. */
export function getFavorites(user = currentUser) {
  if (!user) return guestFavorites();
  const list = user?.user_metadata?.favorites;
  return Array.isArray(list) ? list : [];
}

export async function toggleFavorite(id) {
  if (!currentUser) {
    const g = readGuest() || { favorites: [], started: Date.now() };
    const has = g.favorites.includes(id);
    g.favorites = has ? g.favorites.filter(x => x !== id) : [...g.favorites, id].slice(-100);
    writeGuest(g); emit();
    return !has;
  }
  const list = getFavorites();
  const next = list.includes(id) ? list.filter(x => x !== id) : [...list, id].slice(-100);
  const { data, error } = await supabase.auth.updateUser({ data: { favorites: next } });
  if (error) throw error;
  currentUser = data.user; emit();
  return next.includes(id);
}

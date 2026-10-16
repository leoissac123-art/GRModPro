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

export function getUser() { return currentUser; }
export function onUserChange(fn) { listeners.add(fn); fn(currentUser); return () => listeners.delete(fn); }
function emit() { listeners.forEach(fn => { try { fn(currentUser); } catch (e) { console.error(e); } }); }

export const ready = supabase.auth.getSession().then(({ data }) => {
  currentUser = data.session?.user ?? null;
  emit();
  return currentUser;
}).catch(() => { emit(); return null; });

supabase.auth.onAuthStateChange((_event, session) => {
  currentUser = session?.user ?? null;
  emit();
});

export function pageUrl(file) { return new URL(file, location.href).href; }

export function displayName(user = currentUser) {
  if (!user) return "";
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
    options: { data: { name, favorites: [] }, emailRedirectTo: pageUrl("account.html?welcome=1") }
  });
  if (error) throw error;
  // Supabase hides "already registered" by returning a user with no identities.
  if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
    throw new Error("User already registered");
  }
  return data;
}

export async function logIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
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
  const list = user?.user_metadata?.favorites;
  return Array.isArray(list) ? list : [];
}

export async function toggleFavorite(id) {
  if (!currentUser) throw new Error("NOT_SIGNED_IN");
  const list = getFavorites();
  const next = list.includes(id) ? list.filter(x => x !== id) : [...list, id].slice(-100);
  const { data, error } = await supabase.auth.updateUser({ data: { favorites: next } });
  if (error) throw error;
  currentUser = data.user; emit();
  return next.includes(id);
}

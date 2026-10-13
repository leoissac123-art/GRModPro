// Supabase Edge Function: supabase/functions/ai-assistant/index.ts
// Set OPENAI_API_KEY as a Supabase Edge Function secret. Never put it in browser code.
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": Deno.env.get("ALLOWED_ORIGIN") ?? "https://leoissac123-art.github.io",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: corsHeaders });
  const origin = req.headers.get("origin") ?? "";
  const allowedOrigin = Deno.env.get("ALLOWED_ORIGIN") ?? "https://leoissac123-art.github.io";
  if (origin && origin !== allowedOrigin) return new Response(JSON.stringify({ error: "Origin not allowed" }), { status: 403, headers: corsHeaders });
  const apiKey = Deno.env.get("OPENAI_API_KEY");
  if (!apiKey) return new Response(JSON.stringify({ error: "AI service is not configured yet." }), { status: 503, headers: corsHeaders });
  try {
    const body = await req.json();
    if (!Array.isArray(body.messages) || body.messages.length < 1 || body.messages.length > 12) {
      return new Response(JSON.stringify({ error: "Send between 1 and 12 messages." }), { status: 400, headers: corsHeaders });
    }
    const messages = body.messages.map((m: { role?: string; content?: string }) => {
      if (!["user", "assistant"].includes(m.role ?? "") || typeof m.content !== "string" || !m.content.trim() || m.content.length > 2000) throw new Error("Invalid message");
      return { role: m.role, content: m.content.trim() };
    });
    if (messages[messages.length - 1].role !== "user") return new Response(JSON.stringify({ error: "Last message must be from the user." }), { status: 400, headers: corsHeaders });
    const upstream = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": "Bearer " + apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: Deno.env.get("OPENAI_MODEL") ?? "gpt-4o-mini",
        messages: [{ role: "system", content: "You are GRModPro AI, a friendly general-purpose assistant on the GRModPro gaming website. Be helpful, clear, and honest. Do not claim you can change accounts, download files, or perform actions unless a tool actually enables it. Do not request passwords, secret keys, or sensitive personal information." }, ...messages],
        max_tokens: 700,
        temperature: 0.7
      })
    });
    if (!upstream.ok) {
      const status = upstream.status;
      return new Response(JSON.stringify({ error: status === 429 ? "The assistant is busy. Please wait a moment and try again." : "The AI provider could not complete that request." }), { status: 502, headers: corsHeaders });
    }
    const data = await upstream.json();
    const reply = data.choices?.[0]?.message?.content;
    if (typeof reply !== "string" || !reply.trim()) throw new Error("No reply returned");
    return new Response(JSON.stringify({ reply: reply.trim() }), { status: 200, headers: corsHeaders });
  } catch {
    return new Response(JSON.stringify({ error: "Please check your message and try again." }), { status: 400, headers: corsHeaders });
  }
});
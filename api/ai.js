// Second Prof Atlas — AI proxy (Vercel Edge Function).
// Keeps the Anthropic API key on the server and streams plain text back to the page.
// Env vars (Vercel → Project → Settings → Environment Variables):
//   ANTHROPIC_API_KEY  (required)  your key from console.anthropic.com
//   ANTHROPIC_MODEL    (optional)  default "claude-sonnet-5-5"; use "claude-haiku-5-5" to cut cost
//   ALLOWED_ORIGIN     (optional)  e.g. https://second-prof-atlas.vercel.app — blocks other sites
//   RATE_PER_MIN       (optional)  requests per minute per IP, default 12
export const config = { runtime: "edge" };

const MAX_CHARS = 120000;
const hits = new Map(); // best-effort, per edge instance

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });
}

export default async function handler(req) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (req.method === "GET") return json({ ok: !!key });
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  if (!key) return json({ error: "AI is not configured" }, 503);

  const allowed = process.env.ALLOWED_ORIGIN;
  const origin = req.headers.get("origin") || "";
  if (allowed && origin && origin !== allowed) return json({ error: "Forbidden origin" }, 403);

  const ip = (req.headers.get("x-forwarded-for") || "anon").split(",")[0].trim();
  const now = Date.now(), limit = +(process.env.RATE_PER_MIN || 12);
  const list = (hits.get(ip) || []).filter(t => now - t < 60000);
  if (list.length >= limit) return json({ error: "Too many requests" }, 429);
  list.push(now); hits.set(ip, list);

  let body;
  try { body = await req.json(); } catch { return json({ error: "Bad JSON" }, 400); }
  const raw = Array.isArray(body.messages) ? body.messages : [];
  const msgs = [];
  for (const m of raw) {
    if (!m || (m.role !== "user" && m.role !== "assistant") || typeof m.content !== "string" || !m.content.trim()) continue;
    const last = msgs[msgs.length - 1];
    if (last && last.role === m.role) last.content += "\n\n" + m.content; else msgs.push({ role: m.role, content: m.content });
  }
  while (msgs.length && msgs[0].role !== "user") msgs.shift();
  if (!msgs.length || msgs[msgs.length - 1].role !== "user") return json({ error: "Conversation must end with a user turn" }, 400);
  if (msgs.reduce((a, m) => a + m.content.length, 0) > MAX_CHARS) return json({ error: "Too long" }, 413);
  // optional page images (base64 JPEG/PNG/WebP), attached to the final user turn
  const imgs = Array.isArray(body.images) ? body.images.slice(0, 2) : [];
  if (imgs.reduce((a, i) => a + String(i && i.data || "").length, 0) > 3_000_000) return json({ error: "Image too large" }, 413);
  const okType = t => ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(t);
  const apiMsgs = msgs.map(m => ({ role: m.role, content: m.content }));
  if (imgs.length) {
    const last = apiMsgs[apiMsgs.length - 1];
    last.content = [...imgs.filter(i => i && okType(i.media_type) && typeof i.data === "string").map(i => ({ type: "image", source: { type: "base64", media_type: i.media_type, data: i.data } })), { type: "text", text: last.content }];
  }

  const upstream = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({ model: process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5", max_tokens: 3000, stream: true, messages: apiMsgs }),
  });
  if (!upstream.ok || !upstream.body) {
    const status = upstream.status === 429 ? 429 : 502;
    return json({ error: "Upstream error", detail: (await upstream.text()).slice(0, 300) }, status);
  }

  const enc = new TextEncoder(), dec = new TextDecoder();
  let buf = "";
  const stream = new ReadableStream({
    async start(ctrl) {
      const rd = upstream.body.getReader();
      try {
        for (;;) {
          const { done, value } = await rd.read();
          if (done) break;
          buf += dec.decode(value, { stream: true });
          let i;
          while ((i = buf.indexOf("\n")) >= 0) {
            const line = buf.slice(0, i).trim(); buf = buf.slice(i + 1);
            if (!line.startsWith("data:")) continue;
            try {
              const ev = JSON.parse(line.slice(5));
              if (ev.type === "content_block_delta" && ev.delta && ev.delta.type === "text_delta") ctrl.enqueue(enc.encode(ev.delta.text));
            } catch { /* ignore keep-alives */ }
          }
        }
      } finally { ctrl.close(); }
    },
  });
  return new Response(stream, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" } });
}

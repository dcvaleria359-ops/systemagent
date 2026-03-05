export const config = { runtime: 'edge' };

export default async function handler(req) {
  const { url } = await req.json();
  try {
    const clean = url.startsWith("http") ? url : "https://" + url;
    const res = await fetch(`https://r.jina.ai/${clean}`, {
      headers: { Accept: "text/plain" }
    });
    const text = await res.text();
    return new Response(JSON.stringify({ content: text.slice(0, 4000) }), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }
}

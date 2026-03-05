export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { url } = req.body;
  try {
    const clean = url.startsWith("http") ? url : "https://" + url;
    const response = await fetch(`https://r.jina.ai/${clean}`, {
      headers: { Accept: "text/plain" }
    });
    const text = await response.text();
    return res.status(200).json({ content: text.slice(0, 4000) });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

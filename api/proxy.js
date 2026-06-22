// Vercel Serverless Function — proxies /api/* to DummyJSON
// Replaces the Express server for Vercel deployment.
// Uses Cache-Control headers for Vercel Edge Network caching.

const DUMMYJSON_BASE = 'https://dummyjson.com';

export default async function handler(req, res) {
  try {
    // Extract the path after /api, e.g. /api/products/1 → /products/1
    const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const path = urlObj.pathname.replace(/^\/api/, '') || '/';
    const qs = urlObj.search || '';
    const target = `${DUMMYJSON_BASE}${path}${qs}`;

    console.log(`[PROXY] ${req.method} ${target}`);

    const response = await fetch(target, {
      method: req.method,
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();

    // Determine cache duration based on endpoint type
    let maxAge = 30; // default: product lists / searches
    if (/^\/products\/\d+$/.test(path)) {
      maxAge = 120; // product detail — less volatile
    } else if (/^\/(categories|products\/category\/)/.test(path)) {
      maxAge = 300; // categories — rarely change
    }

    res.setHeader('Cache-Control', `s-maxage=${maxAge}, stale-while-revalidate`);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(response.status).json(data);
  } catch (err) {
    console.error('[PROXY ERROR]', err.message);
    res.status(500).json({ error: err.message });
  }
}

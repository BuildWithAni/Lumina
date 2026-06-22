// Vercel Serverless Function — proxies /api/* to DummyJSON
// Replaces the Express server for Vercel deployment.
// Uses Cache-Control headers for Vercel Edge Network caching.

// ── DummyJSON URL mapping ──
// Frontend calls /api/categories but DummyJSON's endpoint is /products/categories
const ROUTES = {
  '/categories':          '/products/categories',
  '/products/category/':  '/products/category/',
};
const DUMMYJSON_BASE = 'https://dummyjson.com';

export default async function handler(req, res) {
  try {
    const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const path = urlObj.pathname.replace(/^\/api/, '') || '/';
    const qs = urlObj.search || '';

    // Map frontend API path → DummyJSON path
    let targetPath = path;
    if (path === '/categories') {
      targetPath = ROUTES['/categories'];
    }

    const target = `${DUMMYJSON_BASE}${targetPath}${qs}`;

    console.log(`[PROXY] ${req.method} ${target}`);

    const response = await fetch(target, {
      method: req.method,
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();

    // Edge cache duration based on endpoint type
    let maxAge = 30;
    if (/^\/products\/\d+$/.test(targetPath)) {
      maxAge = 120;
    } else if (/^\/products\/categories/.test(targetPath) || /^\/products\/category\//.test(targetPath)) {
      maxAge = 300;
    }

    res.setHeader('Cache-Control', `s-maxage=${maxAge}, stale-while-revalidate`);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(response.status).json(data);
  } catch (err) {
    console.error('[PROXY ERROR]', err.message);
    res.status(500).json({ error: err.message });
  }
}

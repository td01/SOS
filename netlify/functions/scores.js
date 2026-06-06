// netlify/functions/scores.js
// Proxies requests to API-Football so the key never reaches the client.
//
// Set API_FOOTBALL_KEY in Netlify → Site settings → Environment variables.
// Uncomment [[redirects]] in netlify.toml when ready to activate.
//
// Usage (from client):
//   fetch('/api/fixtures?league=1&season=2026')
//   fetch('/api/standings?league=1&season=2026')
//   fetch('/api/fixtures?id=12345')   ← single game for live score

const BASE = 'https://api-football-v1.p.rapidapi.com/v3';

exports.handler = async (event) => {
  const key = process.env.API_FOOTBALL_KEY;
  if (!key) {
    return { statusCode: 500, body: JSON.stringify({ error: 'API key not configured' }) };
  }

  // Strip the /api/ prefix added by the Netlify redirect
  const path    = event.path.replace('/.netlify/functions/scores', '');
  const query   = event.queryStringParameters
    ? '?' + new URLSearchParams(event.queryStringParameters).toString()
    : '';

  const url = `${BASE}${path}${query}`;

  try {
    const res  = await fetch(url, {
      headers: {
        'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
        'x-rapidapi-key':  key,
      },
    });
    const data = await res.json();
    return {
      statusCode: 200,
      headers: {
        'Content-Type':  'application/json',
        'Cache-Control': 'public, max-age=60',  // cache 60s — fine for scores
      },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return { statusCode: 502, body: JSON.stringify({ error: err.message }) };
  }
};

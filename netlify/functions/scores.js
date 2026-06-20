// netlify/functions/scores.js
// Proxies requests to API-Football so the key never reaches the client.
//
// Works with either signup path:
//  - Direct at api-football.com → set API_FOOTBALL_KEY (uses v3.football.api-sports.io)
//  - Via RapidAPI               → set API_FOOTBALL_KEY + API_FOOTBALL_VIA_RAPIDAPI=true
//
// Usage (from client):
//   fetch('/api/fixtures?league=1&season=2026')
//   fetch('/api/standings?league=1&season=2026')
//   fetch('/api/players/topscorers?league=1&season=2026')
//   fetch('/api/players/topassists?league=1&season=2026')

const DIRECT_BASE   = 'https://v3.football.api-sports.io';
const RAPIDAPI_BASE = 'https://api-football-v1.p.rapidapi.com/v3';
const RAPIDAPI_HOST = 'api-football-v1.p.rapidapi.com';

exports.handler = async (event) => {
  const key = process.env.API_FOOTBALL_KEY;
  if (!key) {
    return { statusCode: 500, body: JSON.stringify({ error: 'API key not configured' }) };
  }

  const viaRapidApi = process.env.API_FOOTBALL_VIA_RAPIDAPI === 'true';
  const base    = viaRapidApi ? RAPIDAPI_BASE : DIRECT_BASE;
  const headers = viaRapidApi
    ? { 'x-rapidapi-host': RAPIDAPI_HOST, 'x-rapidapi-key': key }
    : { 'x-apisports-key': key };

  // Strip the /api/ prefix added by the Netlify redirect
  const path  = event.path.replace('/.netlify/functions/scores', '');
  const query = event.queryStringParameters
    ? '?' + new URLSearchParams(event.queryStringParameters).toString()
    : '';

  const url = `${base}${path}${query}`;

  try {
    const res  = await fetch(url, { headers });
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

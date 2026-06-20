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
//
// IMPORTANT: this function always returns statusCode 200 with a JSON body,
// even on failure — the body will contain an `error` field if something
// went wrong. This means failures surface as readable JSON in the browser
// console / Network tab instead of an opaque 502.

const DIRECT_BASE   = 'https://v3.football.api-sports.io';
const RAPIDAPI_BASE = 'https://api-football-v1.p.rapidapi.com/v3';
const RAPIDAPI_HOST = 'api-football-v1.p.rapidapi.com';

function jsonResponse(statusCode, bodyObj) {
  return {
    statusCode,
    headers: {
      'Content-Type':  'application/json',
      'Cache-Control': 'public, max-age=30',
    },
    body: JSON.stringify(bodyObj),
  };
}

exports.handler = async (event) => {
  try {
    const key = process.env.API_FOOTBALL_KEY;
    if (!key) {
      return jsonResponse(200, { error: 'API_FOOTBALL_KEY is not set in Netlify environment variables.' });
    }

    // Confirm fetch exists in this runtime (older Node versions on Netlify
    // Functions don't have it globally — this would otherwise throw an
    // opaque error before we can report anything useful).
    if (typeof fetch !== 'function') {
      return jsonResponse(200, { error: 'fetch is not available in this function runtime. Set NODE_VERSION=20 in netlify.toml / environment variables and redeploy.' });
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

    let upstreamRes;
    try {
      upstreamRes = await fetch(url, { headers });
    } catch (fetchErr) {
      return jsonResponse(200, { error: 'Network error calling API-Football: ' + fetchErr.message, url });
    }

    let data;
    const rawText = await upstreamRes.text();
    try {
      data = JSON.parse(rawText);
    } catch (parseErr) {
      // Upstream didn't return JSON — likely an auth/HTML error page
      return jsonResponse(200, {
        error: 'API-Football returned a non-JSON response (status ' + upstreamRes.status + '). This usually means the API key or auth mode is wrong.',
        upstreamStatus: upstreamRes.status,
        rawPreview: rawText.slice(0, 300),
        url,
      });
    }

    if (!upstreamRes.ok) {
      return jsonResponse(200, {
        error: 'API-Football returned an error.',
        upstreamStatus: upstreamRes.status,
        details: data,
        url,
      });
    }

    // Success — pass through the real API-Football payload
    return jsonResponse(200, data);

  } catch (err) {
    // Last-resort catch so the function NEVER returns a raw 502
    return jsonResponse(200, { error: 'Unhandled function error: ' + err.message });
  }
};

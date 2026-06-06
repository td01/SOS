# Summer of Soccer · 2026

Mobile-first World Cup tracker. Live scores, fixtures, group standings and all-time history.

## Stack

- Vanilla HTML / CSS / JS — no build step, no framework
- Netlify for hosting + serverless functions
- API-Football (RapidAPI) for live data — key stored as a Netlify environment variable

## Project structure

```
summer-of-soccer/
├── index.html          # App shell
├── style.css           # All styles
├── flags.js            # Flat SVG flag renderer
├── data.js             # Static tournament data + mock live data
├── app.js              # UI logic
├── netlify.toml        # Hosting + function config
└── netlify/
    └── functions/
        └── scores.js   # API proxy (protects key)
```

## Local development

No build step needed — just open `index.html` in a browser, or use any static server:

```bash
npx serve .
# or
python3 -m http.server
```

## Deploy to Netlify

1. Push this repo to GitHub
2. Go to [netlify.com](https://netlify.com) → Add new site → Import from Git
3. Set build command to *(blank)*, publish directory to `.`
4. Add environment variable: `API_FOOTBALL_KEY` = your RapidAPI key
5. Deploy

Netlify auto-deploys on every push to `main`.

## Wiring up live data

1. Sign up at [rapidapi.com/api-sports/api/api-football](https://rapidapi.com/api-sports/api/api-football)
2. Add your key as `API_FOOTBALL_KEY` in Netlify environment variables
3. Uncomment the `[[redirects]]` block in `netlify.toml`
4. In `app.js`, replace the `LIVE_MATCHES` / `COMPLETED` / `GROUPS` arrays
   with `fetch('/api/...')` calls — the function handles auth and caching

Free tier gives 100 calls/day — enough for the group stage if you cache responses.

// ─── 2026 FIFA WORLD CUP — REAL DATA ─────────────────────────────────────────
// 48 teams · 12 groups of 4 · Jun 11 – Jul 19, 2026
// Host cities: USA (11), Mexico (3), Canada (2)
// Top 2 from each group + 8 best 3rd-placed → Round of 32

// ─── TEAMS ───────────────────────────────────────────────────────────────────
// r = region: EUR / AME / AFR / ASI / OTH
// g = group A–L

const TEAMS = [
  // Group A
  { n:'Mexico',       c:'MEX', r:'AME', g:'A' },
  { n:'South Africa', c:'RSA', r:'AFR', g:'A' },
  { n:'South Korea',  c:'KOR', r:'ASI', g:'A' },
  { n:'Czechia',      c:'CZE', r:'EUR', g:'A' },
  // Group B
  { n:'Canada',       c:'CAN', r:'AME', g:'B' },
  { n:'Bosnia-Herz.', c:'BIH', r:'EUR', g:'B' },
  { n:'Qatar',        c:'QAT', r:'ASI', g:'B' },
  { n:'Switzerland',  c:'SUI', r:'EUR', g:'B' },
  // Group C
  { n:'Brazil',       c:'BRA', r:'AME', g:'C' },
  { n:'Morocco',      c:'MAR', r:'AFR', g:'C' },
  { n:'Haiti',        c:'HAI', r:'AME', g:'C' },
  { n:'Scotland',     c:'SCO', r:'EUR', g:'C' },
  // Group D
  { n:'USA',          c:'USA', r:'AME', g:'D' },
  { n:'Paraguay',     c:'PAR', r:'AME', g:'D' },
  { n:'Australia',    c:'AUS', r:'ASI', g:'D' },
  { n:'Türkiye',      c:'TUR', r:'EUR', g:'D' },
  // Group E
  { n:'Germany',      c:'GER', r:'EUR', g:'E' },
  { n:'Curaçao',      c:'CUW', r:'AME', g:'E' },
  { n:'Ivory Coast',  c:'CIV', r:'AFR', g:'E' },
  { n:'Ecuador',      c:'ECU', r:'AME', g:'E' },
  // Group F
  { n:'Netherlands',  c:'NED', r:'EUR', g:'F' },
  { n:'Japan',        c:'JPN', r:'ASI', g:'F' },
  { n:'Sweden',       c:'SWE', r:'EUR', g:'F' },
  { n:'Tunisia',      c:'TUN', r:'AFR', g:'F' },
  // Group G
  { n:'England',      c:'ENG', r:'EUR', g:'G' },
  { n:'Panama',       c:'PAN', r:'AME', g:'G' },
  { n:'Croatia',      c:'CRO', r:'EUR', g:'G' },
  { n:'Ghana',        c:'GHA', r:'AFR', g:'G' },
  // Group H
  { n:'Spain',        c:'ESP', r:'EUR', g:'H' },
  { n:'Cape Verde',   c:'CPV', r:'AFR', g:'H' },
  { n:'Saudi Arabia', c:'KSA', r:'ASI', g:'H' },
  { n:'Uruguay',      c:'URU', r:'AME', g:'H' },
  // Group I
  { n:'France',       c:'FRA', r:'EUR', g:'I' },
  { n:'Senegal',      c:'SEN', r:'AFR', g:'I' },
  { n:'Iraq',         c:'IRQ', r:'ASI', g:'I' },
  { n:'Norway',       c:'NOR', r:'EUR', g:'I' },
  // Group J
  { n:'Argentina',    c:'ARG', r:'AME', g:'J' },
  { n:'Algeria',      c:'ALG', r:'AFR', g:'J' },
  { n:'Austria',      c:'AUT', r:'EUR', g:'J' },
  { n:'Jordan',       c:'JOR', r:'ASI', g:'J' },
  // Group K
  { n:'Portugal',     c:'POR', r:'EUR', g:'K' },
  { n:'DR Congo',     c:'COD', r:'AFR', g:'K' },
  { n:'Uzbekistan',   c:'UZB', r:'ASI', g:'K' },
  { n:'Colombia',     c:'COL', r:'AME', g:'K' },
  // Group L
  { n:'Belgium',      c:'BEL', r:'EUR', g:'L' },
  { n:'Egypt',        c:'EGY', r:'AFR', g:'L' },
  { n:'Iran',         c:'IRN', r:'ASI', g:'L' },
  { n:'New Zealand',  c:'NZL', r:'ASI', g:'L' },
];

// ─── FIXTURES — GROUP STAGE ───────────────────────────────────────────────────
// Dates in ET (USA local reference). All times ET.
// Sources: ESPN, Yahoo Sports, CBS Sports confirmed schedule

const FIXTURES = [
  // ── Matchday 1 ──────────────────────────────────────────────────────────────
  // Group A — Jun 11
  { h:'Mexico',      hc:'MEX', a:'South Africa', ac:'RSA', g:'A', date:'Jun 11', t:'15:00 ET' },
  { h:'South Korea', hc:'KOR', a:'Czechia',      ac:'CZE', g:'A', date:'Jun 11', t:'22:00 ET' },
  // Group B — Jun 12
  { h:'Canada',      hc:'CAN', a:'Bosnia-Herz.', ac:'BIH', g:'B', date:'Jun 12', t:'15:00 ET' },
  // Group D — Jun 12
  { h:'USA',         hc:'USA', a:'Paraguay',     ac:'PAR', g:'D', date:'Jun 12', t:'21:00 ET' },
  // Group B — Jun 13
  { h:'Qatar',       hc:'QAT', a:'Switzerland',  ac:'SUI', g:'B', date:'Jun 13', t:'15:00 ET' },
  // Group C — Jun 13
  { h:'Brazil',      hc:'BRA', a:'Morocco',      ac:'MAR', g:'C', date:'Jun 13', t:'18:00 ET' },
  { h:'Haiti',       hc:'HAI', a:'Scotland',     ac:'SCO', g:'C', date:'Jun 13', t:'21:00 ET' },
  // Group D — Jun 14
  { h:'Australia',   hc:'AUS', a:'Türkiye',      ac:'TUR', g:'D', date:'Jun 14', t:'09:00 ET' },
  // Group E — Jun 14
  { h:'Germany',     hc:'GER', a:'Curaçao',      ac:'CUW', g:'E', date:'Jun 14', t:'12:00 ET' },
  // Group F — Jun 14
  { h:'Netherlands', hc:'NED', a:'Japan',        ac:'JPN', g:'F', date:'Jun 14', t:'15:00 ET' },
  { h:'Ivory Coast', hc:'CIV', a:'Ecuador',      ac:'ECU', g:'E', date:'Jun 14', t:'18:00 ET' },
  // Group F — Jun 15
  { h:'Sweden',      hc:'SWE', a:'Tunisia',      ac:'TUN', g:'F', date:'Jun 15', t:'09:00 ET' },
  // Group H — Jun 15
  { h:'Spain',       hc:'ESP', a:'Cape Verde',   ac:'CPV', g:'H', date:'Jun 15', t:'12:00 ET' },
  { h:'Saudi Arabia',hc:'KSA', a:'Uruguay',      ac:'URU', g:'H', date:'Jun 15', t:'18:00 ET' },
  // Group G — Jun 15
  { h:'Belgium',     hc:'BEL', a:'Egypt',        ac:'EGY', g:'L', date:'Jun 15', t:'18:00 ET' },
  // Group I — Jun 16
  { h:'France',      hc:'FRA', a:'Senegal',      ac:'SEN', g:'I', date:'Jun 16', t:'15:00 ET' },
  { h:'Iraq',        hc:'IRQ', a:'Norway',       ac:'NOR', g:'I', date:'Jun 16', t:'18:00 ET' },
  // Group G — Jun 16
  { h:'England',     hc:'ENG', a:'Panama',       ac:'PAN', g:'G', date:'Jun 16', t:'12:00 ET' },
  { h:'Croatia',     hc:'CRO', a:'Ghana',        ac:'GHA', g:'G', date:'Jun 16', t:'21:00 ET' },
  // Group J — Jun 16
  { h:'Argentina',   hc:'ARG', a:'Algeria',      ac:'ALG', g:'J', date:'Jun 16', t:'21:00 ET' },
  { h:'Austria',     hc:'AUT', a:'Jordan',       ac:'JOR', g:'J', date:'Jun 17', t:'00:00 ET' },
  // Group K — Jun 17
  { h:'Portugal',    hc:'POR', a:'DR Congo',     ac:'COD', g:'K', date:'Jun 17', t:'13:00 ET' },
  { h:'Uzbekistan',  hc:'UZB', a:'Colombia',     ac:'COL', g:'K', date:'Jun 17', t:'22:00 ET' },
  // Group L — Jun 17–18
  { h:'Iran',        hc:'IRN', a:'New Zealand',  ac:'NZL', g:'L', date:'Jun 18', t:'00:00 ET' },
];

// ─── LIVE & COMPLETED ─────────────────────────────────────────────────────────
// Empty until Jun 11 — replaced by API calls in production.
// Shape: { h, hc, a, ac, hs, as, min, g } for live
//        { h, hc, a, ac, hs, as, g }       for completed

const LIVE_MATCHES = [];
const COMPLETED = [];

// ─── GROUP STANDINGS ──────────────────────────────────────────────────────────
// All zeroed — updated by API in production, or updated manually after matches.

const GROUPS = {
  A: [
    { n:'Mexico',       c:'MEX', p:0, w:0, d:0, l:0, gf:0, ga:0, pts:0 },
    { n:'South Africa', c:'RSA', p:0, w:0, d:0, l:0, gf:0, ga:0, pts:0 },
    { n:'South Korea',  c:'KOR', p:0, w:0, d:0, l:0, gf:0, ga:0, pts:0 },
    { n:'Czechia',      c:'CZE', p:0, w:0, d:0, l:0, gf:0, ga:0, pts:0 },
  ],
  B: [
    { n:'Canada',       c:'CAN', p:0, w:0, d:0, l:0, gf:0, ga:0, pts:0 },
    { n:'Bosnia-Herz.', c:'BIH', p:0, w:0, d:0, l:0, gf:0, ga:0, pts:0 },
    { n:'Qatar',        c:'QAT', p:0, w:0, d:0, l:0, gf:0, ga:0, pts:0 },
    { n:'Switzerland',  c:'SUI', p:0, w:0, d:0, l:0, gf:0, ga:0, pts:0 },
  ],
  C: [
    { n:'Brazil',       c:'BRA', p:0, w:0, d:0, l:0, gf:0, ga:0, pts:0 },
    { n:'Morocco',      c:'MAR', p:0, w:0, d:0, l:0, gf:0, ga:0, pts:0 },
    { n:'Haiti',        c:'HAI', p:0, w:0, d:0, l:0, gf:0, ga:0, pts:0 },
    { n:'Scotland',     c:'SCO', p:0, w:0, d:0, l:0, gf:0, ga:0, pts:0 },
  ],
  D: [
    { n:'USA',          c:'USA', p:0, w:0, d:0, l:0, gf:0, ga:0, pts:0 },
    { n:'Paraguay',     c:'PAR', p:0, w:0, d:0, l:0, gf:0, ga:0, pts:0 },
    { n:'Australia',    c:'AUS', p:0, w:0, d:0, l:0, gf:0, ga:0, pts:0 },
    { n:'Türkiye',      c:'TUR', p:0, w:0, d:0, l:0, gf:0, ga:0, pts:0 },
  ],
  E: [
    { n:'Germany',      c:'GER', p:0, w:0, d:0, l:0, gf:0, ga:0, pts:0 },
    { n:'Curaçao',      c:'CUW', p:0, w:0, d:0, l:0, gf:0, ga:0, pts:0 },
    { n:'Ivory Coast',  c:'CIV', p:0, w:0, d:0, l:0, gf:0, ga:0, pts:0 },
    { n:'Ecuador',      c:'ECU', p:0, w:0, d:0, l:0, gf:0, ga:0, pts:0 },
  ],
  F: [
    { n:'Netherlands',  c:'NED', p:0, w:0, d:0, l:0, gf:0, ga:0, pts:0 },
    { n:'Japan',        c:'JPN', p:0, w:0, d:0, l:0, gf:0, ga:0, pts:0 },
    { n:'Sweden',       c:'SWE', p:0, w:0, d:0, l:0, gf:0, ga:0, pts:0 },
    { n:'Tunisia',      c:'TUN', p:0, w:0, d:0, l:0, gf:0, ga:0, pts:0 },
  ],
  G: [
    { n:'England',      c:'ENG', p:0, w:0, d:0, l:0, gf:0, ga:0, pts:0 },
    { n:'Panama',       c:'PAN', p:0, w:0, d:0, l:0, gf:0, ga:0, pts:0 },
    { n:'Croatia',      c:'CRO', p:0, w:0, d:0, l:0, gf:0, ga:0, pts:0 },
    { n:'Ghana',        c:'GHA', p:0, w:0, d:0, l:0, gf:0, ga:0, pts:0 },
  ],
  H: [
    { n:'Spain',        c:'ESP', p:0, w:0, d:0, l:0, gf:0, ga:0, pts:0 },
    { n:'Cape Verde',   c:'CPV', p:0, w:0, d:0, l:0, gf:0, ga:0, pts:0 },
    { n:'Saudi Arabia', c:'KSA', p:0, w:0, d:0, l:0, gf:0, ga:0, pts:0 },
    { n:'Uruguay',      c:'URU', p:0, w:0, d:0, l:0, gf:0, ga:0, pts:0 },
  ],
  I: [
    { n:'France',       c:'FRA', p:0, w:0, d:0, l:0, gf:0, ga:0, pts:0 },
    { n:'Senegal',      c:'SEN', p:0, w:0, d:0, l:0, gf:0, ga:0, pts:0 },
    { n:'Iraq',         c:'IRQ', p:0, w:0, d:0, l:0, gf:0, ga:0, pts:0 },
    { n:'Norway',       c:'NOR', p:0, w:0, d:0, l:0, gf:0, ga:0, pts:0 },
  ],
  J: [
    { n:'Argentina',    c:'ARG', p:0, w:0, d:0, l:0, gf:0, ga:0, pts:0 },
    { n:'Algeria',      c:'ALG', p:0, w:0, d:0, l:0, gf:0, ga:0, pts:0 },
    { n:'Austria',      c:'AUT', p:0, w:0, d:0, l:0, gf:0, ga:0, pts:0 },
    { n:'Jordan',       c:'JOR', p:0, w:0, d:0, l:0, gf:0, ga:0, pts:0 },
  ],
  K: [
    { n:'Portugal',     c:'POR', p:0, w:0, d:0, l:0, gf:0, ga:0, pts:0 },
    { n:'DR Congo',     c:'COD', p:0, w:0, d:0, l:0, gf:0, ga:0, pts:0 },
    { n:'Uzbekistan',   c:'UZB', p:0, w:0, d:0, l:0, gf:0, ga:0, pts:0 },
    { n:'Colombia',     c:'COL', p:0, w:0, d:0, l:0, gf:0, ga:0, pts:0 },
  ],
  L: [
    { n:'Belgium',      c:'BEL', p:0, w:0, d:0, l:0, gf:0, ga:0, pts:0 },
    { n:'Egypt',        c:'EGY', p:0, w:0, d:0, l:0, gf:0, ga:0, pts:0 },
    { n:'Iran',         c:'IRN', p:0, w:0, d:0, l:0, gf:0, ga:0, pts:0 },
    { n:'New Zealand',  c:'NZL', p:0, w:0, d:0, l:0, gf:0, ga:0, pts:0 },
  ],
};

// ─── ALL-TIME HISTORY ─────────────────────────────────────────────────────────

const ALL_TIME_SCORERS = [
  { n:'Miroslav Klose',  c:'GER', goals:16, yrs:'2002–2014' },
  { n:'Ronaldo',         c:'BRA', goals:15, yrs:'1994–2006' },
  { n:'Gerd Müller',     c:'GER', goals:14, yrs:'1970–74'   },
  { n:'Just Fontaine',   c:'FRA', goals:13, yrs:'1958'      },
  { n:'Lionel Messi',    c:'ARG', goals:13, yrs:'2006–2022'  },
  { n:'Pelé',            c:'BRA', goals:12, yrs:'1958–70'   },
  { n:'Sandor Kocsis',   c:'HUN', goals:11, yrs:'1954'      },
];

const GOLDEN_SHOE = [
  { yr:2022, n:"Kylian Mbappé",    c:'FRA', goals:8 },
  { yr:2018, n:"Harry Kane",       c:'ENG', goals:6 },
  { yr:2014, n:"James Rodríguez",  c:'COL', goals:6 },
  { yr:2010, n:"Thomas Müller",    c:'GER', goals:5 },
  { yr:2006, n:"Miroslav Klose",   c:'GER', goals:5 },
  { yr:2002, n:"Ronaldo",          c:'BRA', goals:8 },
  { yr:1998, n:"Davor Šuker",      c:'CRO', goals:6 },
];

const TOURNAMENT_WINNERS = [
  { n:'Brazil',    c:'BRA', t:5, yrs:'1958 · 62 · 70 · 94 · 2002' },
  { n:'Germany',   c:'GER', t:4, yrs:'1954 · 74 · 90 · 2014'      },
  { n:'Italy',     c:'ITA', t:4, yrs:'1934 · 38 · 82 · 2006'      },
  { n:'Argentina', c:'ARG', t:3, yrs:'1978 · 86 · 2022'           },
  { n:'France',    c:'FRA', t:2, yrs:'1998 · 2018'                },
  { n:'Spain',     c:'ESP', t:1, yrs:'2010'                       },
];

const RECORDS = [
  { t:'Fastest goal',      v:'11s',  d:'Hakan Şükür, Turkey 2002'   },
  { t:'Biggest win',       v:'10–1', d:'Hungary vs El Salvador 1982' },
  { t:'Oldest scorer',     v:'42',   d:'Roger Milla, Cameroon 1994'  },
  { t:'Most clean sheets', v:'10',   d:'Peter Shilton, England'      },
];

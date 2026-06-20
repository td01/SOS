// ─── 2026 FIFA WORLD CUP — REAL DATA ─────────────────────────────────────────
// 48 teams · 12 groups of 4 · Jun 11 – Jul 19, 2026
// Host cities: USA (11), Mexico (3), Canada (2)
// Top 2 from each group + 8 best 3rd-placed → Round of 32

// ─── TEAMS ───────────────────────────────────────────────────────────────────
// r = region: EUR / AME / AFR / ASI / OTH
// g = group A–L

var TEAMS = [
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

// FIXTURES removed — schedule is now fetched live from the API (see fetchFixtures() in app.js)

// ─── LIVE & COMPLETED ─────────────────────────────────────────────────────────
// Populated entirely from the live API at runtime (see fetchLiveData() in app.js).
// Empty by default — no mock/placeholder matches.
// Shape: { h, hc, a, ac, hs, as, min, g } for live
//        { h, hc, a, ac, hs, as, g }       for completed

var LIVE_MATCHES = [];
var COMPLETED = [];

// ─── GROUP STANDINGS ──────────────────────────────────────────────────────────
// All zeroed — updated by API in production, or updated manually after matches.

// GROUPS removed — standings are now fetched live from the API (see fetchStandings() in app.js)

// ─── ALL-TIME HISTORY ─────────────────────────────────────────────────────────

var ALL_TIME_SCORERS = [
  { n:'Miroslav Klose',  c:'GER', goals:16, yrs:'2002–2014' },
  { n:'Ronaldo',         c:'BRA', goals:15, yrs:'1994–2006' },
  { n:'Gerd Müller',     c:'GER', goals:14, yrs:'1970–74'   },
  { n:'Just Fontaine',   c:'FRA', goals:13, yrs:'1958'      },
  { n:'Lionel Messi',    c:'ARG', goals:13, yrs:'2006–2022'  },
  { n:'Pelé',            c:'BRA', goals:12, yrs:'1958–70'   },
  { n:'Sandor Kocsis',   c:'HUN', goals:11, yrs:'1954'      },
];

var GOLDEN_SHOE = [
  { yr:2022, n:"Kylian Mbappé",    c:'FRA', goals:8 },
  { yr:2018, n:"Harry Kane",       c:'ENG', goals:6 },
  { yr:2014, n:"James Rodríguez",  c:'COL', goals:6 },
  { yr:2010, n:"Thomas Müller",    c:'GER', goals:5 },
  { yr:2006, n:"Miroslav Klose",   c:'GER', goals:5 },
  { yr:2002, n:"Ronaldo",          c:'BRA', goals:8 },
  { yr:1998, n:"Davor Šuker",      c:'CRO', goals:6 },
];

var TOURNAMENT_WINNERS = [
  { n:'Brazil',    c:'BRA', t:5, yrs:'1958 · 62 · 70 · 94 · 2002' },
  { n:'Germany',   c:'GER', t:4, yrs:'1954 · 74 · 90 · 2014'      },
  { n:'Italy',     c:'ITA', t:4, yrs:'1934 · 38 · 82 · 2006'      },
  { n:'Argentina', c:'ARG', t:3, yrs:'1978 · 86 · 2022'           },
  { n:'France',    c:'FRA', t:2, yrs:'1998 · 2018'                },
  { n:'Spain',     c:'ESP', t:1, yrs:'2010'                       },
];

var RECORDS = [
  { t:'Fastest goal',      v:'11s',  d:'Hakan Şükür, Turkey 2002'   },
  { t:'Biggest win',       v:'10–1', d:'Hungary vs El Salvador 1982' },
  { t:'Oldest scorer',     v:'42',   d:'Roger Milla, Cameroon 1994'  },
  { t:'Most clean sheets', v:'10',   d:'Peter Shilton, England'      },
];

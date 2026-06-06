// ─── TEAMS ────────────────────────────────────────────────────────────────────
// Regions: EUR / AME / AFR / ASI
// Groups will be confirmed once draw is finalised — placeholders used here

const TEAMS = [
  { n:'Argentina',    c:'ARG', r:'AME', g:'C' },
  { n:'Brazil',       c:'BRA', r:'AME', g:'D' },
  { n:'England',      c:'ENG', r:'EUR', g:'E' },
  { n:'France',       c:'FRA', r:'EUR', g:'A' },
  { n:'Germany',      c:'GER', r:'EUR', g:'B' },
  { n:'Spain',        c:'ESP', r:'EUR', g:'F' },
  { n:'Portugal',     c:'POR', r:'EUR', g:'G' },
  { n:'Netherlands',  c:'NED', r:'EUR', g:'H' },
  { n:'Morocco',      c:'MAR', r:'AFR', g:'A' },
  { n:'Japan',        c:'JPN', r:'ASI', g:'B' },
  { n:'USA',          c:'USA', r:'AME', g:'C' },
  { n:'Mexico',       c:'MEX', r:'AME', g:'D' },
  { n:'Canada',       c:'CAN', r:'AME', g:'E' },
  { n:'Australia',    c:'AUS', r:'ASI', g:'F' },
  { n:'S. Korea',     c:'KOR', r:'ASI', g:'G' },
  { n:'Senegal',      c:'SEN', r:'AFR', g:'H' },
  { n:'Nigeria',      c:'NGA', r:'AFR', g:'A' },
  { n:'Colombia',     c:'COL', r:'AME', g:'B' },
  { n:'Uruguay',      c:'URU', r:'AME', g:'C' },
  { n:'Belgium',      c:'BEL', r:'EUR', g:'D' },
  { n:'Croatia',      c:'CRO', r:'EUR', g:'E' },
  { n:'Serbia',       c:'SRB', r:'EUR', g:'F' },
  { n:'Switzerland',  c:'SUI', r:'EUR', g:'G' },
  { n:'Ecuador',      c:'ECU', r:'AME', g:'H' },
  { n:'Poland',       c:'POL', r:'EUR', g:'A' },
  { n:'Denmark',      c:'DEN', r:'EUR', g:'B' },
  { n:'Qatar',        c:'QAT', r:'ASI', g:'C' },
  { n:'Saudi Arabia', c:'KSA', r:'ASI', g:'D' },
  { n:'Iran',         c:'IRN', r:'ASI', g:'E' },
  { n:'Ghana',        c:'GHA', r:'AFR', g:'F' },
  { n:'Tunisia',      c:'TUN', r:'AFR', g:'G' },
  { n:'Cameroon',     c:'CMR', r:'AFR', g:'H' },
];

// ─── FIXTURES ─────────────────────────────────────────────────────────────────

const FIXTURES = [
  { h:'France',       hc:'FRA', a:'Morocco',      ac:'MAR', g:'A', date:'Jun 12', t:'15:00' },
  { h:'Nigeria',      hc:'NGA', a:'Poland',       ac:'POL', g:'A', date:'Jun 12', t:'18:00' },
  { h:'Germany',      hc:'GER', a:'Denmark',      ac:'DEN', g:'B', date:'Jun 13', t:'15:00' },
  { h:'Colombia',     hc:'COL', a:'Japan',        ac:'JPN', g:'B', date:'Jun 13', t:'18:00' },
  { h:'Argentina',    hc:'ARG', a:'USA',          ac:'USA', g:'C', date:'Jun 14', t:'15:00' },
  { h:'Uruguay',      hc:'URU', a:'Qatar',        ac:'QAT', g:'C', date:'Jun 14', t:'18:00' },
  { h:'Brazil',       hc:'BRA', a:'Mexico',       ac:'MEX', g:'D', date:'Jun 15', t:'15:00' },
  { h:'Belgium',      hc:'BEL', a:'Saudi Arabia', ac:'KSA', g:'D', date:'Jun 15', t:'18:00' },
  { h:'England',      hc:'ENG', a:'Canada',       ac:'CAN', g:'E', date:'Jun 16', t:'15:00' },
  { h:'Croatia',      hc:'CRO', a:'Iran',         ac:'IRN', g:'E', date:'Jun 16', t:'18:00' },
  { h:'Spain',        hc:'ESP', a:'Australia',    ac:'AUS', g:'F', date:'Jun 17', t:'15:00' },
  { h:'Serbia',       hc:'SRB', a:'Ghana',        ac:'GHA', g:'F', date:'Jun 17', t:'18:00' },
  { h:'Portugal',     hc:'POR', a:'S. Korea',     ac:'KOR', g:'G', date:'Jun 18', t:'15:00' },
  { h:'Switzerland',  hc:'SUI', a:'Tunisia',      ac:'TUN', g:'G', date:'Jun 18', t:'18:00' },
  { h:'Netherlands',  hc:'NED', a:'Senegal',      ac:'SEN', g:'H', date:'Jun 19', t:'15:00' },
  { h:'Ecuador',      hc:'ECU', a:'Cameroon',     ac:'CMR', g:'H', date:'Jun 19', t:'18:00' },
];

// ─── LIVE & COMPLETED (replaced by API in production) ─────────────────────────

const LIVE_MATCHES = [
  { h:'Argentina', hc:'ARG', a:'USA',    ac:'USA', hs:2, as:1, min:67, g:'C' },
  { h:'Brazil',    hc:'BRA', a:'Mexico', ac:'MEX', hs:1, as:1, min:44, g:'D' },
];

const COMPLETED = [
  { h:'France',  hc:'FRA', a:'Morocco', ac:'MAR', hs:2, as:0, g:'A' },
  { h:'Germany', hc:'GER', a:'Japan',   ac:'JPN', hs:1, as:2, g:'B' },
  { h:'England', hc:'ENG', a:'Iran',    ac:'IRN', hs:6, as:2, g:'E' },
];

// ─── GROUP STANDINGS ──────────────────────────────────────────────────────────

const GROUPS = {
  A: [
    { n:'France',  c:'FRA', p:1, w:1, d:0, l:0, gf:2, ga:0, pts:3 },
    { n:'Nigeria', c:'NGA', p:0, w:0, d:0, l:0, gf:0, ga:0, pts:0 },
    { n:'Morocco', c:'MAR', p:1, w:0, d:0, l:1, gf:0, ga:2, pts:0 },
    { n:'Poland',  c:'POL', p:0, w:0, d:0, l:0, gf:0, ga:0, pts:0 },
  ],
  B: [
    { n:'Japan',    c:'JPN', p:1, w:1, d:0, l:0, gf:2, ga:1, pts:3 },
    { n:'Colombia', c:'COL', p:0, w:0, d:0, l:0, gf:0, ga:0, pts:0 },
    { n:'Germany',  c:'GER', p:1, w:0, d:0, l:1, gf:1, ga:2, pts:0 },
    { n:'Denmark',  c:'DEN', p:0, w:0, d:0, l:0, gf:0, ga:0, pts:0 },
  ],
  C: [
    { n:'Argentina', c:'ARG', p:1, w:1, d:0, l:0, gf:2, ga:1, pts:3 },
    { n:'USA',       c:'USA', p:1, w:0, d:0, l:1, gf:1, ga:2, pts:0 },
    { n:'Uruguay',   c:'URU', p:0, w:0, d:0, l:0, gf:0, ga:0, pts:0 },
    { n:'Qatar',     c:'QAT', p:0, w:0, d:0, l:0, gf:0, ga:0, pts:0 },
  ],
  D: [
    { n:'Brazil',       c:'BRA', p:1, w:0, d:1, l:0, gf:1, ga:1, pts:1 },
    { n:'Mexico',       c:'MEX', p:1, w:0, d:1, l:0, gf:1, ga:1, pts:1 },
    { n:'Belgium',      c:'BEL', p:0, w:0, d:0, l:0, gf:0, ga:0, pts:0 },
    { n:'Saudi Arabia', c:'KSA', p:0, w:0, d:0, l:0, gf:0, ga:0, pts:0 },
  ],
  E: [
    { n:'England', c:'ENG', p:1, w:1, d:0, l:0, gf:6, ga:2, pts:3 },
    { n:'Canada',  c:'CAN', p:0, w:0, d:0, l:0, gf:0, ga:0, pts:0 },
    { n:'Croatia', c:'CRO', p:0, w:0, d:0, l:0, gf:0, ga:0, pts:0 },
    { n:'Iran',    c:'IRN', p:1, w:0, d:0, l:1, gf:2, ga:6, pts:0 },
  ],
  F: [
    { n:'Spain',     c:'ESP', p:0, w:0, d:0, l:0, gf:0, ga:0, pts:0 },
    { n:'Australia', c:'AUS', p:0, w:0, d:0, l:0, gf:0, ga:0, pts:0 },
    { n:'Serbia',    c:'SRB', p:0, w:0, d:0, l:0, gf:0, ga:0, pts:0 },
    { n:'Ghana',     c:'GHA', p:0, w:0, d:0, l:0, gf:0, ga:0, pts:0 },
  ],
  G: [
    { n:'Portugal',    c:'POR', p:0, w:0, d:0, l:0, gf:0, ga:0, pts:0 },
    { n:'S. Korea',    c:'KOR', p:0, w:0, d:0, l:0, gf:0, ga:0, pts:0 },
    { n:'Switzerland', c:'SUI', p:0, w:0, d:0, l:0, gf:0, ga:0, pts:0 },
    { n:'Tunisia',     c:'TUN', p:0, w:0, d:0, l:0, gf:0, ga:0, pts:0 },
  ],
  H: [
    { n:'Netherlands', c:'NED', p:0, w:0, d:0, l:0, gf:0, ga:0, pts:0 },
    { n:'Senegal',     c:'SEN', p:0, w:0, d:0, l:0, gf:0, ga:0, pts:0 },
    { n:'Ecuador',     c:'ECU', p:0, w:0, d:0, l:0, gf:0, ga:0, pts:0 },
    { n:'Cameroon',    c:'CMR', p:0, w:0, d:0, l:0, gf:0, ga:0, pts:0 },
  ],
};

// ─── ALL-TIME HISTORY ─────────────────────────────────────────────────────────

const ALL_TIME_SCORERS = [
  { n:'Miroslav Klose',  c:'GER', goals:16, yrs:'2002–2014' },
  { n:'Ronaldo',         c:'BRA', goals:15, yrs:'1994–2006' },
  { n:'Gerd Müller',     c:'GER', goals:14, yrs:'1970–74'   },
  { n:'Just Fontaine',   c:'FRA', goals:13, yrs:'1958'      },
  { n:'Pelé',            c:'BRA', goals:12, yrs:'1958–70'   },
  { n:'Sandor Kocsis',   c:'URU', goals:11, yrs:'1954'      },
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
  { n:'Italy',     c:'CRO', t:4, yrs:'1934 · 38 · 82 · 2006'      },
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

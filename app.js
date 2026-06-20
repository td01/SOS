// ─── STATE ────────────────────────────────────────────────────────────────────

var chosen  = [];
var curRgn  = 'ALL';
var pollTimer = null;

// ─── PICK SCREEN ──────────────────────────────────────────────────────────────

function renderPick(region) {
  var list = region === 'ALL' ? TEAMS : TEAMS.filter(function(t){ return t.r === region; });
  document.getElementById('ctry-list').innerHTML = list.map(function(t){
    return '<div class="ctry-tile' + (chosen.includes(t.c) ? ' on' : '') + '" onclick="toggleTeam(\'' + t.c + '\')">' +
      ff(t.c, 56, 39) +
      '<div class="ctry-n">' + t.n + '</div>' +
      '</div>';
  }).join('');
  var n = chosen.length;
  document.getElementById('pick-cnt').textContent =
    n === 0 ? 'None selected' : n === 1 ? '1 team' : n + ' teams';
  document.getElementById('go-btn').disabled = n === 0;
}

function toggleTeam(code) {
  var i = chosen.indexOf(code);
  if (i > -1) chosen.splice(i, 1); else chosen.push(code);
  renderPick(curRgn);
}

function rgn(r, btn) {
  curRgn = r;
  document.querySelectorAll('.rbtn').forEach(function(b){ b.classList.remove('on'); });
  btn.classList.add('on');
  renderPick(r);
}

// Countdown to first match (Jun 11 2026 19:00 UTC)
function startCountdown() {
  var target = new Date('2026-06-11T19:00:00Z').getTime();
  function tick() {
    var now  = Date.now();
    var diff = target - now;
    var el    = document.getElementById('pick-countdown');
    var lblEl = document.getElementById('pick-countdown-lbl');
    if (!el) return;
    if (diff <= 0) {
      el.textContent = 'LIVE';
      if (lblEl) lblEl.textContent = 'Tournament underway';
      return;
    }
    var d = Math.floor(diff / 86400000);
    var h = Math.floor((diff % 86400000) / 3600000);
    var m = Math.floor((diff % 3600000) / 60000);
    el.textContent = d + 'd ' + h + 'h ' + m + 'm';
  }
  tick();
  setInterval(tick, 30000);
}

// ─── NAV ──────────────────────────────────────────────────────────────────────

function launch() {
  document.getElementById('s-pick').style.display = 'none';
  document.getElementById('s-app').style.display  = 'block';

  var myTeams = TEAMS.filter(function(t){ return chosen.includes(t.c); });
  document.getElementById('pill-bar').innerHTML = myTeams.map(function(t){
    return '<div class="team-pill" onclick="openTeam(\'' + t.c + '\')">' +
      ff(t.c, 28, 20) +
      '<span class="team-pill-n">' + t.n + '</span>' +
      '</div>';
  }).join('');

  buildTicker();
  buildLive();
  buildSchedule();
  buildGroups();
  startLivePoll();
}

function back() {
  stopLivePoll();
  document.getElementById('s-app').style.display  = 'none';
  document.getElementById('s-pick').style.display = 'block';
}

function tab(id, btn) {
  document.querySelectorAll('.pane').forEach(function(p){ p.classList.remove('on'); });
  document.getElementById('p-' + id).classList.add('on');
  document.querySelectorAll('.bnav-btn').forEach(function(b){ b.classList.remove('on'); });
  btn.classList.add('on');
  if (id === 'dyk')   buildDyk();
  if (id === 'live')  buildLive();
  if (id === 'stats') buildStats();
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function myTeamNames() {
  return TEAMS.filter(function(t){ return chosen.includes(t.c); }).map(function(t){ return t.n; });
}
function isMine(m) {
  var mn = myTeamNames();
  return mn.includes(m.h) || mn.includes(m.a);
}

function sec(label) {
  return '<div class="sec span-all">' + label + '</div>';
}

// ─── SCORE TICKER ─────────────────────────────────────────────────────────────

function buildTicker() {
  var ticker = document.getElementById('score-ticker');
  if (!ticker) return;

  var demoTag = apiAvailable === false ? '<span class="ticker-demo-tag">NOT CONNECTED</span>' : '';

  if (LIVE_MATCHES.length === 0) {
    ticker.className = 'score-ticker no-live';
    ticker.innerHTML = demoTag + '<div class="ticker-no-live">No live matches right now</div>';
    return;
  }

  ticker.className = 'score-ticker';
  // Duplicate items for seamless loop
  var items = [...LIVE_MATCHES, ...LIVE_MATCHES].map(function(m){
    return '<div class="ticker-item">' +
      ff(m.hc, 20, 14) + ' ' +
      '<span class="ticker-score">' + m.h + ' ' + m.hs + '–' + m.as + ' ' + m.a + '</span>' +
      ' ' + ff(m.ac, 20, 14) +
      ' <span class="ticker-min">' + m.min + '\'</span>' +
      '</div>';
  }).join('');

  ticker.innerHTML = demoTag + '<div class="ticker-inner">' + items + '</div>';
}

// ─── LIVE POLLING ─────────────────────────────────────────────────────────────

function startLivePoll() {
  fetchLiveData();
  pollTimer = setInterval(fetchLiveData, 60000);
}
function stopLivePoll() {
  if (pollTimer) { clearInterval(pollTimer); pollTimer = null; }
}
// League/season for API-Football — Summer of Soccer tournament, 2026
var API_LEAGUE = 1;
var API_SEASON = 2026;
var apiAvailable = null; // null = unknown, true/false once tested

// ════════════════════════════════════════════════════════════════════════════
// IMPORTANT — set this to true once API_FOOTBALL_KEY is configured in
// Netlify (Site settings → Environment variables) and the site has been
// redeployed. All match data, standings, and stats are fetched live from
// the API — there is no mock/placeholder data anywhere in this app.
// Until this is true, screens will show an honest "not connected" state.
// ════════════════════════════════════════════════════════════════════════════
var LIVE_API_ENABLED = true;

async function fetchLiveData() {
  if (!LIVE_API_ENABLED) {
    apiAvailable = false;
    buildLive();
    buildTicker();
    return;
  }

  try {
    var [liveRes, todayRes] = await Promise.all([
      fetch('/api/fixtures?live=all'),
      fetch('/api/fixtures?date=' + new Date().toISOString().slice(0,10) + '&league=' + API_LEAGUE + '&season=' + API_SEASON)
    ]);

    if (!liveRes.ok || !todayRes.ok) throw new Error('API not configured');

    var liveData  = await liveRes.json();
    var todayData = await todayRes.json();
    if (liveData.error || todayData.error) {
      console.error('Summer of Soccer — live data error:', liveData.error || todayData.error, liveData, todayData);
      throw new Error(liveData.error || todayData.error);
    }

    // Sanity check: API-Football returns an array under .response —
    // if it's missing or not an array, treat as a failed/misconfigured call
    // and do NOT touch the existing mock data.
    if (!Array.isArray(liveData.response) || !Array.isArray(todayData.response)) {
      throw new Error('Unexpected API response shape');
    }

    apiAvailable = true;

    // Rebuild LIVE_MATCHES from API response
    var newLive = liveData.response.map(function(f) {
      return {
        h: f.teams.home.name, hc: teamCodeFromApi(f.teams.home),
        a: f.teams.away.name, ac: teamCodeFromApi(f.teams.away),
        hs: f.goals.home ?? 0, as: f.goals.away ?? 0,
        min: f.fixture.status.elapsed ?? 0,
        g: f.league.round ? f.league.round.replace('Group ','') : '',
        events: (f.events || []).map(function(e) {
          return {
            min: e.time.elapsed,
            team: teamCodeFromApi(e.team),
            text: (e.type === 'Goal' ? 'GOAL — ' : 'RED CARD — ') + e.player.name + (e.detail && e.detail.includes('Penalty') ? ' (pen)' : '')
          };
        })
      };
    });

    var newCompleted = todayData.response
      .filter(function(f){ return f.fixture.status.short === 'FT'; })
      .map(function(f) {
        return {
          h: f.teams.home.name, hc: teamCodeFromApi(f.teams.home),
          a: f.teams.away.name, ac: teamCodeFromApi(f.teams.away),
          hs: f.goals.home, as: f.goals.away,
          g: f.league.round ? f.league.round.replace('Group ','') : ''
        };
      });

    // Only swap in the new data once both calls have fully succeeded —
    // never leave the arrays empty mid-fetch.
    LIVE_MATCHES.length = 0;
    LIVE_MATCHES.push.apply(LIVE_MATCHES, newLive);
    COMPLETED.length = 0;
    COMPLETED.push.apply(COMPLETED, newCompleted);

  } catch (e) {
    // API not configured yet, or request failed — keep existing mock/demo
    // data exactly as it is, just flag that we're showing demo content.
    apiAvailable = false;
  }

  buildLive();
  buildTicker();
}

// Map API-Football team object to our 3-letter team codes via TEAMS lookup
function teamCodeFromApi(apiTeam) {
  var match = TEAMS.find(function(t) {
    return t.n.toLowerCase() === apiTeam.name.toLowerCase();
  });
  return match ? match.c : apiTeam.code || apiTeam.name.slice(0,3).toUpperCase();
}

// ─── LIVE TAB ─────────────────────────────────────────────────────────────────

function matchCard(m, live) {
  var mine  = isMine(m);
  var cls   = live ? (mine ? 'live-mine' : 'live') : (mine ? 'done-mine' : 'done');
  var badge = live
    ? '<span class="mc-live-dot"></span> ' + m.min + '\' LIVE'
    : 'Full time';

  var eventsHtml = '';
  if (live && m.events && m.events.length) {
    eventsHtml = '<div class="mc-events">' +
      m.events.map(function(e){
        var isHome = e.team === m.hc;
        var icon   = e.text.includes('RED') ? '🟥' : '⚽';
        var name   = e.text.replace(/^(GOAL — |RED CARD — )/, '');
        return '<div class="mc-event ' + (isHome ? 'ev-home' : 'ev-away') + '">' +
          '<span class="ev-min">' + e.min + '\'</span>' +
          '<span>' + icon + '</span>' +
          '<span class="ev-text">' + name + '</span>' +
          '</div>';
      }).join('') +
      '</div>';
  }

  return '<div class="match-card ' + cls + '">' +
    '<div class="mc-badge">' + badge + '</div>' +
    '<div class="mc-teams">' +
      '<div class="mc-t" onclick="openTeam(\'' + m.hc + '\')" style="cursor:pointer">' +
        ff(m.hc, 48, 33) +
        '<div class="mc-tn">' + m.h + '</div>' +
      '</div>' +
      '<div class="mc-center">' +
        '<div class="mc-score">' + m.hs + '–' + m.as + '</div>' +
        '<div class="mc-min">' + (live ? 'LIVE' : 'FT') + '</div>' +
      '</div>' +
      '<div class="mc-t r" onclick="openTeam(\'' + m.ac + '\')" style="cursor:pointer">' +
        ff(m.ac, 48, 33) +
        '<div class="mc-tn">' + m.a + '</div>' +
      '</div>' +
    '</div>' +
    eventsHtml +
    '</div>';
}

function buildLive() {
  var myCount   = [...LIVE_MATCHES, ...COMPLETED].filter(isMine).length;
  var totalGoals = [...LIVE_MATCHES, ...COMPLETED].reduce(function(s, m){ return s + m.hs + m.as; }, 0);

  document.getElementById('stat-row').innerHTML =
    '<div class="stat-cell"><div class="stat-v hot">' + LIVE_MATCHES.length + '</div><div class="stat-l">Live now</div></div>' +
    '<div class="stat-cell"><div class="stat-v">' + (LIVE_MATCHES.length + COMPLETED.length) + '</div><div class="stat-l">Today</div></div>' +
    '<div class="stat-cell"><div class="stat-v hot">' + myCount + '</div><div class="stat-l">Your games</div></div>' +
    '<div class="stat-cell"><div class="stat-v">' + (totalGoals || '—') + '</div><div class="stat-l">Goals today</div></div>';

  // Live matches — selected teams float to top
  var liveSorted = LIVE_MATCHES.slice().sort(function(a,b){
    return (isMine(b) ? 1 : 0) - (isMine(a) ? 1 : 0);
  });
  document.getElementById('live-wrap').innerHTML = liveSorted.length
    ? liveSorted.map(function(m){ return matchCard(m, true); }).join('')
    : buildEmptyState();

  // Completed
  document.getElementById('done-wrap').innerHTML = COMPLETED.length
    ? COMPLETED.map(function(m){ return matchCard(m, false); }).join('')
    : '<div class="empty-state"><div class="empty-state-title">No results yet</div><div class="empty-state-body">Today\'s first results will appear here.</div></div>';
}

function buildEmptyState() {
  var tournamentStarted = Date.now() > new Date('2026-06-11T19:00:00Z').getTime();

  if (tournamentStarted) {
    // Tournament is live — just no matches kicking off this exact moment
    return '<div class="empty-state">' +
      '<div class="empty-state-title">No live games right now</div>' +
      '<div class="empty-state-body">Check today&#39;s results below, or see the schedule for upcoming fixtures.</div>' +
      '</div>';
  }

  // Pre-tournament — show countdown to opener
  var next = FIXTURES[0];
  var countdown = getCountdown(new Date('2026-06-11T19:00:00Z'));
  return '<div class="empty-state">' +
    '<div class="empty-state-title">No live games</div>' +
    '<div class="empty-state-body">The tournament kicks off Jun 11 in Mexico City.</div>' +
    '<div class="empty-state-next">' +
      '<div>' +
        '<div class="empty-state-next-label">Opening match</div>' +
        '<div class="empty-state-next-match">' + next.h + ' vs ' + next.a + '</div>' +
        '<div class="empty-state-next-time">' + next.date + ' · ' + next.t + '</div>' +
      '</div>' +
      '<div>' +
        '<div class="empty-state-countdown">' + countdown + '</div>' +
        '<div class="empty-state-countdown-lbl">Until KO</div>' +
      '</div>' +
    '</div>' +
    '</div>';
}

function getCountdown(target) {
  var diff = target.getTime() - Date.now();
  if (diff <= 0) return 'NOW';
  var d = Math.floor(diff / 86400000);
  var h = Math.floor((diff % 86400000) / 3600000);
  return d + 'd ' + h + 'h';
}

// ─── SCHEDULE ─────────────────────────────────────────────────────────────────

function fixtureRow(f, mine) {
  return '<div class="fix-card' + (mine ? ' mine' : '') + '">' +
    '<div class="fix-t" onclick="openTeam(\'' + f.hc + '\')" style="cursor:pointer">' + ff(f.hc, 28, 20) + ' ' + f.h + '</div>' +
    '<div class="fix-c"><span class="fix-vs">vs</span><span class="fix-time">' + f.t + '</span><div class="fix-grp">Grp ' + f.g + '</div></div>' +
    '<div class="fix-t r" onclick="openTeam(\'' + f.ac + '\')" style="cursor:pointer">' + ff(f.ac, 28, 20) + ' ' + f.a + '</div>' +
    '</div>';
}

function buildSchedule() {
  var mn   = myTeamNames();
  var mine = FIXTURES.filter(function(f){ return mn.includes(f.h) || mn.includes(f.a); });
  var html = '';

  if (mine.length) {
    html += sec('Your fixtures');
    html += mine.map(function(f){ return fixtureRow(f, true); }).join('');
  }
  html += sec('Full schedule');

  var byDate = {};
  FIXTURES.forEach(function(f){
    if (!byDate[f.date]) byDate[f.date] = [];
    byDate[f.date].push(f);
  });
  Object.entries(byDate).forEach(function(entry){
    var date = entry[0], matches = entry[1];
    html += '<div class="day-lbl span-all">' + date + '</div>';
    html += matches.map(function(f){
      return fixtureRow(f, mn.includes(f.h) || mn.includes(f.a));
    }).join('');
  });

  document.getElementById('p-sched').innerHTML = html;
}

// ─── GROUPS ───────────────────────────────────────────────────────────────────

var groupsShowLive = false;
var standingsCache = null; // cached live standings from API

async function fetchStandings() {
  if (!LIVE_API_ENABLED) return null;
  try {
    var res = await fetch('/api/standings?league=' + API_LEAGUE + '&season=' + API_SEASON);
    var data = await res.json();
    if (data.error) {
      console.error('Summer of Soccer — standings error:', data.error, data);
      throw new Error(data.error);
    }
    if (!Array.isArray(data.response)) throw new Error('Unexpected standings shape');

    // API-Football groups standings as response[0].league.standings = [[group1 teams], [group2 teams], ...]
    var groups = {};
    (data.response[0]?.league.standings || []).forEach(function(group) {
      if (!group.length) return;
      // Derive a group letter from the group label, e.g. "Group A" -> "A"
      var label = group[0].group || '';
      var letter = (label.match(/[A-L]$/) || [])[0] || label;
      groups[letter] = group.map(function(t) {
        return {
          n: t.team.name, c: teamCodeFromApi(t.team),
          p: t.all.played, w: t.all.win, d: t.all.draw, l: t.all.lose,
          gf: t.all.goals.for, ga: t.all.goals.against, pts: t.points
        };
      });
    });
    return groups;
  } catch (e) {
    return null;
  }
}

function toggleGroupsLive(btn) {
  groupsShowLive = !groupsShowLive;
  btn.textContent = groupsShowLive ? '● LIVE' : 'LIVE VIEW';
  btn.classList.toggle('live-toggle-on', groupsShowLive);
  buildGroups();
}

// Apply any in-progress live match scores on top of the official standings,
// so the table reflects what would happen if matches ended right now.
function getAdjustedGroups(groups) {
  if (!groupsShowLive || !LIVE_MATCHES.length) return groups;

  var adj = {};
  Object.entries(groups).forEach(function(e) {
    adj[e[0]] = e[1].map(function(t){ return Object.assign({},t); });
  });

  LIVE_MATCHES.forEach(function(m) {
    var grp = adj[m.g];
    if (!grp) return;
    var home = grp.find(function(t){ return t.c === m.hc; });
    var away = grp.find(function(t){ return t.c === m.ac; });
    if (!home || !away) return;

    home.gf = (home.gf||0) + m.hs;
    home.ga = (home.ga||0) + m.as;
    away.gf = (away.gf||0) + m.as;
    away.ga = (away.ga||0) + m.hs;
    home.p  = (home.p||0) + 1;
    away.p  = (away.p||0) + 1;

    if (m.hs > m.as) {
      home.w = (home.w||0)+1; home.pts = (home.pts||0)+3;
      away.l = (away.l||0)+1;
    } else if (m.as > m.hs) {
      away.w = (away.w||0)+1; away.pts = (away.pts||0)+3;
      home.l = (home.l||0)+1;
    } else {
      home.d = (home.d||0)+1; home.pts = (home.pts||0)+1;
      away.d = (away.d||0)+1; away.pts = (away.pts||0)+1;
    }
  });
  return adj;
}

async function buildGroups() {
  var mn = myTeamNames();
  var pane = document.getElementById('p-groups');
  if (!pane) return;

  pane.innerHTML = '<div class="empty-state"><div class="empty-state-title">Loading standings…</div></div>';

  if (standingsCache === null) {
    standingsCache = await fetchStandings();
  }

  if (!standingsCache) {
    pane.innerHTML = '<div class="empty-state">' +
      '<div class="empty-state-title">Live standings not available</div>' +
      '<div class="empty-state-body">Group tables will appear here once the tournament data feed is connected.</div>' +
    '</div>';
    return;
  }

  var groups = getAdjustedGroups(standingsCache);

  // Build toggle button
  var toggleHtml = '<div class="groups-toolbar">' +
    '<button class="live-toggle' + (groupsShowLive ? ' live-toggle-on' : '') +
    '" onclick="toggleGroupsLive(this)">' +
    (groupsShowLive ? '● LIVE' : 'LIVE VIEW') +
    '</button>' +
    (groupsShowLive ? '<span class="live-toggle-note">Standings updated with live scores</span>' : '') +
    '</div>';

  pane.innerHTML = toggleHtml + Object.entries(groups).map(function(entry){
    var grp = entry[0], rows = entry[1];
    var sorted = rows.slice().sort(function(a,b){
      return (b.pts - a.pts) || ((b.gf - b.ga) - (a.gf - a.ga));
    });
    var isLive = groupsShowLive && LIVE_MATCHES.some(function(m){ return m.g === grp; });
    return '<div class="grp-block' + (isLive ? ' grp-block-live' : '') + '">' +
      '<div class="grp-hd">' +
        '<div class="grp-title">Group ' + grp + '</div>' +
        (isLive ? '<span class="grp-live-badge">● LIVE</span>' : '') +
      '</div>' +
      '<table class="grp-tbl">' +
        '<tr><th style="width:54%">Team</th><th style="width:15%">P</th><th style="width:15%">GD</th><th style="width:16%">Pts</th></tr>' +
        sorted.map(function(t, i){
          var isQual = i < 2;
          var isMineRow = mn.includes(t.n);
          var rowClass = (isMineRow ? 'mine' : '') + (isQual ? ' qual' : '');
          return '<tr class="' + rowClass.trim() + '" onclick="openTeam(\'' + t.c + '\')" style="cursor:pointer">' +
            '<td><div class="t-name">' +
              '<span style="width:26px;height:18px;display:inline-block;overflow:hidden;flex-shrink:0;vertical-align:middle">' + svgFlag(t.c, 26, 18) + '</span>' +
              t.n +
            '</div></td>' +
            '<td>' + t.p + '</td>' +
            '<td>' + (t.gf - t.ga) + '</td>' +
            '<td class="t-pts">' + t.pts + '</td>' +
            '</tr>';
        }).join('') +
      '</table>' +
      '</div>';
  }).join('');
}

// ─── HISTORY ──────────────────────────────────────────────────────────────────

function histRow(rank, code, name, detail, val, valClass) {
  var rc = rank === 1 ? 'g' : rank === 2 ? 's' : rank === 3 ? 'b' : '';
  return '<div class="hist-row">' +
    '<div class="hist-rank' + (rc ? ' '+rc : '') + '">' + rank + '</div>' +
    '<div class="h-info">' + ff(code, 28, 20) +
      '<div style="min-width:0"><div class="h-name">' + name + '</div><div class="h-det">' + detail + '</div></div>' +
    '</div>' +
    '<div class="h-val' + (valClass ? ' '+valClass : '') + '">' + val + '</div>' +
    '</div>';
}

function buildHistory() {
  document.getElementById('p-hist').innerHTML =
    sec('All-time top scorers') +
    '<div class="hist-block">' +
      '<div class="hist-hd pink-bg"><div class="hist-hd-lbl">All-time top scorers</div></div>' +
      ALL_TIME_SCORERS.map(function(s,i){ return histRow(i+1, s.c, s.n, s.c+' · '+s.yrs, s.goals, ''); }).join('') +
    '</div>' +
    sec('Golden Shoe — top scorer per tournament') +
    '<div class="hist-block">' +
      '<div class="hist-hd purple-bg"><div class="hist-hd-lbl">Golden Shoe History</div></div>' +
      GOLDEN_SHOE.map(function(g,i){ return histRow(i+1, g.c, g.n, String(g.yr), g.goals, 'pur'); }).join('') +
    '</div>' +
    sec('Tournament winners') +
    '<div class="hist-block">' +
      '<div class="hist-hd yellow-bg"><div class="hist-hd-lbl" style="color:var(--ink)">Tournament Winners</div></div>' +
      TOURNAMENT_WINNERS.map(function(w,i){ return histRow(i+1, w.c, w.n, w.yrs, '×'+w.t, 'grn'); }).join('') +
    '</div>' +
    sec('Records') +
    '<div class="rec-grid span-all">' +
      RECORDS.map(function(r){
        return '<div class="rec-tile"><div class="rec-t">'+r.t+'</div><div class="rec-v">'+r.v+'</div><div class="rec-d">'+r.d+'</div></div>';
      }).join('') +
    '</div>';
}


// ─── STATS TAB ────────────────────────────────────────────────────────────────

var statsCache = null; // cached API response so we don't refetch every tab switch

async function fetchTournamentStats() {
  if (!LIVE_API_ENABLED) return null;

  try {
    var [scorersRes, assistsRes, standingsRes] = await Promise.all([
      fetch('/api/players/topscorers?league=' + API_LEAGUE + '&season=' + API_SEASON),
      fetch('/api/players/topassists?league=' + API_LEAGUE + '&season=' + API_SEASON),
      fetch('/api/standings?league=' + API_LEAGUE + '&season=' + API_SEASON),
    ]);

    var scorersData   = await scorersRes.json();
    var assistsData   = await assistsRes.json();
    var standingsData = await standingsRes.json();

    if (scorersData.error || assistsData.error || standingsData.error) {
      console.error('Summer of Soccer — stats error:', scorersData.error || assistsData.error || standingsData.error, { scorersData, assistsData, standingsData });
      throw new Error(scorersData.error || assistsData.error || standingsData.error);
    }

    if (!Array.isArray(scorersData.response) || !Array.isArray(assistsData.response)) {
      throw new Error('Unexpected stats response shape');
    }

    var scorerList = scorersData.response.slice(0,10).map(function(p) {
      var stat = p.statistics[0];
      return {
        name: p.player.name, team: teamCodeFromApi(stat.team),
        goals: stat.goals.total, pen: stat.penalty.scored || 0
      };
    });

    var assistList = assistsData.response.slice(0,10).map(function(p) {
      var stat = p.statistics[0];
      return {
        name: p.player.name, team: teamCodeFromApi(stat.team),
        assists: stat.goals.assists || 0
      };
    });

    // Team goals derived from standings (goals for, across all groups)
    var teamGoalList = [];
    (standingsData.response || []).forEach(function(league) {
      (league.league.standings || []).forEach(function(group) {
        group.forEach(function(t) {
          teamGoalList.push({
            code: teamCodeFromApi(t.team), name: t.team.name,
            goals: t.all.goals.for
          });
        });
      });
    });
    teamGoalList.sort(function(a,b){ return b.goals - a.goals; });
    teamGoalList = teamGoalList.slice(0,6);

    return { scorerList:scorerList, assistList:assistList, teamGoalList:teamGoalList };
  } catch (e) {
    return null;
  }
}

function statsRow(rank, code, name, sub, val, valClass, isMineRow) {
  var rc = rank===1?'g':rank===2?'s':rank===3?'b':'';
  return '<div class="stats-row' + (isMineRow?' mine':'') + '">' +
    '<div class="stats-rank' + (rc?' '+rc:'') + '">' + rank + '</div>' +
    ff(code, 28, 20) +
    '<div class="stats-info">' +
      '<div class="stats-name">' + name + '</div>' +
      '<div class="stats-sub">' + sub + '</div>' +
    '</div>' +
    '<div class="stats-val ' + valClass + '">' + val + '</div>' +
    '</div>';
}

function statsConnectPrompt(label) {
  return '<div class="stats-section">' +
    '<div class="stats-section-hd"><div class="stats-section-title">' + label + '</div></div>' +
    '<div class="empty-state">' +
      '<div class="empty-state-title">Live data not connected</div>' +
      '<div class="empty-state-body">Connect the tournament API to show real-time ' + label.toLowerCase().replace(/^[^a-z]*/,'') + '.</div>' +
    '</div>' +
  '</div>';
}

async function buildStats() {
  var mn = myTeamNames();
  var pane = document.getElementById('p-stats');
  if (!pane) return;

  // Show a lightweight loading state while we fetch
  pane.innerHTML = '<div class="empty-state"><div class="empty-state-title">Loading stats…</div></div>';

  if (statsCache === null) {
    statsCache = await fetchTournamentStats();
  }
  var s = statsCache;

  var html = '';

  if (!s) {
    // No live data available — explain why, no fabricated numbers shown
    html += '<div class="empty-state">' +
      '<div class="empty-state-title">Live stats not available</div>' +
      '<div class="empty-state-body">Top scorers, assists and team goals will appear here once the tournament data feed is connected.</div>' +
    '</div>';
    pane.innerHTML = html;
    return;
  }

  // ── TOP SCORERS ──
  html += '<div class="stats-section">' +
    '<div class="stats-section-hd"><div class="stats-section-title">⚽ Top Scorers</div></div>';
  s.scorerList.forEach(function(p, i) {
    var t = TEAMS.find(function(x){return x.c===p.team;});
    var sub = (t?t.n:p.team) + (p.pen?' · '+p.pen+' pen':'');
    html += statsRow(i+1, p.team, p.name, sub, p.goals, 'goals', mn.includes(t?t.n:''));
  });
  html += '</div>';

  // ── TOP ASSISTS ──
  html += '<div class="stats-section">' +
    '<div class="stats-section-hd"><div class="stats-section-title">🎯 Top Assists</div></div>';
  s.assistList.forEach(function(p, i) {
    var t = TEAMS.find(function(x){return x.c===p.team;});
    html += statsRow(i+1, p.team, p.name, t?t.n:p.team, p.assists, 'assists', mn.includes(t?t.n:''));
  });
  html += '</div>';

  // ── TEAM GOALS ──
  html += '<div class="stats-section">' +
    '<div class="stats-section-hd"><div class="stats-section-title">🏟 Most Goals</div></div>' +
    '<div class="stats-team-grid">';
  s.teamGoalList.forEach(function(t) {
    var isMineTeam = mn.includes(t.name);
    html += '<div class="stats-team-cell' + (isMineTeam?' mine':'') + '">' +
      ff(t.code, 32, 22) +
      '<div>' +
        '<div class="stats-team-label">Goals</div>' +
        '<div class="stats-team-name">' + t.name + '</div>' +
      '</div>' +
      '<div class="stats-team-val">' + t.goals + '</div>' +
      '</div>';
  });
  html += '</div></div>';

  // ── TOURNAMENT OVERVIEW ── (derived from live matches we already have)
  var totalGoals   = [...LIVE_MATCHES,...COMPLETED].reduce(function(s,m){return s+m.hs+m.as;},0);
  var totalMatches = [...LIVE_MATCHES,...COMPLETED].length;
  var avgGoals     = totalMatches ? (totalGoals/totalMatches).toFixed(1) : '—';

  html += '<div class="stats-section">' +
    '<div class="stats-section-hd"><div class="stats-section-title">📊 Tournament</div></div>' +
    '<div class="stats-team-grid">' +
      '<div class="stats-team-cell"><div><div class="stats-team-label">Matches played</div><div class="stats-team-name">All groups</div></div><div class="stats-team-val" style="color:var(--ink)">' + totalMatches + '</div></div>' +
      '<div class="stats-team-cell"><div><div class="stats-team-label">Goals scored</div><div class="stats-team-name">Tournament</div></div><div class="stats-team-val">' + totalGoals + '</div></div>' +
      '<div class="stats-team-cell"><div><div class="stats-team-label">Goals per game</div><div class="stats-team-name">Average</div></div><div class="stats-team-val" style="color:var(--purple)">' + avgGoals + '</div></div>' +
    '</div>' +
  '</div>';

  // ── ALL-TIME HISTORY (top 5 each) — static historical records, not live ──
  html += '<div class="stats-section">' +
    '<div class="stats-section-hd"><div class="stats-section-title">⚽ All-time Scorers</div></div>' +
    ALL_TIME_SCORERS.slice(0,5).map(function(s,i){ return statsRow(i+1,s.c,s.n,s.c+' · '+s.yrs,s.goals,'goals',false); }).join('') +
  '</div>';

  html += '<div class="stats-section">' +
    '<div class="stats-section-hd"><div class="stats-section-title">👟 Golden Shoe</div></div>' +
    GOLDEN_SHOE.slice(0,5).map(function(g,i){ return statsRow(i+1,g.c,g.n,String(g.yr),g.goals,'assists',false); }).join('') +
  '</div>';

  html += '<div class="stats-section">' +
    '<div class="stats-section-hd"><div class="stats-section-title">🏆 Most Titles</div></div>' +
    TOURNAMENT_WINNERS.slice(0,5).map(function(w,i){ return statsRow(i+1,w.c,w.n,w.yrs,'×'+w.t,'yellow-stat',false); }).join('') +
  '</div>';

  html += '<div class="stats-section">' +
    '<div class="stats-section-hd"><div class="stats-section-title">⚡ Records</div></div>' +
    RECORDS.map(function(r){ return '<div class="stats-row"><div class="stats-info"><div class="stats-name">' + r.t + '</div><div class="stats-sub">' + r.d + '</div></div><div class="stats-val goals">' + r.v + '</div></div>'; }).join('') +
  '</div>';

  pane.innerHTML = html;
}

// ─── INIT ─────────────────────────────────────────────────────────────────────

renderPick('ALL');
startCountdown();

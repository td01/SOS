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
    var el   = document.getElementById('pick-countdown');
    if (!el) return;
    if (diff <= 0) { el.textContent = 'LIVE NOW'; return; }
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
  buildHistory();
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
  if (id === 'dyk')  buildDyk();
  if (id === 'live') buildLive();
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

  if (LIVE_MATCHES.length === 0) {
    ticker.className = 'score-ticker no-live';
    ticker.innerHTML = '<div class="ticker-no-live">Next: Mexico vs South Africa · Jun 11 · 15:00 ET</div>';
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

  ticker.innerHTML = '<div class="ticker-inner">' + items + '</div>';
}

// ─── LIVE POLLING ─────────────────────────────────────────────────────────────

function startLivePoll() {
  fetchLiveData();
  pollTimer = setInterval(fetchLiveData, 60000);
}
function stopLivePoll() {
  if (pollTimer) { clearInterval(pollTimer); pollTimer = null; }
}
function fetchLiveData() {
  // Uncomment when API is wired:
  // fetch('/api/fixtures?live=all') ...
  buildLive();
  buildTicker();
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

  // Live matches
  document.getElementById('live-wrap').innerHTML = LIVE_MATCHES.length
    ? LIVE_MATCHES.map(function(m){ return matchCard(m, true); }).join('')
    : buildEmptyState();

  // Completed
  document.getElementById('done-wrap').innerHTML = COMPLETED.length
    ? COMPLETED.map(function(m){ return matchCard(m, false); }).join('')
    : '<div class="empty-state"><div class="empty-state-title">No results yet</div><div class="empty-state-body">Today\'s first results will appear here.</div></div>';
}

function buildEmptyState() {
  // Find the next fixture
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

function buildGroups() {
  var mn = myTeamNames();
  document.getElementById('p-groups').innerHTML = Object.entries(GROUPS).map(function(entry){
    var grp = entry[0], rows = entry[1];
    var sorted = [...rows].sort(function(a,b){
      return (b.pts - a.pts) || ((b.gf - b.ga) - (a.gf - a.ga));
    });
    return '<div class="grp-block">' +
      '<div class="grp-hd"><div class="grp-title">Group ' + grp + '</div></div>' +
      '<table class="grp-tbl">' +
        '<tr><th style="width:46%">Team</th><th style="width:18%">P</th><th style="width:18%">GD</th><th style="width:18%">Pts</th></tr>' +
        sorted.map(function(t, i){
          var isQual = i < 2;
          var isMineRow = mn.includes(t.n);
          var rowClass = (isMineRow ? 'mine' : '') + (isQual ? ' qual' : '');
          return '<tr class="' + rowClass.trim() + '" onclick="openTeam(\'' + t.c + '\')" style="cursor:pointer">' +
            '<td><div class="t-name">' +
              (isQual ? '<span class="qdot"></span>' : '') +
              '<span style="width:32px;height:22px;display:inline-block;overflow:hidden;flex-shrink:0;vertical-align:middle">' + svgFlag(t.c, 32, 22) + '</span>' +
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

// ─── INIT ─────────────────────────────────────────────────────────────────────

renderPick('ALL');
startCountdown();

// ─── STATE ────────────────────────────────────────────────────────────────────

var STORAGE_KEY_TEAMS = 'sos_chosen_teams';
var STORAGE_KEY_REGION = 'sos_region';

function loadSavedTeams() {
  try {
    var raw = localStorage.getItem(STORAGE_KEY_TEAMS);
    if (!raw) return [];
    var parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(function(c){ return TEAMS.some(function(t){ return t.c === c; }); }) : [];
  } catch (e) {
    return [];
  }
}

function saveChosenTeams() {
  try {
    localStorage.setItem(STORAGE_KEY_TEAMS, JSON.stringify(chosen));
  } catch (e) {
    // localStorage unavailable (private browsing, storage full, etc.) — fail silently,
    // selection just won't persist across visits.
  }
}

var chosen  = loadSavedTeams();
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
  var clearBtn = document.getElementById('pick-clear-btn');
  if (clearBtn) clearBtn.style.display = n > 0 ? 'inline-block' : 'none';
}

function toggleTeam(code) {
  var i = chosen.indexOf(code);
  if (i > -1) chosen.splice(i, 1); else chosen.push(code);
  saveChosenTeams();
  renderPick(curRgn);
}

function clearTeamSelection() {
  chosen.length = 0;
  saveChosenTeams();
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
  syncHeaderHeight();

  // Start the "add to home screen" engagement timer from here (actual app
  // entry), not page load — time spent on the team-picker isn't real usage
  // of the app and shouldn't count toward the delay before prompting.
  if (typeof scheduleInstallPrompt === 'function') scheduleInstallPrompt();
}

// Measure the actual rendered header height (varies with safe-area-inset-top
// across devices) and expose it as a CSS variable so the tab nav can stick
// directly beneath it instead of a guessed/hardcoded pixel value.
function syncHeaderHeight() {
  var header = document.querySelector('.app-top');
  if (!header) return;
  var h = header.getBoundingClientRect().height;
  document.documentElement.style.setProperty('--header-h', h + 'px');
}
window.addEventListener('resize', syncHeaderHeight);
window.addEventListener('orientationchange', function() {
  setTimeout(syncHeaderHeight, 150);
});

function back() {
  stopLivePoll();
  document.getElementById('s-app').style.display  = 'none';
  document.getElementById('s-pick').style.display = 'block';
}

// Tapping the header icon goes to the app's home (Live tab) and stays
// within the in-app yellow header — distinct from "Change teams", which
// exits to the team-selection screen entirely.
function goHome() {
  var liveBtn = document.querySelector('.bnav-btn[onclick*="\'live\'"]');
  if (liveBtn) {
    tab('live', liveBtn);
  }
  var pane = document.querySelector('.pane.on');
  if (pane) pane.scrollTop = 0;
}

var TAB_ORDER = ['live', 'sched', 'groups', 'stats', 'dyk'];

function tab(id, btn) {
  document.querySelectorAll('.pane').forEach(function(p){ p.classList.remove('on'); });
  document.getElementById('p-' + id).classList.add('on');
  document.querySelectorAll('.bnav-btn').forEach(function(b){ b.classList.remove('on'); });
  btn.classList.add('on');
  if (id === 'dyk')    buildDyk();
  if (id === 'live')   buildLive();
  if (id === 'stats')  buildStats();
  // Groups and Schedule were previously only built once on launch() and
  // never refreshed on tab switch — so a finished match's score/standings
  // update would never reach the table until a manual pull-to-refresh.
  // Re-fetch fresh data every time these tabs are opened; silent=true
  // means no loading-flash if it's already been built once before.
  if (id === 'groups') buildGroups(true);
  if (id === 'sched')  buildSchedule(true);
}

// Switch tabs by index offset (-1 = previous, +1 = next), used by swipe gestures
function swipeToTab(direction) {
  var activeBtn = document.querySelector('.bnav-btn.on');
  if (!activeBtn) return;
  var match = activeBtn.getAttribute('onclick').match(/tab\('(\w+)'/);
  if (!match) return;
  var currentId = match[1];
  var idx = TAB_ORDER.indexOf(currentId);
  if (idx === -1) return;
  var nextIdx = idx + direction;
  if (nextIdx < 0 || nextIdx >= TAB_ORDER.length) return;

  var nextId  = TAB_ORDER[nextIdx];
  var nextBtn = document.querySelectorAll('.bnav-btn')[nextIdx];
  if (nextBtn) {
    // Direction-aware pane animation
    var pane = document.getElementById('p-' + nextId);
    if (pane) {
      pane.classList.remove('swipe-in-left', 'swipe-in-right');
      void pane.offsetWidth;
      pane.classList.add(direction > 0 ? 'swipe-in-right' : 'swipe-in-left');
    }
    tab(nextId, nextBtn);
  }
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
  pollTimer = setInterval(function() {
    fetchLiveData();
    // Also keep the currently-open tab's own data fresh — fetchLiveData()
    // alone only updates the Live tab's match cards. Without this, someone
    // sitting on Groups/Schedule while a match finishes would never see the
    // table update until they switched tabs or manually pulled to refresh.
    var activeBtn = document.querySelector('.bnav-btn.on');
    var match = activeBtn && activeBtn.getAttribute('onclick').match(/tab\('(\w+)'/);
    var activeTab = match ? match[1] : null;
    if (activeTab === 'groups') buildGroups(true);
    if (activeTab === 'sched')  buildSchedule(true);
  }, 60000);
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
      fetch('/api/fixtures?live=all&league=' + API_LEAGUE + '&season=' + API_SEASON),
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

    // Defensive hard filter: only ever accept fixtures whose league.id
    // matches our tournament, regardless of what the query string asked
    // for. This guards against any endpoint (like ?live=all) ignoring
    // the league filter and returning unrelated club matches.
    var isOurTournament = function(f) {
      return f.league && Number(f.league.id) === Number(API_LEAGUE);
    };

    // Rebuild LIVE_MATCHES from API response
    var newLive = liveData.response.filter(isOurTournament).map(function(f) {
      var round = f.league.round || '';
      var stage = stageFromRound(round);
      return {
        id: f.fixture.id,
        h: f.teams.home.name, hc: teamCodeFromApi(f.teams.home),
        a: f.teams.away.name, ac: teamCodeFromApi(f.teams.away),
        hs: f.goals.home ?? 0, as: f.goals.away ?? 0,
        min: f.fixture.status.elapsed ?? 0,
        stage: stage,
        // Only a genuine group letter for group-stage matches — for
        // knockout rounds (Round of 16, QF, etc.) there's no group to
        // adjust. Uses groupLetterFromRound() rather than a naive replace,
        // since API-Football's round string includes a matchday suffix
        // (e.g. "Group E - 2"), which a plain .replace('Group ','') would
        // leave attached, breaking the standings-table lookup.
        g: stage === 'group' ? groupLetterFromRound(round) : '',
        events: (f.events || []).map(function(e) {
          return classifyMatchEvent(e);
        }).filter(Boolean)
      };
    });

    var newCompleted = todayData.response
      .filter(isOurTournament)
      .filter(function(f){ return f.fixture.status.short === 'FT'; })
      .map(function(f) {
        var round = f.league.round || '';
        var stage = stageFromRound(round);
        return {
          id: f.fixture.id,
          h: f.teams.home.name, hc: teamCodeFromApi(f.teams.home),
          a: f.teams.away.name, ac: teamCodeFromApi(f.teams.away),
          hs: f.goals.home, as: f.goals.away,
          stage: stage,
          g: stage === 'group' ? groupLetterFromRound(round) : ''
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

// Classify a raw API-Football fixture event into a display-ready shape.
// API-Football's event.type is one of: 'Goal', 'Card', 'subst' (substitution,
// lowercase) — and Card events carry the actual color in event.detail
// ('Yellow Card', 'Red Card', or 'Yellow-Red Card' for a second-booking
// sending off). Treating anything non-Goal as a red card (the previous bug)
// wrongly flagged every yellow card and every substitution as a red card.
function classifyMatchEvent(e) {
  var team = teamCodeFromApi(e.team);
  var min  = e.time.elapsed;

  if (e.type === 'Goal') {
    var goalKind = e.detail && e.detail.includes('Penalty') ? ' (pen)'
                 : e.detail && e.detail.includes('Own Goal') ? ' (OG)'
                 : '';
    return { min: min, team: team, kind: 'goal', icon: '⚽', text: 'GOAL — ' + e.player.name + goalKind };
  }

  if (e.type === 'Card') {
    var detail = (e.detail || '').toLowerCase();
    if (detail.includes('yellow-red') || detail.includes('second yellow')) {
      return { min: min, team: team, kind: 'red', icon: '🟥', text: 'RED CARD — ' + e.player.name + ' (2nd yellow)' };
    }
    if (detail.includes('red')) {
      return { min: min, team: team, kind: 'red', icon: '🟥', text: 'RED CARD — ' + e.player.name };
    }
    if (detail.includes('yellow')) {
      return { min: min, team: team, kind: 'yellow', icon: '🟨', text: 'YELLOW CARD — ' + e.player.name };
    }
    // Unrecognized card detail — show generically rather than guessing red.
    return { min: min, team: team, kind: 'card', icon: '🟨', text: 'CARD — ' + e.player.name };
  }

  if (e.type === 'subst') {
    // API-Football: player.name is who came ON, assist.name is who went OFF.
    var off = e.assist && e.assist.name ? e.assist.name : null;
    return {
      min: min, team: team, kind: 'sub', icon: '🔄',
      text: 'SUB — ' + e.player.name + (off ? ' on for ' + off : ' on')
    };
  }

  // Unknown/unhandled event type from the API we don't specifically handle
  // (e.g. VAR) — skip rather than mislabel it as something it isn't.
  return null;
}

// ─── MATCH DETAIL OVERLAY ───────────────────────────────────────────────────────

async function openMatchDetail(fixtureId) {
  var overlay = document.getElementById('match-overlay');
  var content = document.getElementById('match-content');
  if (!overlay || !content) return;

  content.innerHTML =
    '<div class="pp-header">' +
      '<button class="pp-back" onclick="closeMatchDetail()">‹ Back</button>' +
    '</div>' +
    '<div class="pp-body"><div class="empty-state"><div class="empty-state-title">Loading match…</div></div></div>';
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  if (!LIVE_API_ENABLED) {
    content.querySelector('.pp-body').innerHTML =
      '<div class="empty-state"><div class="empty-state-title">Match details not available</div>' +
      '<div class="empty-state-body">Connect the live data feed to see stats, scorers and lineups.</div></div>';
    return;
  }

  try {
    var res = await fetch('/api/fixtures?id=' + fixtureId);
    var data = await res.json();
    if (data.error) {
      console.error('Summer of Soccer — match detail error:', data.error, data);
      throw new Error(data.error);
    }
    if (!Array.isArray(data.response) || !data.response.length) {
      throw new Error('No match data returned');
    }

    renderMatchDetail(data.response[0]);
  } catch (e) {
    content.querySelector('.pp-body').innerHTML =
      '<div class="empty-state"><div class="empty-state-title">Couldn\u2019t load match details</div>' +
      '<div class="empty-state-body">Please try again in a moment.</div></div>';
  }
}

function closeMatchDetail() {
  document.getElementById('match-overlay').classList.remove('open');
  if (typeof releaseScrollLockIfNoOverlaysOpen === 'function') {
    releaseScrollLockIfNoOverlaysOpen();
  } else {
    document.body.style.overflow = '';
  }
}

function renderMatchDetail(f) {
  var content = document.getElementById('match-content');
  var hc = teamCodeFromApi(f.teams.home);
  var ac = teamCodeFromApi(f.teams.away);
  var venue = f.fixture.venue || {};
  var kickoff = new Date(f.fixture.date);
  var dateStr = kickoff.toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric' });

  // ── Scorers from events ──
  var goalEvents = (f.events || []).filter(function(e){ return e.type === 'Goal'; });
  var scorersHtml = goalEvents.length
    ? goalEvents.map(function(e) {
        var isHome = e.team.id === f.teams.home.id;
        var detail = e.detail && e.detail !== 'Normal Goal' ? ' (' + e.detail.replace(' Goal','').toLowerCase() + ')' : '';
        return '<div class="md-scorer ' + (isHome ? 'md-home' : 'md-away') + '">' +
          '<span class="md-scorer-min">' + e.time.elapsed + '\'</span>' +
          '<span class="md-scorer-name">⚽ ' + e.player.name + detail + '</span>' +
          (e.assist && e.assist.name ? '<span class="md-scorer-assist">assist: ' + e.assist.name + '</span>' : '') +
          '</div>';
      }).join('')
    : '<div class="md-empty-row">No goals in this match</div>';

  // ── Cards from events ──
  var cardEvents = (f.events || []).filter(function(e){ return e.type === 'Card'; });
  var cardsHtml = cardEvents.length
    ? cardEvents.map(function(e) {
        var isHome = e.team.id === f.teams.home.id;
        var icon = e.detail.includes('Red') ? '🟥' : '🟨';
        return '<div class="md-scorer ' + (isHome ? 'md-home' : 'md-away') + '">' +
          '<span class="md-scorer-min">' + e.time.elapsed + '\'</span>' +
          '<span class="md-scorer-name">' + icon + ' ' + e.player.name + '</span>' +
          '</div>';
      }).join('')
    : '';

  // ── Match statistics (possession, shots, etc.) ──
  var statsHtml = '';
  if (f.statistics && f.statistics.length === 2) {
    var homeStats = f.statistics[0].statistics || [];
    var awayStats = f.statistics[1].statistics || [];
    var keys = ['Ball Possession', 'Total Shots', 'Shots on Goal', 'Corner Kicks', 'Fouls', 'Yellow Cards', 'Red Cards'];
    statsHtml = keys.map(function(key) {
      var h = homeStats.find(function(s){ return s.type === key; });
      var a = awayStats.find(function(s){ return s.type === key; });
      if (!h && !a) return '';
      var hv = h ? h.value : 0, av = a ? a.value : 0;
      var hNum = parseFloat(hv) || 0, aNum = parseFloat(av) || 0;
      var total = hNum + aNum || 1;
      var hPct = (hNum / total) * 100;
      return '<div class="md-stat-row">' +
        '<span class="md-stat-val">' + (hv ?? '0') + '</span>' +
        '<div class="md-stat-bar"><div class="md-stat-bar-fill" style="width:' + hPct + '%"></div></div>' +
        '<span class="md-stat-label">' + key + '</span>' +
        '<div class="md-stat-bar md-stat-bar-away"><div class="md-stat-bar-fill away" style="width:' + (100-hPct) + '%"></div></div>' +
        '<span class="md-stat-val">' + (av ?? '0') + '</span>' +
        '</div>';
    }).join('');
  }

  // ── Lineups ──
  var lineupHtml = '';
  if (f.lineups && f.lineups.length === 2) {
    lineupHtml = f.lineups.map(function(side, i) {
      var code = teamCodeFromApi(side.team);
      var starters = (side.startXI || []).map(function(p) {
        return '<div class="md-player-row">' +
          '<span class="md-player-num">' + (p.player.number || '') + '</span>' +
          '<span class="md-player-name">' + p.player.name + '</span>' +
          '<span class="md-player-pos">' + (p.player.pos || '') + '</span>' +
          '</div>';
      }).join('');
      var subs = (side.substitutes || []).map(function(p) {
        return '<div class="md-player-row md-sub">' +
          '<span class="md-player-num">' + (p.player.number || '') + '</span>' +
          '<span class="md-player-name">' + p.player.name + '</span>' +
          '<span class="md-player-pos">' + (p.player.pos || '') + '</span>' +
          '</div>';
      }).join('');
      return '<div class="md-lineup-col">' +
        '<div class="md-lineup-hd">' + ff(code, 24, 17) + (side.formation ? '<span class="md-formation">' + side.formation + '</span>' : '') + '</div>' +
        '<div class="md-lineup-label">Starting XI</div>' +
        starters +
        (subs ? '<div class="md-lineup-label">Substitutes</div>' + subs : '') +
        '</div>';
    }).join('');
  }

  content.innerHTML =
    '<div class="pp-header">' +
      '<button class="pp-back" onclick="closeMatchDetail()">‹ Back</button>' +
      '<span class="md-header-status">' + (f.fixture.status.long || '') + '</span>' +
    '</div>' +
    '<div class="pp-body">' +
      '<div class="md-scoreline">' +
        '<div class="md-scoreline-team" onclick="closeMatchDetail();setTimeout(function(){openTeam(\'' + hc + '\')},250)">' +
          ff(hc, 44, 30) + '<div class="md-scoreline-name">' + f.teams.home.name + '</div>' +
        '</div>' +
        '<div class="md-scoreline-center">' +
          '<div class="md-scoreline-score">' + (f.goals.home ?? '–') + ' \u2013 ' + (f.goals.away ?? '–') + '</div>' +
          '<div class="md-scoreline-meta">' + dateStr + '</div>' +
        '</div>' +
        '<div class="md-scoreline-team" onclick="closeMatchDetail();setTimeout(function(){openTeam(\'' + ac + '\')},250)">' +
          ff(ac, 44, 30) + '<div class="md-scoreline-name">' + f.teams.away.name + '</div>' +
        '</div>' +
      '</div>' +
      (venue.name ? '<div class="md-venue">' + venue.name + (venue.city ? ', ' + venue.city : '') + '</div>' : '') +

      '<div class="md-section-label">Scorers</div>' +
      '<div class="md-section">' + scorersHtml + '</div>' +

      (cardsHtml ? '<div class="md-section-label">Cards</div><div class="md-section">' + cardsHtml + '</div>' : '') +

      (statsHtml ? '<div class="md-section-label">Match Stats</div><div class="md-section">' + statsHtml + '</div>' : '') +

      (lineupHtml ? '<div class="md-section-label">Lineups</div><div class="md-lineups">' + lineupHtml + '</div>' : '') +
    '</div>';
}

// ─── LIVE TAB ─────────────────────────────────────────────────────────────────

function matchCard(m, live) {
  var mine  = isMine(m);
  var cls   = live ? (mine ? 'live-mine' : 'live') : (mine ? 'done-mine' : 'done');
  var badge = live
    ? '<span class="mc-live-dot"></span> ' + m.min + '\' LIVE'
    : 'Full time';

  var matchKey = m.hc + '-' + m.ac;
  var scoreStr = m.hs + '-' + m.as;

  // Both live and completed matches can open the match detail overlay —
  // live games show events/stats as they happen, completed games show
  // the final scorers, stats and lineups.
  var tapAttr = m.id ? ' onclick="openMatchDetail(' + m.id + ')" style="cursor:pointer"' : '';
  var tapCls  = m.id ? ' mc-tappable' : '';

  var eventsHtml = '';
  if (live && m.events && m.events.length) {
    eventsHtml = '<div class="mc-events">' +
      m.events.map(function(e){
        var isHome = e.team === m.hc;
        var icon   = e.icon || '⚽';
        var name   = e.text.replace(/^(GOAL|RED CARD|YELLOW CARD|CARD|SUB) — /, '');
        return '<div class="mc-event ' + (isHome ? 'ev-home' : 'ev-away') + '">' +
          '<span class="ev-min">' + e.min + '\'</span>' +
          '<span>' + icon + '</span>' +
          '<span class="ev-text">' + name + '</span>' +
          '</div>';
      }).join('') +
      '</div>';
  }

  return '<div class="match-card ' + cls + tapCls + '" data-match-key="' + matchKey + '" data-score="' + scoreStr + '"' + tapAttr + '>' +
    '<div class="mc-badge">' + badge + '</div>' +
    '<div class="mc-teams">' +
      '<div class="mc-t" onclick="event.stopPropagation();openTeam(\'' + m.hc + '\')" style="cursor:pointer">' +
        ff(m.hc, 48, 33) +
        '<div class="mc-tn">' + m.h + '</div>' +
      '</div>' +
      '<div class="mc-center">' +
        '<div class="mc-score" data-score-el>' + m.hs + '–' + m.as + '</div>' +
        '<div class="mc-min">' + (live ? 'LIVE' : 'FT') + '</div>' +
      '</div>' +
      '<div class="mc-t r" onclick="event.stopPropagation();openTeam(\'' + m.ac + '\')" style="cursor:pointer">' +
        ff(m.ac, 48, 33) +
        '<div class="mc-tn">' + m.a + '</div>' +
      '</div>' +
    '</div>' +
    eventsHtml +
    '</div>';
}

// Track last-seen scores so we can detect changes and trigger a flash animation
var lastSeenScores = {};

function flashChangedScores() {
  document.querySelectorAll('.match-card[data-match-key]').forEach(function(card) {
    var key = card.getAttribute('data-match-key');
    var newScore = card.getAttribute('data-score');
    var oldScore = lastSeenScores[key];

    if (oldScore !== undefined && oldScore !== newScore) {
      var scoreEl = card.querySelector('[data-score-el]');
      if (scoreEl) {
        scoreEl.classList.remove('score-flash');
        void scoreEl.offsetWidth; // force reflow to restart animation
        scoreEl.classList.add('score-flash');
      }
      card.classList.remove('card-goal-pulse');
      void card.offsetWidth;
      card.classList.add('card-goal-pulse');
    }
    lastSeenScores[key] = newScore;
  });
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

  // When nothing is live, the "0" in the stat strip above already says so —
  // showing a whole extra section header + empty-state card here is
  // redundant and pushes the actual results (what people most likely came
  // to see) below the fold. Hide the section entirely in that case so
  // results start right after the stat strip; show it normally once
  // there's something live to display.
  var liveSection = document.getElementById('live-section');
  if (liveSection) liveSection.style.display = liveSorted.length ? '' : 'none';
  document.getElementById('live-wrap').innerHTML = liveSorted.length
    ? liveSorted.map(function(m){ return matchCard(m, true); }).join('')
    : '';

  flashChangedScores();

  // Completed
  document.getElementById('done-wrap').innerHTML = COMPLETED.length
    ? COMPLETED.map(function(m){ return matchCard(m, false); }).join('')
    : '<div class="empty-state"><div class="empty-state-title">No results yet</div><div class="empty-state-body">Today\'s first results will appear here.</div></div>';
}

function getCountdown(target) {
  var diff = target.getTime() - Date.now();
  if (diff <= 0) return 'NOW';
  var d = Math.floor(diff / 86400000);
  var h = Math.floor((diff % 86400000) / 3600000);
  return d + 'd ' + h + 'h';
}

// ─── SCHEDULE ─────────────────────────────────────────────────────────────────

var fixturesCache = null; // cached full tournament fixture list from API

// Classify an API-Football round string into one of our stage filter buckets
function stageFromRound(round) {
  if (!round) return 'group';
  var r = round.toLowerCase();
  if (r.includes('final') && !r.includes('quarter') && !r.includes('semi')) return 'final';
  if (r.includes('semi'))   return 'sf';
  if (r.includes('quarter')) return 'qf';
  if (r.includes('16'))     return 'r16';
  if (r.includes('32'))     return 'r32';
  if (r.includes('group'))  return 'group';
  return 'group';
}

// API-Football's round string for group matches is like "Group E - 2"
// (group letter PLUS a trailing matchday number) — not just "Group E".
// A naive .replace('Group ','') leaves "E - 2", which then never matches
// the standings table's clean single-letter keys ("A".."L"), silently
// breaking any code that needs to look up a team's group. This extracts
// just the letter, ignoring the matchday suffix.
function groupLetterFromRound(round) {
  if (!round) return '';
  var match = round.match(/Group\s+([A-L])\b/i);
  return match ? match[1].toUpperCase() : round.replace('Group ','');
}

async function fetchFixtures() {
  if (!LIVE_API_ENABLED) return null;
  try {
    var res = await fetch('/api/fixtures?league=' + API_LEAGUE + '&season=' + API_SEASON);
    var data = await res.json();
    if (data.error) {
      console.error('Summer of Soccer — fixtures error:', data.error, data);
      throw new Error(data.error);
    }
    if (!Array.isArray(data.response)) throw new Error('Unexpected fixtures shape');

    return data.response
      .filter(function(f){ return f.league && Number(f.league.id) === Number(API_LEAGUE); })
      .map(function(f) {
      var kickoff = new Date(f.fixture.date);
      var isDone  = f.fixture.status.short === 'FT' || f.fixture.status.short === 'AET' || f.fixture.status.short === 'PEN';
      var isLive  = ['1H','2H','HT','ET','P','BT'].includes(f.fixture.status.short);
      var round   = f.league.round || '';
      return {
        id: f.fixture.id,
        h: f.teams.home.name, hc: teamCodeFromApi(f.teams.home),
        a: f.teams.away.name, ac: teamCodeFromApi(f.teams.away),
        g: round.replace('Group ',''),
        stage: stageFromRound(round),
        // Use the viewer's own locale and local timezone (by omitting an
        // explicit locale/timeZone, both APIs fall back to the browser's
        // own settings) rather than a hardcoded US-Eastern time — someone
        // in London shouldn't have to mentally convert from "4:00 PM ET".
        date: kickoff.toLocaleDateString(undefined, { weekday:'short', month:'short', day:'numeric' }),
        t: kickoff.toLocaleTimeString(undefined, { hour:'numeric', minute:'2-digit' }),
        status: f.fixture.status.short,
        isDone: isDone,
        isLive: isLive,
        hs: f.goals.home,
        as: f.goals.away,
        elapsed: f.fixture.status.elapsed,
        _sortKey: kickoff.getTime()
      };
    }).sort(function(a,b){ return a._sortKey - b._sortKey; });
  } catch (e) {
    return null;
  }
}

function stageLabel(f) {
  if (f.stage === 'group') return 'Group ' + f.g;
  var match = SCHED_STAGES.find(function(s){ return s.id === f.stage; });
  return match ? match.label : '';
}

function fixtureRow(f, mine) {
  var clickable = f.isDone ? ' onclick="openMatchDetail(' + f.id + ')" style="cursor:pointer"' : '';
  var centerHtml;
  var stageHtml = '<div class="fix-grp">' + stageLabel(f) + '</div>';

  if (f.isDone) {
    centerHtml =
      '<span class="fix-score">' + f.hs + '\u2013' + f.as + '</span>' +
      '<span class="fix-ft-badge">FULL TIME</span>' +
      stageHtml;
  } else if (f.isLive) {
    centerHtml =
      '<span class="fix-score live">' + f.hs + '\u2013' + f.as + '</span>' +
      '<span class="fix-live-badge">' + (f.elapsed || 0) + '\' LIVE</span>' +
      stageHtml;
  } else {
    // Time is the primary signal here (date is already the section header
    // above this row), stage is secondary, per request.
    centerHtml =
      '<span class="fix-time">' + f.t + '</span>' +
      stageHtml;
  }

  return '<div class="fix-card' + (mine ? ' mine' : '') + (f.isDone ? ' fix-tappable' : '') + '"' + clickable + '>' +
    '<div class="fix-t" onclick="event.stopPropagation();openTeam(\'' + f.hc + '\')" style="cursor:pointer">' + ff(f.hc, 28, 20) + ' ' + f.h + '</div>' +
    '<div class="fix-c">' + centerHtml + '</div>' +
    '<div class="fix-t r" onclick="event.stopPropagation();openTeam(\'' + f.ac + '\')" style="cursor:pointer">' + ff(f.ac, 28, 20) + ' ' + f.a + '</div>' +
    '</div>';
}

var schedStage = 'ALL'; // current schedule stage filter

var SCHED_STAGES = [
  { id: 'ALL',   label: 'All' },
  { id: 'group', label: 'Groups' },
  { id: 'r32',   label: 'Last 32' },
  { id: 'r16',   label: 'Last 16' },
  { id: 'qf',    label: 'QF' },
  { id: 'sf',    label: 'SF' },
  { id: 'final', label: 'Final' },
];

function schedStageFilter(stage) {
  schedStage = stage;
  renderScheduleList();
  // Sync active state on the buttons
  document.querySelectorAll('.sched-stage-btn').forEach(function(b) {
    b.classList.toggle('on', b.getAttribute('data-stage') === stage);
  });
}

function renderScheduleList() {
  var listEl = document.getElementById('sched-list');
  if (!listEl || !fixturesCache) return;

  var fixtures = schedStage === 'ALL'
    ? fixturesCache
    : fixturesCache.filter(function(f){ return f.stage === schedStage; });

  var mn   = myTeamNames();
  var mine = fixtures.filter(function(f){ return mn.includes(f.h) || mn.includes(f.a); });
  var html = '';

  if (mine.length) {
    html += sec('Your fixtures');
    html += mine.map(function(f){ return fixtureRow(f, true); }).join('');
  }
  html += sec('Full schedule');

  if (!fixtures.length) {
    html += '<div class="empty-state"><div class="empty-state-title">No fixtures yet</div>' +
      '<div class="empty-state-body">This stage hasn\u2019t been scheduled yet \u2014 check back once earlier rounds conclude.</div></div>';
  } else {
    var byDate = {};
    fixtures.forEach(function(f){
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
  }

  listEl.innerHTML = html;
}

async function buildSchedule(silent) {
  var pane = document.getElementById('p-sched');
  if (!pane) return;

  var isFirstBuild = !pane.querySelector('.sched-stage-bar, .empty-state');
  var scrollPos = pane.scrollTop;
  if (!silent || isFirstBuild) {
    pane.innerHTML = '<div class="empty-state"><div class="empty-state-title">Loading schedule…</div></div>';
  }

  fixturesCache = await fetchFixtures();

  if (!fixturesCache) {
    pane.innerHTML = '<div class="empty-state">' +
      '<div class="empty-state-title">Live schedule not available</div>' +
      '<div class="empty-state-body">The full fixture list will appear here once the tournament data feed is connected.</div>' +
    '</div>';
    return;
  }

  // Always show every stage tab, even before the knockout bracket exists.
  // API-Football (unlike some providers) doesn't pre-populate Round of 32+
  // with placeholder fixtures — those rows only appear once the actual
  // qualifying teams are confirmed after group stage ends. Showing the
  // tabs upfront lets people see the tournament structure and know to
  // check back, with renderScheduleList()'s existing empty state handling
  // the "nothing scheduled yet" case per stage.
  var stageBtns = SCHED_STAGES
    .map(function(s) {
      return '<button class="sched-stage-btn' + (s.id === schedStage ? ' on' : '') + '" data-stage="' + s.id + '" onclick="schedStageFilter(\'' + s.id + '\')">' + s.label + '</button>';
    }).join('');

  pane.innerHTML =
    '<div class="sched-stage-bar">' + stageBtns + '</div>' +
    '<div id="sched-list"></div>';

  renderScheduleList();

  if (silent && !isFirstBuild) pane.scrollTop = scrollPos;
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
      var letter = groupLetterFromRound(label) || label;
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

async function toggleGroupsLive(btn) {
  groupsShowLive = !groupsShowLive;
  btn.textContent = groupsShowLive ? '● LIVE' : 'LIVE VIEW';
  btn.classList.toggle('live-toggle-on', groupsShowLive);

  if (groupsShowLive) {
    // LIVE_MATCHES is otherwise only refreshed by the 60s background poll
    // or a pull-to-refresh — without this, switching the toggle on could
    // silently show stale (or, right after launch, completely empty)
    // in-progress match data instead of what's actually happening right now.
    btn.textContent = '● Loading…';
    await fetchLiveData();
    btn.textContent = '● LIVE';
  }

  buildGroups();
}

// The official /standings endpoint can lag behind individual match results
// for a while after a game ends — the result itself is already correct via
// /fixtures, but the provider's aggregate table recompute can trail by
// minutes. To make sure the table is never visibly wrong/stale once a
// match has finished, we overlay today's in-progress AND just-completed
// matches on top of the official standings.
//
// To avoid double-counting once /standings catches up on its own, we
// remember each team's "played" count from the last time we fetched
// standings (prevPlayedByTeam). If the official count has already gone up
// for both teams in a finished match, that means /standings has already
// absorbed this result — so we skip applying it again on top.
//
// The groupsShowLive toggle still controls whether *in-progress* (not yet
// final) matches are projected onto the table — that part is genuinely
// optional/speculative ("what if this game ended right now"). Applying a
// match that has ALREADY finished is not speculative, so that correction
// always runs regardless of the toggle.
var prevPlayedByTeam = {}; // team code -> played count, from the last fetched standings snapshot

function getAdjustedGroups(groups) {
  var matchesToApply = COMPLETED.slice(); // always apply finished-today results
  if (groupsShowLive) {
    matchesToApply = matchesToApply.concat(LIVE_MATCHES); // optionally also project in-progress games
  }

  var adj = {};
  Object.entries(groups).forEach(function(e) {
    adj[e[0]] = e[1].map(function(t){ return Object.assign({},t); });
  });

  if (matchesToApply.length) {
    matchesToApply.forEach(function(m) {
      if (m.stage && m.stage !== 'group') return; // knockout matches don't affect group standings
      var grp = adj[m.g];
      if (!grp) return;
      var home = grp.find(function(t){ return t.c === m.hc; });
      var away = grp.find(function(t){ return t.c === m.ac; });
      if (!home || !away) return;

      // If both teams' official played-count has already increased since
      // we last checked, /standings has caught up and already includes
      // this result on its own — applying it again would double-count it.
      var homePrevP = prevPlayedByTeam[m.hc];
      var awayPrevP = prevPlayedByTeam[m.ac];
      var alreadyCaughtUp =
        homePrevP !== undefined && awayPrevP !== undefined &&
        home.p > homePrevP && away.p > awayPrevP;
      if (alreadyCaughtUp) return;

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
  }

  // Snapshot this fetch's official played-counts for next time's comparison.
  Object.values(groups).forEach(function(teams) {
    teams.forEach(function(t) { prevPlayedByTeam[t.c] = t.p; });
  });

  return adj;
}

async function buildGroups(silent) {
  var mn = myTeamNames();
  var pane = document.getElementById('p-groups');
  if (!pane) return;

  // Silent refreshes (background poll, returning to an already-built tab)
  // skip the loading flash and preserve scroll position — a full wipe-and-
  // reload every time would be jarring if someone's mid-read. Only show
  // the loading state on a genuine first build (empty pane).
  var isFirstBuild = !pane.querySelector('.grp-block, .groups-toolbar, .empty-state');
  var scrollPos = pane.scrollTop;
  if (!silent || isFirstBuild) {
    pane.innerHTML = '<div class="empty-state"><div class="empty-state-title">Loading standings…</div></div>';
  }

  standingsCache = await fetchStandings();

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

  // Restore scroll position on a silent (background) refresh so the person
  // isn't jumped back to the top of the table mid-read.
  if (silent && !isFirstBuild) pane.scrollTop = scrollPos;
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

function statsRow(rank, code, name, sub, val, valClass, isMineRow, playerName) {
  var rc = rank===1?'g':rank===2?'s':rank===3?'b':'';
  // playerName is passed for scorer/assist rows so we can look up a profile;
  // team-only rows (e.g. all-time records list) pass nothing and stay inert.
  var hasProfile = playerName && typeof findPlayer === 'function' && !!findPlayer(code, playerName);
  var tapAttr = hasProfile ? ' onclick="openPlayer(\'' + code + '\',\'' + playerName.replace(/'/g,"\\'") + '\')" style="cursor:pointer"' : '';
  var tapCls  = hasProfile ? ' stats-row-tappable' : '';
  return '<div class="stats-row' + (isMineRow?' mine':'') + tapCls + '"' + tapAttr + '>' +
    '<div class="stats-rank' + (rc?' '+rc:'') + '">' + rank + '</div>' +
    ff(code, 28, 20) +
    '<div class="stats-info">' +
      '<div class="stats-name">' + name + (hasProfile ? ' <span class="stats-row-arrow">›</span>' : '') + '</div>' +
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
    html += statsRow(i+1, p.team, p.name, sub, p.goals, 'goals', mn.includes(t?t.n:''), p.name);
  });
  html += '</div>';

  // ── TOP ASSISTS ──
  html += '<div class="stats-section">' +
    '<div class="stats-section-hd"><div class="stats-section-title">🎯 Top Assists</div></div>';
  s.assistList.forEach(function(p, i) {
    var t = TEAMS.find(function(x){return x.c===p.team;});
    html += statsRow(i+1, p.team, p.name, t?t.n:p.team, p.assists, 'assists', mn.includes(t?t.n:''), p.name);
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

// ─── PULL TO REFRESH ──────────────────────────────────────────────────────────

var ptrStartY = 0;
var ptrDragging = false;
var ptrTriggered = false;
var PTR_THRESHOLD = 70;

// ─── SWIPE BETWEEN TABS ───────────────────────────────────────────────────────

function initTabSwipe() {
  var appScreen = document.getElementById('s-app');
  if (!appScreen) return;

  var startX = 0, startY = 0, tracking = false;

  appScreen.addEventListener('touchstart', function(e) {
    // Don't hijack swipes inside the Did You Know card (it has its own gesture)
    // or inside open overlays.
    if (e.target.closest('#dyk-card')) return;
    var teamOv   = document.getElementById('team-overlay');
    var playerOv = document.getElementById('player-overlay');
    if (teamOv && teamOv.classList.contains('open')) return;
    if (playerOv && playerOv.classList.contains('open')) return;
    var matchOv = document.getElementById('match-overlay');
    if (matchOv && matchOv.classList.contains('open')) return;

    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    tracking = true;
  }, { passive: true });

  appScreen.addEventListener('touchend', function(e) {
    if (!tracking) return;
    tracking = false;
    var dx = e.changedTouches[0].clientX - startX;
    var dy = e.changedTouches[0].clientY - startY;
    if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.5) return;

    swipeToTab(dx < 0 ? 1 : -1);
  }, { passive: true });
}

function initPullToRefresh() {
  var appScreen = document.getElementById('s-app');
  var indicator = document.getElementById('ptr-indicator');
  if (!appScreen || !indicator) return;

  appScreen.addEventListener('touchstart', function(e) {
    // Only allow pull-to-refresh when the page is scrolled to the very top
    if (window.scrollY > 4) return;
    // Don't start tracking a pull gesture if the touch began on a tappable
    // card/row — otherwise a normal tap that has a few pixels of incidental
    // drift can trigger a refresh mid-tap, destroying the element being
    // tapped before its click event fires.
    if (e.target.closest('.match-card, .fix-card, .stats-row, .ctry-tile, .grp-tbl tr, .td-player, .bnav-btn, .sched-stage-btn, .rbtn')) return;

    ptrStartY = e.touches[0].clientY;
    ptrDragging = true;
    ptrTriggered = false;
  }, { passive: true });

  appScreen.addEventListener('touchmove', function(e) {
    if (!ptrDragging) return;
    var dy = e.touches[0].clientY - ptrStartY;
    if (dy <= 0) { return; }
    if (window.scrollY > 4) { ptrDragging = false; return; }

    var pull = Math.min(dy * 0.45, 90);
    // Indicator is now centered on screen rather than drag-following, so it
    // only appears once the release threshold is actually reached — a
    // small visual confirmation that "yes, releasing now will refresh",
    // rather than tracking finger position the whole way down.
    var willTrigger = pull > PTR_THRESHOLD;
    if (willTrigger && !ptrTriggered) {
      indicator.classList.add('visible');
      indicator.querySelector('.ptr-label').textContent = 'Release to refresh';
    } else if (!willTrigger && ptrTriggered) {
      indicator.classList.remove('visible');
      indicator.querySelector('.ptr-label').textContent = 'Pull to refresh';
    }
    ptrTriggered = willTrigger;
  }, { passive: true });

  appScreen.addEventListener('touchend', function() {
    if (!ptrDragging) return;
    ptrDragging = false;
    indicator.classList.remove('visible');

    if (ptrTriggered) {
      doRefresh();
    }
  }, { passive: true });
}

function doRefresh() {
  var indicator = document.getElementById('ptr-indicator');
  if (!indicator) return;

  // Never refresh while an overlay is open — the person is reading detail,
  // not browsing the list, and a mid-read rebuild would be jarring/lossy.
  var teamOv  = document.getElementById('team-overlay');
  var playerOv = document.getElementById('player-overlay');
  var matchOv  = document.getElementById('match-overlay');
  if ((teamOv && teamOv.classList.contains('open')) ||
      (playerOv && playerOv.classList.contains('open')) ||
      (matchOv && matchOv.classList.contains('open'))) {
    return;
  }

  indicator.classList.add('visible', 'refreshing');
  indicator.querySelector('.ptr-label').textContent = 'Refreshing…';

  // Invalidate caches so the active tab re-fetches fresh data
  statsCache = null;
  standingsCache = null;
  fixturesCache = null;

  var activeTab = document.querySelector('.bnav-btn.on');
  var tabId = activeTab ? activeTab.getAttribute('onclick').match(/tab\('(\w+)'/)[1] : 'live';

  var refreshPromise;
  if (tabId === 'live')        refreshPromise = fetchLiveData();
  else if (tabId === 'sched')  refreshPromise = buildSchedule();
  else if (tabId === 'groups') refreshPromise = buildGroups();
  else if (tabId === 'stats')  refreshPromise = buildStats();
  else { buildTicker(); refreshPromise = Promise.resolve(); }

  Promise.resolve(refreshPromise).finally(function() {
    setTimeout(function() {
      indicator.classList.remove('visible', 'refreshing');
    }, 400);
  });
}


renderPick('ALL');
startCountdown();
initPullToRefresh();
initTabSwipe();

// If the person has previously picked teams, skip straight to the app —
// they can still tap "Change Teams" in the header to come back and edit.
if (chosen.length > 0) {
  launch();
}

// Hide the loading screen once the initial UI is ready. A small minimum
// display time avoids an unpleasant flash on fast connections while still
// feeling instant on slower ones. The exit transition (scale + fade, see
// CSS) is timed to feel like one continuous motion with the content
// underneath animating in, rather than an abrupt cut.
(function hideLoadingScreen() {
  var loading = document.getElementById('s-loading');
  if (!loading) return;
  var MIN_DISPLAY_MS = 400;
  var EXIT_TRANSITION_MS = 500; // must match #s-loading's CSS transition duration
  setTimeout(function() {
    loading.classList.add('hidden');
    // After the fade-out transition finishes, fully remove it from layout/
    // paint so there's no possibility of it visually bleeding through on
    // top of the app (e.g. if a refresh happens mid-transition).
    setTimeout(function() {
      loading.style.display = 'none';
    }, EXIT_TRANSITION_MS + 50);
  }, MIN_DISPLAY_MS);
})();

// ─── ADD TO HOME SCREEN PROMPT ──────────────────────────────────────────────

var deferredInstallPrompt = null; // Android/Chrome's captured beforeinstallprompt event
var INSTALL_DISMISSED_KEY = 'sos_install_dismissed';
var INSTALL_ENGAGEMENT_MS = 25000; // show after ~25s of active use, not immediately on load

function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true; // iOS Safari's own standalone flag
}

function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

// Chrome/Android fires this when the app meets installability criteria.
// Capture it (and prevent the browser's own default mini-prompt) so we can
// trigger it ourselves at a better moment.
window.addEventListener('beforeinstallprompt', function(e) {
  e.preventDefault();
  deferredInstallPrompt = e;
});

window.addEventListener('appinstalled', function() {
  deferredInstallPrompt = null;
  hideInstallBanner();
  try { localStorage.setItem(INSTALL_DISMISSED_KEY, '1'); } catch (e) {}
});

function showInstallBanner() {
  if (isStandalone()) return; // already installed/running standalone — never show
  try {
    if (localStorage.getItem(INSTALL_DISMISSED_KEY) === '1') return;
  } catch (e) {}

  // Don't interrupt someone reading a team/player/match detail overlay.
  var overlayOpen = ['team-overlay', 'player-overlay', 'match-overlay'].some(function(id) {
    var el = document.getElementById(id);
    return el && el.classList.contains('open');
  });
  if (overlayOpen) {
    setTimeout(showInstallBanner, 5000); // try again shortly rather than losing the opportunity entirely
    return;
  }

  var banner = document.getElementById('install-banner');
  if (!banner) return;

  if (isIOS()) {
    // Safari has no programmatic install API — show instructions instead
    // of an "Add" button that would have nothing to trigger.
    document.getElementById('install-banner-body').textContent =
      'Tap the Share button, then "Add to Home Screen".';
    document.getElementById('install-banner-action').style.display = 'none';
  } else if (deferredInstallPrompt) {
    document.getElementById('install-banner-body').textContent =
      'Get the full-screen app experience — no browser bar, faster loading.';
    document.getElementById('install-banner-action').style.display = '';
  } else {
    // Not iOS, and Chrome hasn't (yet, or won't) offer beforeinstallprompt —
    // nothing useful to show.
    return;
  }

  banner.classList.add('visible');
}

function hideInstallBanner() {
  var banner = document.getElementById('install-banner');
  if (banner) banner.classList.remove('visible');
}

function dismissInstallBanner() {
  hideInstallBanner();
  try { localStorage.setItem(INSTALL_DISMISSED_KEY, '1'); } catch (e) {}
}

async function handleInstallClick() {
  if (!deferredInstallPrompt) { hideInstallBanner(); return; }
  hideInstallBanner();
  deferredInstallPrompt.prompt();
  try {
    await deferredInstallPrompt.userChoice;
  } catch (e) {}
  deferredInstallPrompt = null;
  try { localStorage.setItem(INSTALL_DISMISSED_KEY, '1'); } catch (e) {}
}

// Trigger after a period of genuine engagement rather than immediately on
// load — much better accepted by people, and is the pattern recommended by
// both Google's and Apple's own PWA install guidance. Called from launch()
// so the timer reflects actual time using the app, not time on the picker.
var _installPromptScheduled = false;
function scheduleInstallPrompt() {
  if (_installPromptScheduled) return; // only ever schedule once per session
  _installPromptScheduled = true;
  setTimeout(showInstallBanner, INSTALL_ENGAGEMENT_MS);
}

// Covers the case where someone reloads the page with a team selection
// already saved — launch() runs immediately on page load in that path too
// (see the bottom of this file), so this still anchors correctly to app
// entry rather than literal page load in every scenario.

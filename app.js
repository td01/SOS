// ─── STATE ─────────────────────────────────────────────────────────────────────

let chosen = [];    // array of team codes the user has selected
let curRgn = 'ALL'; // active region filter

// ─── PICK SCREEN ───────────────────────────────────────────────────────────────

function renderPick(region) {
  const list = region === 'ALL' ? TEAMS : TEAMS.filter(t => t.r === region);
  document.getElementById('ctry-list').innerHTML = list.map(t => `
    <div class="ctry-tile${chosen.includes(t.c) ? ' on' : ''}" onclick="toggleTeam('${t.c}')">
      ${ff(t.c, 40, 28)}
      <div class="ctry-n">${t.n}</div>
    </div>`).join('');

  const n = chosen.length;
  document.getElementById('pick-cnt').textContent =
    n === 0 ? 'None selected' : n === 1 ? '1 team selected' : `${n} teams selected`;
  document.getElementById('go-btn').disabled = n === 0;
}

function toggleTeam(code) {
  const i = chosen.indexOf(code);
  if (i > -1) chosen.splice(i, 1);
  else chosen.push(code);
  renderPick(curRgn);
}

function rgn(r, btn) {
  curRgn = r;
  document.querySelectorAll('.rbtn').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  renderPick(r);
}

// ─── NAVIGATION ────────────────────────────────────────────────────────────────

function launch() {
  document.getElementById('s-pick').style.display = 'none';
  document.getElementById('s-app').style.display = 'block';

  // Render the team pill bar
  const myTeams = TEAMS.filter(t => chosen.includes(t.c));
  document.getElementById('pill-bar').innerHTML = myTeams
    .map(t => `<div class="team-pill">${ff(t.c, 22, 15)}<span class="team-pill-n">${t.n}</span></div>`)
    .join('');

  // Build all tab content
  buildLive();
  buildSchedule();
  buildGroups();
  buildHistory();
}

function back() {
  document.getElementById('s-app').style.display = 'none';
  document.getElementById('s-pick').style.display = 'block';
}

function tab(id, btn) {
  document.querySelectorAll('.pane').forEach(p => p.classList.remove('on'));
  document.getElementById('p-' + id).classList.add('on');
  document.querySelectorAll('.bnav-btn').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
}

// ─── HELPERS ───────────────────────────────────────────────────────────────────

function myTeamNames() {
  return TEAMS.filter(t => chosen.includes(t.c)).map(t => t.n);
}

function isMine(match) {
  const mn = myTeamNames();
  return mn.includes(match.h) || mn.includes(match.a);
}

// ─── LIVE TAB ──────────────────────────────────────────────────────────────────

function matchCard(m, live) {
  const mine = isMine(m);
  const cls  = live ? (mine ? 'live-mine' : 'live') : (mine ? 'done-mine' : 'done');
  const badge = live ? `${m.min}' live` : 'Full time';

  return `
    <div class="match-card ${cls}">
      <div class="mc-badge">${badge}</div>
      <div class="mc-teams">
        <div class="mc-t">
          ${ff(m.hc, 32, 22)}
          <div class="mc-tn">${m.h}</div>
        </div>
        <div>
          <div class="mc-score">${m.hs}–${m.as}</div>
          <div class="mc-min">${live ? 'live' : 'ft'}</div>
        </div>
        <div class="mc-t r">
          ${ff(m.ac, 32, 22)}
          <div class="mc-tn">${m.a}</div>
        </div>
      </div>
    </div>`;
}

function buildLive() {
  const myGameCount = [...LIVE_MATCHES, ...COMPLETED].filter(isMine).length;
  const totalGoals  = COMPLETED.reduce((s, m) => s + m.hs + m.as, 0) +
                      LIVE_MATCHES.reduce((s, m) => s + m.hs + m.as, 0);

  document.getElementById('stat-row').innerHTML = `
    <div class="stat-cell"><div class="stat-v hot">${LIVE_MATCHES.length}</div><div class="stat-l">Live now</div></div>
    <div class="stat-cell"><div class="stat-v">${LIVE_MATCHES.length + COMPLETED.length}</div><div class="stat-l">Today</div></div>
    <div class="stat-cell"><div class="stat-v hot">${myGameCount}</div><div class="stat-l">Your games</div></div>
    <div class="stat-cell"><div class="stat-v">${totalGoals}</div><div class="stat-l">Goals today</div></div>`;

  document.getElementById('live-wrap').innerHTML  = LIVE_MATCHES.map(m => matchCard(m, true)).join('');
  document.getElementById('done-wrap').innerHTML  = COMPLETED.map(m => matchCard(m, false)).join('');
}

// ─── SCHEDULE TAB ──────────────────────────────────────────────────────────────

function fixtureRow(f, mine) {
  return `
    <div class="fix-card${mine ? ' mine' : ''}">
      <div class="fix-t">${ff(f.hc, 20, 14)} ${f.h}</div>
      <div class="fix-c">
        <span class="fix-vs">vs</span>
        <span class="fix-time">${f.t}</span>
        <div class="fix-grp">Grp ${f.g}</div>
      </div>
      <div class="fix-t r">${ff(f.ac, 20, 14)} ${f.a}</div>
    </div>`;
}

function buildSchedule() {
  const mn    = myTeamNames();
  const mine  = FIXTURES.filter(f => mn.includes(f.h) || mn.includes(f.a));
  let html    = '';

  if (mine.length) {
    html += `<div class="sec">Your fixtures</div>`;
    html += mine.map(f => fixtureRow(f, true)).join('');
  }

  // Group remaining fixtures by date
  html += `<div class="sec">Full schedule</div>`;
  const byDate = {};
  FIXTURES.forEach(f => {
    if (!byDate[f.date]) byDate[f.date] = [];
    byDate[f.date].push(f);
  });
  Object.entries(byDate).forEach(([date, matches]) => {
    html += `<div class="day-lbl">${date}</div>`;
    html += matches.map(f => fixtureRow(f, mn.includes(f.h) || mn.includes(f.a))).join('');
  });

  document.getElementById('p-sched').innerHTML = html;
}

// ─── GROUPS TAB ────────────────────────────────────────────────────────────────

function buildGroups() {
  const mn = myTeamNames();

  document.getElementById('p-groups').innerHTML = Object.entries(GROUPS).map(([grp, rows]) => {
    const sorted = [...rows].sort((a, b) =>
      (b.pts - a.pts) || ((b.gf - b.ga) - (a.gf - a.ga))
    );
    return `
      <div class="grp-block">
        <div class="grp-hd"><div class="grp-title">Group ${grp}</div></div>
        <table class="grp-tbl">
          <tr>
            <th style="width:46%">Team</th>
            <th style="width:18%">P</th>
            <th style="width:18%">GD</th>
            <th style="width:18%">Pts</th>
          </tr>
          ${sorted.map((t, i) => `
            <tr class="${mn.includes(t.n) ? 'mine' : ''}">
              <td>
                <div class="t-name">
                  ${i < 2 ? '<span class="qdot"></span>' : ''}
                  <span style="width:16px;height:11px;display:inline-block;overflow:hidden;flex-shrink:0">${svgFlag(t.c, 16, 11)}</span>
                  ${t.n}
                </div>
              </td>
              <td>${t.p}</td>
              <td>${t.gf - t.ga}</td>
              <td class="t-pts">${t.pts}</td>
            </tr>`).join('')}
        </table>
      </div>`;
  }).join('');
}

// ─── HISTORY TAB ───────────────────────────────────────────────────────────────

function histRow(rank, code, name, detail, val, valClass) {
  const rankClass = rank === 1 ? 'g' : rank === 2 ? 's' : rank === 3 ? 'b' : '';
  return `
    <div class="hist-row">
      <div class="hist-rank${rankClass ? ' ' + rankClass : ''}">${rank}</div>
      <div class="h-info">
        ${ff(code, 22, 15)}
        <div style="min-width:0">
          <div class="h-name">${name}</div>
          <div class="h-det">${detail}</div>
        </div>
      </div>
      <div class="h-val${valClass ? ' ' + valClass : ''}">${val}</div>
    </div>`;
}

function buildHistory() {
  document.getElementById('p-hist').innerHTML = `
    <div class="sec">All-time top scorers</div>
    <div class="hist-block">
      <div class="hist-hd pink-bg"><div class="hist-hd-lbl">World Cup Goals — all time</div></div>
      ${ALL_TIME_SCORERS.map((s, i) => histRow(i + 1, s.c, s.n, `${s.c} · ${s.yrs}`, s.goals, '')).join('')}
    </div>

    <div class="sec">Golden Shoe — top scorer per tournament</div>
    <div class="hist-block">
      <div class="hist-hd purple-bg"><div class="hist-hd-lbl">Golden Shoe History</div></div>
      ${GOLDEN_SHOE.map((g, i) => histRow(i + 1, g.c, g.n, String(g.yr), g.goals, 'pur')).join('')}
    </div>

    <div class="sec">Most World Cup titles</div>
    <div class="hist-block">
      <div class="hist-hd yellow-bg"><div class="hist-hd-lbl" style="color:var(--ink)">Tournament Winners</div></div>
      ${TOURNAMENT_WINNERS.map((w, i) => histRow(i + 1, w.c, w.n, w.yrs, '×' + w.t, 'grn')).join('')}
    </div>

    <div class="sec">Records</div>
    <div class="rec-grid">
      ${RECORDS.map(r => `
        <div class="rec-tile">
          <div class="rec-t">${r.t}</div>
          <div class="rec-v">${r.v}</div>
          <div class="rec-d">${r.d}</div>
        </div>`).join('')}
    </div>`;
}

// ─── INIT ──────────────────────────────────────────────────────────────────────

renderPick('ALL');

// ─── TEAM DETAIL SCREEN ───────────────────────────────────────────────────────
// Handles opening/closing the team detail overlay and rendering squad + stats.

function openTeam(code) {
  const team   = TEAMS.find(t => t.c === code);
  const squad  = SQUADS[code];
  const groups = GROUPS[team ? team.g : null];
  const grpRow = groups ? groups.find(t => t.c === code) : null;
  const teamFixtures = FIXTURES.filter(f => f.hc === code || f.ac === code);

  const overlay = document.getElementById('team-overlay');
  const content = document.getElementById('team-content');

  // ── header ──
  const headerHtml = `
    <div class="td-header">
      <button class="td-close" onclick="closeTeam()" aria-label="Close">✕</button>
      <div class="td-flag">${svgFlag(code, 80, 56)}</div>
      <div class="td-title">${team ? team.n : code}</div>
      ${squad ? `<div class="td-mgr">Manager: <strong>${squad.manager}</strong></div>` : ''}
    </div>`;

  // ── quick stats strip ──
  const statsHtml = squad ? `
    <div class="td-stats-strip">
      <div class="td-stat"><div class="td-stat-v">${squad.prevBest}</div><div class="td-stat-l">Best finish</div></div>
      <div class="td-stat"><div class="td-stat-v">${squad.worldCups}</div><div class="td-stat-l">WC appearances</div></div>
      <div class="td-stat"><div class="td-stat-v">${squad.captain}</div><div class="td-stat-l">Captain</div></div>
    </div>` : '';

  // ── tournament info ──
  const infoHtml = (squad && squad.info) ? `
    <div class="td-info">${squad.info}</div>` : '';

  // ── group standing ──
  const grpHtml = (grpRow && team) ? `
    <div class="td-section-label">Group ${team.g} Standing</div>
    <div class="td-grp-row">
      <div class="td-grp-cell"><div class="td-grp-v">${grpRow.p}</div><div class="td-grp-l">Played</div></div>
      <div class="td-grp-cell"><div class="td-grp-v">${grpRow.w}</div><div class="td-grp-l">Won</div></div>
      <div class="td-grp-cell"><div class="td-grp-v">${grpRow.d}</div><div class="td-grp-l">Drawn</div></div>
      <div class="td-grp-cell"><div class="td-grp-v">${grpRow.l}</div><div class="td-grp-l">Lost</div></div>
      <div class="td-grp-cell"><div class="td-grp-v">${grpRow.gf}–${grpRow.ga}</div><div class="td-grp-l">Goals</div></div>
      <div class="td-grp-cell"><div class="td-grp-v hot">${grpRow.pts}</div><div class="td-grp-l">Points</div></div>
    </div>` : '';

  // ── fixtures ──
  const fixHtml = teamFixtures.length ? `
    <div class="td-section-label">Fixtures</div>
    ${teamFixtures.map(f => {
      const isHome = f.hc === code;
      const opp    = isHome ? f.a : f.h;
      const oppCode= isHome ? f.ac : f.hc;
      return `<div class="td-fixture">
        <div class="td-fix-opp">${ff(oppCode,24,17)} ${opp}</div>
        <div class="td-fix-meta">
          <span class="td-fix-venue">${isHome ? 'Home' : 'Away'}</span>
          <span class="td-fix-date">${f.date} · ${f.t}</span>
          <span class="td-fix-grp">Grp ${f.g}</span>
        </div>
      </div>`;
    }).join('')}` : '';

  // ── squad ──
  const posOrder = { GK:0, DF:1, MF:2, FW:3 };
  const posLabel  = { GK:'Goalkeepers', DF:'Defenders', MF:'Midfielders', FW:'Forwards' };

  let squadHtml = '';
  if (squad && squad.squad) {
    const sorted = [...squad.squad].sort((a,b) => posOrder[a.pos] - posOrder[b.pos]);
    let lastPos = null;
    sorted.forEach(p => {
      if (p.pos !== lastPos) {
        squadHtml += `<div class="td-pos-label">${posLabel[p.pos]}</div>`;
        lastPos = p.pos;
      }
      squadHtml += `
        <div class="td-player">
          <div class="td-player-name">${p.n}</div>
          <div class="td-player-meta">
            <span class="td-player-club">${p.club}</span>
            <span class="td-player-caps">${p.caps} caps</span>
          </div>
        </div>`;
    });
    squadHtml = `<div class="td-section-label">Squad</div><div class="td-squad">${squadHtml}</div>`;
  } else {
    squadHtml = `<div class="td-section-label">Squad</div>
      <div class="td-no-squad">Full squad data coming soon</div>`;
  }

  content.innerHTML = headerHtml + statsHtml + infoHtml + grpHtml + fixHtml + squadHtml;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeTeam() {
  document.getElementById('team-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

// Close on backdrop tap
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('team-overlay').addEventListener('click', function(e) {
    if (e.target === this) closeTeam();
  });
});

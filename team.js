// ─── TEAM & PLAYER DETAIL SCREENS ────────────────────────────────────────────

// ── TEAM OVERLAY ──────────────────────────────────────────────────────────────

function openTeam(code) {
  const team        = TEAMS.find(t => t.c === code);
  const squad       = SQUADS[code];
  const groups      = GROUPS[team ? team.g : null];
  const grpRow      = groups ? groups.find(t => t.c === code) : null;
  const teamFixtures= FIXTURES.filter(f => f.hc === code || f.ac === code);

  const overlay = document.getElementById('team-overlay');
  const content = document.getElementById('team-content');

  // Header
  const headerHtml = `
    <div class="td-header">
      <button class="td-close" onclick="closeTeam()" aria-label="Close">✕</button>
      <div class="td-flag">${svgFlag(code, 80, 56)}</div>
      <div class="td-title">${team ? team.n : code}</div>
      ${squad ? `<div class="td-mgr">Coach: <strong>${squad.manager}</strong></div>` : ''}
    </div>`;

  // Stats strip
  const statsHtml = squad ? `
    <div class="td-stats-strip">
      <div class="td-stat"><div class="td-stat-v">${squad.prevBest}</div><div class="td-stat-l">Best finish</div></div>
      <div class="td-stat"><div class="td-stat-v">${squad.worldCups}</div><div class="td-stat-l">WC appearances</div></div>
      <div class="td-stat"><div class="td-stat-v">${squad.captain}</div><div class="td-stat-l">Captain</div></div>
    </div>` : '';

  // Info blurb
  const infoHtml = (squad && squad.info) ? `<div class="td-info">${squad.info}</div>` : '';

  // Group standing
  const grpHtml = (grpRow && team) ? `
    <div class="td-section-label">Group ${team.g} Standing</div>
    <div class="td-grp-row">
      <div class="td-grp-cell"><div class="td-grp-v">${grpRow.p}</div><div class="td-grp-l">P</div></div>
      <div class="td-grp-cell"><div class="td-grp-v">${grpRow.w}</div><div class="td-grp-l">W</div></div>
      <div class="td-grp-cell"><div class="td-grp-v">${grpRow.d}</div><div class="td-grp-l">D</div></div>
      <div class="td-grp-cell"><div class="td-grp-v">${grpRow.l}</div><div class="td-grp-l">L</div></div>
      <div class="td-grp-cell"><div class="td-grp-v">${grpRow.gf}–${grpRow.ga}</div><div class="td-grp-l">Goals</div></div>
      <div class="td-grp-cell"><div class="td-grp-v hot">${grpRow.pts}</div><div class="td-grp-l">Pts</div></div>
    </div>` : '';

  // Fixtures
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

  // Squad — grouped by position, each player tappable
  const posOrder = { GK:0, DF:1, MF:2, FW:3 };
  const posLabel  = { GK:'Goalkeepers', DF:'Defenders', MF:'Midfielders', FW:'Forwards' };
  const posColor  = { GK:'var(--purple)', DF:'var(--ink)', MF:'#2a5298', FW:'var(--pink)' };

  let squadHtml = '';
  if (squad && squad.squad) {
    const sorted = [...squad.squad].sort((a,b) => posOrder[a.pos] - posOrder[b.pos]);
    let lastPos = null;
    sorted.forEach(p => {
      if (p.pos !== lastPos) {
        squadHtml += `<div class="td-pos-label" style="background:${posColor[p.pos]}">${posLabel[p.pos]}</div>`;
        lastPos = p.pos;
      }
      const hasProfile = !!findPlayer(code, p.n);
      squadHtml += `
        <div class="td-player${hasProfile ? ' tappable' : ''}" ${hasProfile ? `onclick="openPlayer('${code}','${p.n.replace(/'/g,'\\\'')}')"` : ''}>
          <div class="td-player-name">${p.n}${hasProfile ? ' <span class="td-player-arrow">›</span>' : ''}</div>
          <div class="td-player-meta">
            <span class="td-player-club">${p.club}</span>
            <span class="td-player-caps">${p.caps} caps</span>
          </div>
        </div>`;
    });
    squadHtml = `<div class="td-section-label">Squad <span style="color:var(--pink);font-size:9px">Tap for profile</span></div><div class="td-squad">${squadHtml}</div>`;
  } else {
    squadHtml = `<div class="td-section-label">Squad</div><div class="td-no-squad">Full squad data coming soon</div>`;
  }

  content.innerHTML = headerHtml + statsHtml + infoHtml + grpHtml + fixHtml + squadHtml;
  overlay.classList.add('open');
  content.scrollTop = 0;
  document.body.style.overflow = 'hidden';
}

function closeTeam() {
  document.getElementById('team-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

// ── PLAYER OVERLAY ────────────────────────────────────────────────────────────

function openPlayer(teamCode, playerName) {
  const p = findPlayer(teamCode, playerName);
  if (!p) return;

  const teamFlag = svgFlag(teamCode, 24, 17);
  const overlay  = document.getElementById('player-overlay');
  const content  = document.getElementById('player-content');

  const statItems = [
    { v: p.age,        l: 'Age'          },
    { v: p.caps,       l: 'Caps'         },
    { v: p.intlGoals,  l: 'Intl goals'   },
    { v: p.wcGoals,    l: 'WC goals'     },
    { v: p.wcApps,     l: 'WC apps'      },
    { v: p.height,     l: 'Height'       },
  ];

  const factsHtml = p.facts.map(f =>
    `<div class="pp-fact"><span class="pp-fact-dot">●</span>${f}</div>`
  ).join('');

  const quoteHtml = p.quote ? `<div class="pp-quote">${p.quote}</div>` : '';

  const seasonStat = p.stats.clubGoals25_26
    ? `<div class="pp-season">
        <div class="pp-season-val">${p.stats.clubGoals25_26}</div>
        <div class="pp-season-label">Club goals 2025–26</div>
       </div>`
    : '';

  content.innerHTML = `
    <div class="pp-header">
      <button class="pp-back" onclick="closePlayer()" aria-label="Back">‹ Back</button>
      <div class="pp-number">${p.number || ''}</div>
    </div>
    <div class="pp-hero">
      <div class="pp-flag-wrap">${teamFlag}</div>
      <div class="pp-name">${p.full}</div>
      <div class="pp-meta">${p.pos} · ${p.club}</div>
    </div>
    <div class="pp-stats-grid">
      ${statItems.map(s => `
        <div class="pp-stat">
          <div class="pp-stat-v">${s.v}</div>
          <div class="pp-stat-l">${s.l}</div>
        </div>`).join('')}
    </div>
    ${seasonStat}
    ${quoteHtml}
    <div class="pp-section-label">Key facts</div>
    <div class="pp-facts">${factsHtml}</div>`;

  overlay.classList.add('open');
  content.scrollTop = 0;
}

function closePlayer() {
  document.getElementById('player-overlay').classList.remove('open');
}

// ── INIT ──────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  // Close team overlay on backdrop tap
  document.getElementById('team-overlay').addEventListener('click', function(e) {
    if (e.target === this) closeTeam();
  });
  // Close player overlay on backdrop tap
  document.getElementById('player-overlay').addEventListener('click', function(e) {
    if (e.target === this) closePlayer();
  });
});

// ─── TEAM & PLAYER DETAIL SCREENS ────────────────────────────────────────────

// ── TEAM OVERLAY ──────────────────────────────────────────────────────────────

function openTeam(code) {
  const team        = TEAMS.find(t => t.c === code);
  const squad       = SQUADS[code];
  const liveGroups  = (typeof standingsCache !== 'undefined' && standingsCache) ? standingsCache : null;
  const groups      = liveGroups ? liveGroups[team ? team.g : null] : null;
  const grpRow      = groups ? groups.find(t => t.c === code) : null;
  const liveFixtures = (typeof fixturesCache !== 'undefined' && fixturesCache) ? fixturesCache : [];
  const teamFixtures = liveFixtures.filter(f => f.hc === code || f.ac === code);

  const overlay = document.getElementById('team-overlay');
  const content = document.getElementById('team-content');

  // Header
  const headerHtml = `
    <div class="td-header">
      <button class="td-close" onclick="closeTeam()" aria-label="Close">✕</button>
      <div class="td-flag">${svgFlag(code, 100, 70)}</div>
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

  // Fixtures — completed matches show the score and open match detail on tap,
  // matching the same pattern used in the Schedule and Live tabs.
  const fixHtml = teamFixtures.length ? `
    <div class="td-section-label">Fixtures & Results</div>
    ${teamFixtures.map(f => {
      const isHome = f.hc === code;
      const opp    = isHome ? f.a : f.h;
      const oppCode= isHome ? f.ac : f.hc;
      const tapAttr = f.isDone ? ` onclick="openMatchDetail(${f.id})" style="cursor:pointer"` : '';
      const tapCls  = f.isDone ? ' td-fixture-tappable' : '';
      const resultHtml = f.isDone
        ? `<span class="td-fix-score">${f.hs}\u2013${f.as}</span><span class="td-fix-ft">FT</span>`
        : (f.isLive
            ? `<span class="td-fix-score live">${f.hs}\u2013${f.as}</span><span class="td-fix-live">${f.elapsed||0}' LIVE</span>`
            : `<span class="td-fix-date">${f.date} · ${f.t}</span>`);
      return `<div class="td-fixture${tapCls}"${tapAttr}>
        <div class="td-fix-opp">${ff(oppCode,32,22)} ${opp}</div>
        <div class="td-fix-meta">
          <span class="td-fix-venue">${isHome ? 'Home' : 'Away'}</span>
          ${resultHtml}
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
      // Every squad player is tappable: bespoke profile if we have one,
      // otherwise an auto-generated profile from their squad data.
      squadHtml += `
        <div class="td-player tappable" onclick="openPlayer('${code}','${p.n.replace(/'/g,"\\'")}')">
          <div class="td-player-name">${p.n} <span class="td-player-arrow">›</span></div>
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

  content.innerHTML = headerHtml + '<div class="td-body">' + statsHtml + infoHtml + grpHtml + fixHtml + squadHtml + '</div>';
  overlay.classList.add('open');
  content.querySelector('.td-body').scrollTop = 0;
  document.body.style.overflow = 'hidden';
}

function closeTeam() {
  document.getElementById('team-overlay').classList.remove('open');
  releaseScrollLockIfNoOverlaysOpen();
}

// Only clear the body scroll lock if every overlay is now closed — prevents
// closing an overlay opened on top of another (e.g. match detail opened
// from inside the team page) from accidentally unlocking scroll while the
// underlying overlay is still showing.
function releaseScrollLockIfNoOverlaysOpen() {
  var ids = ['team-overlay', 'player-overlay', 'match-overlay'];
  var anyOpen = ids.some(function(id) {
    var el = document.getElementById(id);
    return el && el.classList.contains('open');
  });
  if (!anyOpen) document.body.style.overflow = '';
}

// ── PLAYER OVERLAY ────────────────────────────────────────────────────────────

function openPlayer(teamCode, playerName) {
  const p = findPlayer(teamCode, playerName);
  if (!p) return;

  const teamFlag = svgFlag(teamCode, 32, 22);
  const overlay  = document.getElementById('player-overlay');
  const el       = document.getElementById('player-content');

  const statItems = [
    { v: p.age,        l: 'Age'        },
    { v: p.caps,       l: 'Caps'       },
    { v: p.intlGoals,  l: 'Intl goals' },
    { v: p.wcGoals,    l: 'WC goals'   },
    { v: p.wcApps,     l: 'WC apps'   },
    { v: p.height,     l: 'Height'     },
  ].filter(s => s.v !== null && s.v !== undefined);

  const factsHtml  = p.facts.map(f =>
    `<div class="pp-fact"><span class="pp-fact-dot">●</span>${f}</div>`
  ).join('');
  const quoteHtml  = p.quote ? `<div class="pp-quote">${p.quote}</div>` : '';
  const seasonStat = p.stats && p.stats.clubGoals25_26
    ? `<div class="pp-season">
         <div class="pp-season-val">${p.stats.clubGoals25_26}</div>
         <div class="pp-season-label">Club goals 2025–26</div>
       </div>`
    : '';

  // Build initial HTML — sticky header + scrollable body
  el.innerHTML = `
    <div class="pp-header">
      <button class="pp-back" onclick="closePlayer()" aria-label="Back">‹ Back</button>
      <div class="pp-number">${p.number || ''}</div>
    </div>
    <div class="pp-body">
    <div class="pp-hero">
      <div class="pp-photo-wrap">
        <div class="pp-photo-placeholder" id="pp-photo-placeholder">
          <svg viewBox="0 0 80 80" width="80" height="80" xmlns="http://www.w3.org/2000/svg">
            <circle cx="40" cy="30" r="18" fill="#ffffff30"/>
            <ellipse cx="40" cy="72" rx="28" ry="20" fill="#ffffff30"/>
          </svg>
        </div>
        <img id="pp-photo" class="pp-photo" style="display:none" alt="${p.full}"/>
      </div>
      <div class="pp-hero-text">
        <div class="pp-flag-wrap">${teamFlag}</div>
        <div class="pp-name">${p.full}</div>
        <div class="pp-meta">${p.pos} · ${p.club}</div>
      </div>
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
    <div class="pp-facts">${factsHtml}</div>
    <div class="pp-attribution">Images via <a href="https://en.wikipedia.org" target="_blank">Wikipedia</a> (CC-BY-SA) · editorial use</div>
    </div>`;

  overlay.classList.add('open');
  var ppBody = el.querySelector('.pp-body');
  if (ppBody) ppBody.scrollTop = 0;

  // Fetch Wikipedia thumbnail asynchronously
  fetchWikiImage(p.full);
}

function fetchWikiImage(name) {
  const url = 'https://en.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(name.replace(/ /g,'_'));
  fetch(url)
    .then(r => r.ok ? r.json() : null)
    .then(data => {
      const thumb = data && data.thumbnail && data.thumbnail.source;
      const img   = document.getElementById('pp-photo');
      const ph    = document.getElementById('pp-photo-placeholder');
      if (thumb && img) {
        img.src = thumb;
        img.onload = function() {
          img.style.display = 'block';
          if (ph) ph.style.display = 'none';
        };
        img.onerror = function() { /* keep placeholder */ };
      }
    })
    .catch(() => { /* keep placeholder */ });
}

function closePlayer() {
  document.getElementById('player-overlay').classList.remove('open');
  releaseScrollLockIfNoOverlaysOpen();
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
  // Close match overlay on backdrop tap
  var matchOv = document.getElementById('match-overlay');
  if (matchOv) {
    matchOv.addEventListener('click', function(e) {
      if (e.target === this) closeMatchDetail();
    });
  }

  initDragToDismiss('team-overlay', 'team-content', closeTeam);
  initDragToDismiss('player-overlay', 'player-content', closePlayer);
  initDragToDismiss('match-overlay', 'match-content', closeMatchDetail);
});

// ── DRAG TO DISMISS ───────────────────────────────────────────────────────────

function initDragToDismiss(overlayId, panelId, closeFn) {
  const overlay = document.getElementById(overlayId);
  const panel   = document.getElementById(panelId);
  if (!overlay || !panel) return;

  let startY = 0, currentDy = 0, dragging = false;
  const DISMISS_THRESHOLD = 120;

  panel.addEventListener('touchstart', function(e) {
    // Only start a panel drag if the inner scrollable body is at the top —
    // otherwise this would fight with normal content scrolling.
    const body = panel.querySelector('.td-body, .pp-body');
    if (body && body.scrollTop > 2) return;

    startY = e.touches[0].clientY;
    dragging = true;
    panel.classList.add('dragging');
  }, { passive: true });

  panel.addEventListener('touchmove', function(e) {
    if (!dragging) return;
    currentDy = e.touches[0].clientY - startY;
    if (currentDy < 0) currentDy = 0; // only allow dragging downward
    panel.style.transform = 'translateY(' + currentDy + 'px)';
    overlay.style.opacity = String(1 - Math.min(currentDy / 400, 0.6));
  }, { passive: true });

  panel.addEventListener('touchend', function() {
    if (!dragging) return;
    dragging = false;
    panel.classList.remove('dragging');
    overlay.style.opacity = '';

    if (currentDy > DISMISS_THRESHOLD) {
      closeFn();
    }
    panel.style.transform = '';
    currentDy = 0;
  }, { passive: true });
}

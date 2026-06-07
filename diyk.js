// ─── DID YOU KNOW? — TAB LOGIC ────────────────────────────────────────────────

var dykState = {
  cards:    [],    // current shuffled deck
  index:    0,     // current card index
  filter:   'ALL', // current category filter
  seen:     0,     // total cards seen this session
};

function initDyk() {
  dykState.cards = shuffleFacts(
    dykState.filter === 'ALL'
      ? FACTS
      : FACTS.filter(function(f){ return f.c === dykState.filter; })
  );
  dykState.index = 0;
  renderDyk();
}

function dykSetFilter(cat, btn) {
  dykState.filter = cat;
  document.querySelectorAll('.dyk-filter-btn').forEach(function(b){ b.classList.remove('on'); });
  btn.classList.add('on');
  initDyk();
}

function dykNext() {
  if (dykState.index < dykState.cards.length - 1) {
    dykState.index++;
    dykState.seen++;
  } else {
    // Reshuffle
    dykState.cards = shuffleFacts(dykState.cards);
    dykState.index = 0;
  }
  renderDyk();
  animateCard('next');
}

function dykPrev() {
  if (dykState.index > 0) {
    dykState.index--;
    renderDyk();
    animateCard('prev');
  }
}

function animateCard(dir) {
  var card = document.getElementById('dyk-card');
  if (!card) return;
  card.classList.remove('slide-in-left','slide-in-right');
  void card.offsetWidth; // force reflow
  card.classList.add(dir === 'next' ? 'slide-in-right' : 'slide-in-left');
}

// Touch/swipe handling
var dykTouchStartX = 0;
var dykTouchStartY = 0;

function dykTouchStart(e) {
  dykTouchStartX = e.touches[0].clientX;
  dykTouchStartY = e.touches[0].clientY;
}

function dykTouchEnd(e) {
  var dx = e.changedTouches[0].clientX - dykTouchStartX;
  var dy = e.changedTouches[0].clientY - dykTouchStartY;
  if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
    if (dx < 0) dykNext();
    else dykPrev();
  }
}

function renderDyk() {
  var pane = document.getElementById('p-dyk');
  if (!pane || !pane.classList.contains('on')) return;

  var fact  = dykState.cards[dykState.index];
  var total = dykState.cards.length;
  var idx   = dykState.index;
  var cat   = FACT_CATS[fact.c] || { label: fact.c, color: '#888' };
  var pct   = Math.round(((idx + 1) / total) * 100);

  var cardEl = document.getElementById('dyk-card');
  if (!cardEl) return;

  cardEl.style.borderTop = '4px solid ' + cat.color;
  cardEl.innerHTML =
    '<div class="dyk-cat" style="color:' + cat.color + '">' + cat.label.toUpperCase() + '</div>' +
    '<div class="dyk-title">' + fact.t + '</div>' +
    '<div class="dyk-body">' + fact.f + '</div>';

  // Counter + progress
  document.getElementById('dyk-counter').textContent = (idx + 1) + ' / ' + total;
  document.getElementById('dyk-progress-bar').style.width = pct + '%';
  document.getElementById('dyk-progress-bar').style.background = cat.color;

  // Prev button state
  var prevBtn = document.getElementById('dyk-prev-btn');
  if (prevBtn) prevBtn.style.opacity = idx === 0 ? '0.3' : '1';
}

function buildDyk() {
  var pane = document.getElementById('p-dyk');
  if (!pane) return;

  // Build filter bar
  var filters = '<div class="dyk-filters" id="dyk-filters">' +
    '<button class="dyk-filter-btn on" onclick="dykSetFilter(\'ALL\',this)">All</button>';
  Object.entries(FACT_CATS).forEach(function(entry){
    var k = entry[0], v = entry[1];
    filters += '<button class="dyk-filter-btn" onclick="dykSetFilter(\'' + k + '\',this)" style="--cat-color:' + v.color + '">' + v.label + '</button>';
  });
  filters += '</div>';

  pane.innerHTML =
    '<div class="dyk-progress"><div class="dyk-progress-bar" id="dyk-progress-bar"></div></div>' +
    filters +
    '<div class="dyk-stage">' +
      '<div class="dyk-card" id="dyk-card" ontouchstart="dykTouchStart(event)" ontouchend="dykTouchEnd(event)"></div>' +
    '</div>' +
    '<div class="dyk-controls">' +
      '<button class="dyk-ctrl-btn" id="dyk-prev-btn" onclick="dykPrev()" aria-label="Previous fact">‹</button>' +
      '<div class="dyk-counter" id="dyk-counter">1 / 0</div>' +
      '<button class="dyk-ctrl-btn" onclick="dykNext()" aria-label="Next fact">›</button>' +
    '</div>' +
    '<div class="dyk-hint">Swipe or tap arrows</div>';

  initDyk();
}

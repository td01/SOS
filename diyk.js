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

  // Attach touch listeners with passive:false so we can preventDefault
  setTimeout(function() {
    var card = document.getElementById('dyk-card');
    if (card && !card._touchBound) {
      card.addEventListener('touchstart', dykTouchStart, { passive:true });
      card.addEventListener('touchmove',  dykTouchMove,  { passive:false });
      card.addEventListener('touchend',   dykTouchEnd,   { passive:true });
      card._touchBound = true;
    }
  }, 50);
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
  // Clear any inline transform/opacity left over from a swipe-exit
  // animation — inline styles take precedence over CSS classes, so
  // without this the class-based slide-in below would be silently
  // overridden by whatever the drag/exit sequence last set.
  card.style.transform = '';
  card.style.opacity = '';
  card.style.transition = '';
  card.classList.remove('slide-in-left','slide-in-right');
  void card.offsetWidth; // force reflow
  card.classList.add(dir === 'next' ? 'slide-in-right' : 'slide-in-left');
}

// Touch/swipe handling — drag-responsive with visual feedback
var dykTouchStartX = 0;
var dykTouchStartY = 0;
var dykDragging = false;

function dykTouchStart(e) {
  dykTouchStartX = e.touches[0].clientX;
  dykTouchStartY = e.touches[0].clientY;
  dykDragging = false;
  var card = document.getElementById('dyk-card');
  if (card) card.style.transition = 'none'; // no easing while actively tracking the finger — only on release
}

function dykTouchMove(e) {
  var dx = e.touches[0].clientX - dykTouchStartX;
  var dy = e.touches[0].clientY - dykTouchStartY;
  // Only intercept horizontal swipes
  if (!dykDragging && Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 8) {
    dykDragging = true;
  }
  if (dykDragging) {
    e.preventDefault();
    var card = document.getElementById('dyk-card');
    if (card) {
      var clamped = Math.max(-160, Math.min(160, dx));
      // A touch of rotation tied to drag distance reads as more physical —
      // like tilting a real card — rather than a flat horizontal slide.
      var rotate = clamped * 0.04;
      card.style.transform = 'translateX(' + clamped + 'px) rotate(' + rotate + 'deg)';
      card.style.opacity = 1 - Math.abs(clamped) / 400;
    }
  }
}

function dykTouchEnd(e) {
  var card = document.getElementById('dyk-card');
  if (!dykDragging) {
    if (card) card.style.transition = '';
    return;
  }
  var dx = e.changedTouches[0].clientX - dykTouchStartX;
  var dy = e.changedTouches[0].clientY - dykTouchStartY;
  var cleared = Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 60;

  if (card) {
    card.style.transition = 'transform .28s cubic-bezier(.22,1,.36,1), opacity .28s';
    if (cleared) {
      // Let the card continue in the direction it was already being
      // dragged, out past the edge of the stage — completes the gesture
      // the person started instead of snapping back to center first and
      // then replaying a separate "next card" animation from scratch.
      var exitX = dx < 0 ? -440 : 440;
      var exitRotate = dx < 0 ? -14 : 14;
      card.style.transform = 'translateX(' + exitX + 'px) rotate(' + exitRotate + 'deg)';
      card.style.opacity = '0';
    } else {
      // Didn't clear the threshold — ease back to center rather than the
      // previous instant snap, which read as a glitch more than a release.
      card.style.transform = '';
      card.style.opacity = '';
    }
  }

  if (cleared) {
    // Wait for the exit animation to actually finish before swapping
    // content and animating the replacement in — keeps the motion
    // continuous instead of cutting the exit short.
    setTimeout(function() {
      if (dx < 0) dykNext(); else dykPrev();
      if (card) card.style.transition = 'none';
    }, 280);
  }

  dykDragging = false;
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
      '<div class="dyk-card" id="dyk-card"></div>' +
    '</div>' +
    '<div class="dyk-controls">' +
      '<button class="dyk-ctrl-btn" id="dyk-prev-btn" onclick="dykPrev()" aria-label="Previous fact">‹</button>' +
      '<div class="dyk-counter" id="dyk-counter">1 / 0</div>' +
      '<button class="dyk-ctrl-btn" onclick="dykNext()" aria-label="Next fact">›</button>' +
    '</div>' +
    '<div class="dyk-hint">Swipe or tap arrows</div>';

  initDyk();

  // Attach touch listeners with passive:false so we can preventDefault
  setTimeout(function() {
    var card = document.getElementById('dyk-card');
    if (card && !card._touchBound) {
      card.addEventListener('touchstart', dykTouchStart, { passive:true });
      card.addEventListener('touchmove',  dykTouchMove,  { passive:false });
      card.addEventListener('touchend',   dykTouchEnd,   { passive:true });
      card._touchBound = true;
    }
  }, 50);
}

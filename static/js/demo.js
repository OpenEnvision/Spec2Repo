/* Hero example: the alertmanager run of Section 4.2 and Appendix G (Claude Opus 5 with Claude Code).
   Shows only what the paper reports: 72 hidden tests, 69 pass, three capabilities, one missed behavior in each.
   Cell order is illustrative. */
(function () {
  const grid = document.getElementById('demo-grid');
  if (!grid) return;
  const TOTAL = 72, CAPS = 3;
  const BEH = [
    { t: 'Matcher round trip', sec: 'Representative Workflows',
      spec: 'A matcher printed with <code>String</code> and parsed again with <code>ParseMatcher</code> matches the same value.',
      agent: 'No test prints and reparses a matcher whose value needs escaping.' },
    { t: 'Receipt comparison', sec: 'Validation and comparison',
      spec: '<code>Equivalent</code> and <code>Diff</code> report every semantic difference between two lifecycles.',
      agent: 'Two receipts that differ in their receiver, but none that differ in a delivery error.' },
    { t: 'Group-key identity', sec: 'Lifecycle capture',
      spec: 'A captured receipt reconciles the group keys of its route and group facts.',
      agent: 'No test captures a group whose key no route produced.' },
  ];
  const FAIL = [23, 47, 71];              // one failing test per capability; positions are illustrative

  const cells = [];
  for (let k = 0; k < TOTAL; k++) {
    const c = document.createElement('span');
    c.className = 'cell';
    grid.appendChild(c);
    cells.push(c);
  }
  const beh = document.getElementById('demo-beh');
  const cards = BEH.map((b, i) => {
    const d = document.createElement('div');
    d.className = 'beh';
    d.innerHTML = `<div class="beh-top"><span class="beh-t">${b.t}</span><span class="cap-badge">pending</span></div>
      <div class="beh-sec">Specification · ${b.sec}</div>
      <div class="beh-spec">${b.spec}</div>
      <div class="beh-agent"><b>Agent's own tests:</b> ${b.agent}</div>`;
    beh.appendChild(d);
    const hl = (on) => { d.classList.toggle('hl', on); cells[FAIL[i]].classList.toggle('sel', on); };
    d.addEventListener('mouseenter', () => hl(true));
    d.addEventListener('mouseleave', () => hl(false));
    cells[FAIL[i]].addEventListener('mouseenter', () => hl(true));
    cells[FAIL[i]].addEventListener('mouseleave', () => hl(false));
    return d;
  });

  const $ = (id) => document.getElementById(id);
  const foot = $('demo-foot');
  let timer = null, step = 0;

  function update() {
    const passed = cells.filter((c) => c.classList.contains('pass')).length;
    const pr = (100 * passed) / TOTAL;
    $('m-pass').textContent = pr.toFixed(1) + '%';
    $('m-pass-sub').textContent = `${passed} / ${TOTAL} tests`;
    $('m-pass-bar').style.width = pr + '%';
    const lost = FAIL.filter((k) => cells[k].classList.contains('fail')).length;
    $('m-fcr').textContent = lost ? ((100 * (CAPS - lost)) / CAPS).toFixed(1) + '%' : '–';
    $('m-fcr-sub').textContent = `${lost ? CAPS - lost : 0} / ${CAPS} capabilities`;
    $('m-fcr-bar').style.width = lost ? (100 * (CAPS - lost)) / CAPS + '%' : '0%';
    FAIL.forEach((k, i) => {
      const f = cells[k].classList.contains('fail');
      cards[i].classList.toggle('lost', f);
      cards[i].querySelector('.cap-badge').textContent = f ? 'not delivered' : 'pending';
    });
  }

  function reset() {
    clearInterval(timer); timer = null; step = 0;
    cells.forEach((c) => c.classList.remove('pass', 'fail', 'sel'));
    update();
    foot.innerHTML = 'Running the hidden tests through the declared public interface…';
  }
  function mark(k) { cells[k].classList.add(FAIL.includes(k) ? 'fail' : 'pass'); }
  function finish() {
    clearInterval(timer); timer = null;
    while (step < TOTAL) mark(step++);
    update();
    foot.innerHTML = 'Before submitting, the agent ran its own suite and every test passed. Test pass rate credits the run with <strong>95.8%</strong>, ' +
      'while FCR counts the features a user can rely on, of which it delivers <strong>none</strong>.';
  }
  function tick() { if (step >= TOTAL) { finish(); return; } mark(step++); update(); }
  function play() { reset(); timer = setInterval(tick, 50); }

  $('demo-replay').addEventListener('click', play);
  $('demo-skip').addEventListener('click', finish);

  reset();
  foot.innerHTML = 'Press <strong>Run tests</strong>, or scroll here to start.';
  if ('IntersectionObserver' in window) {
    let started = false;
    new IntersectionObserver((es, ob) => {
      es.forEach((en) => { if (en.isIntersecting && !started) { started = true; play(); ob.disconnect(); } });
    }, { threshold: 0.45 }).observe(document.querySelector('.demo-wrap'));
  } else finish();
})();

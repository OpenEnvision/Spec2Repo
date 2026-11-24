/* FCR formula (KaTeX when available) and the interactive pass-rate / FCR / resolved toy. */
(function () {
  const f = document.getElementById('f-fcr');
  function tex() {
    if (window.katex && f) {
      katex.render('\\mathrm{FCR}(P) = \\frac{1}{|C|} \\sum_{c \\in C} \\prod_{t \\in T_c} r(t, P)', f, { displayMode: true, throwOnError: false });
    }
  }
  if (window.katex) tex(); else window.addEventListener('load', tex);

  const root = document.getElementById('toy');
  if (!root) return;
  const CAPS = [
    { name: 'Commit', n: 8 },
    { name: 'Rollback', n: 6 },
    { name: 'Query', n: 7 },
    { name: 'Export', n: 5 },
  ];
  const PRESETS = {
    one: [[5], [2], [6], [0]],
    few: [[], [1, 3, 4], [], []],
    all: [[], [], [], []],
  };
  let state = CAPS.map((c) => Array(c.n).fill(1));

  function apply(p) {
    state = CAPS.map((c, i) => Array.from({ length: c.n }, (_, j) => (PRESETS[p][i].includes(j) ? 0 : 1)));
    render();
  }

  function render() {
    root.innerHTML = '';
    let pass = 0, tot = 0, caps = 0;
    state.forEach((tests, ci) => {
      const row = document.createElement('div');
      row.className = 'toy-row';
      const ok = tests.every(Boolean);
      caps += ok ? 1 : 0;
      row.innerHTML = `<span class="lbl">${CAPS[ci].name}</span><span class="cells"></span><span class="st ${ok ? 'ok' : 'no'}">${ok ? 'delivered' : 'lost'}</span>`;
      const cells = row.querySelector('.cells');
      tests.forEach((v, ti) => {
        pass += v; tot++;
        const s = document.createElement('span');
        s.className = 'cell ' + (v ? 'pass' : 'fail');
        s.addEventListener('click', () => { state[ci][ti] = 1 - state[ci][ti]; render(); });
        cells.appendChild(s);
      });
      root.appendChild(row);
    });
    document.getElementById('toy-pass').textContent = ((100 * pass) / tot).toFixed(1) + '%';
    document.getElementById('toy-fcr').textContent = ((100 * caps) / CAPS.length).toFixed(0) + '%';
    document.getElementById('toy-res').textContent = caps === CAPS.length ? 'yes' : 'no';
  }

  document.querySelectorAll('.toy-btns button').forEach((b) => b.addEventListener('click', () => apply(b.dataset.preset)));
  apply('one');
})();

/* Task explorer: 12 configurations x 150 tasks heatmap, grouped by language, with a pinned detail card. */
(function () {
  const S = window.S2R;
  const svg = document.getElementById('hm-svg');
  if (!svg || !S.tasks) return;
  const el = S.el;
  const T = S.tasks, C = S.configs;
  let lang = 'all', sort = 'mean', query = '', pinned = null;

  const ROWS = C.map((c, i) => ({ i, c }));          // configs in paper order: mini 0-5, cli 6-11
  const W = 1000, L = 150, R = 8, TOP = 26, rowH = 15, midGap = 8;
  const H = TOP + 12 * rowH + midGap + 6;
  const rowY = (r) => TOP + r * rowH + (r >= 6 ? midGap : 0);

  function ordered() {
    const langs = lang === 'all' ? S.LANGS : [lang];
    const out = [];
    langs.forEach((l) => {
      const ts = T.filter((t) => t.lang === l).sort((a, b) => (sort === 'mean' ? b.mean - a.mean : a.name.localeCompare(b.name)));
      out.push({ l, ts });
    });
    return out;
  }

  function draw() {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    const groups = ordered();
    const n = groups.reduce((a, g) => a + g.ts.length, 0);
    const gapX = 10;
    const cw = (W - L - R - gapX * (groups.length - 1)) / n;

    ROWS.forEach(({ i, c }) => {
      const y = rowY(i);
      el('image', { href: `static/images/${S.LOGO[c.key]}`, x: 2, y: y + 1.5, width: 12, height: 12 }, svg);
      const t = el('text', { x: 19, y: y + 11, 'font-size': 10.5, fill: '#374151', 'font-family': 'Inter,sans-serif' }, svg);
      t.textContent = c.model;
      const s = el('text', { x: L - 6, y: y + 11, 'text-anchor': 'end', 'font-size': 9, fill: c.group === 'mini' ? '#823C95' : '#C2185B', 'font-family': 'Inter,sans-serif', 'font-weight': 700 }, svg);
      s.textContent = c.group === 'mini' ? 'mini' : c.scaffold === 'Codex' ? 'Codex' : 'CC';
    });

    let x0 = L;
    const q = query.trim().toLowerCase();
    groups.forEach((g) => {
      const lt = el('text', { x: x0 + 1, y: 15, 'font-size': 11.5, 'font-weight': 700, fill: '#3E1A5B', 'font-family': 'Inter,sans-serif' }, svg);
      lt.textContent = `${S.LNAME[g.l]} (${g.ts.length})`;
      g.ts.forEach((t, k) => {
        const x = x0 + k * cw;
        const dim = q && !t.name.toLowerCase().includes(q) && !t.domain.toLowerCase().includes(q);
        const col = el('g', { class: 'hm-col', style: 'cursor:pointer', opacity: dim ? 0.12 : 1 }, svg);
        t.fcr.forEach((v, r) => {
          el('rect', { x: x + 0.15, y: rowY(r) + 0.6, width: Math.max(0.5, cw - 0.3), height: rowH - 1.2, fill: S.color(v / 100) }, col);
        });
        if (pinned === t) {
          el('rect', { x: x - 0.6, y: TOP - 3, width: cw + 1.2, height: H - TOP - 3, fill: 'none', stroke: '#C2185B', 'stroke-width': 1.6, rx: 1.5 }, svg);
        }
        col.addEventListener('mousemove', (ev) => {
          const r = Math.floor(((ev.offsetY / svg.clientHeight) * H - TOP) / rowH);
          S.tip(ev, `<div class="tt-title">${t.name}</div><span class="tt-dim">${S.LNAME[t.lang]} · ${t.domain}</span><br>${t.tests} tests · ${t.caps} capabilities<br>Mean FCR <b>${t.mean.toFixed(1)}%</b> · resolved by <b>${t.resolved}</b> / 12`);
        });
        col.addEventListener('mouseleave', S.untip);
        col.addEventListener('click', () => { pinned = pinned === t ? null : t; detail(); draw(); });
      });
      x0 += g.ts.length * cw + gapX;
    });
  }

  function detail() {
    const box = document.getElementById('task-detail');
    if (!pinned) { box.innerHTML = '<div class="empty">Select a task to see its twelve results.</div>'; return; }
    const t = pinned;
    let h = `<div><div class="td-name">${t.name}</div><div class="td-meta">
      <span class="pill">${S.LNAME[t.lang]}</span><span class="pill">${t.domain}</span><br>
      <b>${t.tests}</b> hidden tests · <b>${t.caps}</b> capabilities<br>
      Mean FCR <b>${t.mean.toFixed(1)}%</b> · resolved by <b>${t.resolved}</b> of 12</div></div><div class="td-bars">`;
    ['mini', 'cli'].forEach((g) => {
      h += `<div>`;
      h += `<div class="td-col-h">${g === 'mini' ? 'mini-swe-agent' : 'CLI agent'}</div>`;
      C.forEach((c, i) => {
        if (c.group !== g) return;
        const v = t.fcr[i];
        h += `<div class="td-bar"><span class="model-cell" style="font-size:0.76rem;font-weight:500"><img src="static/images/${S.LOGO[c.key]}" alt="" style="width:13px;height:13px" />${c.model}</span>
          <span class="t"><span class="${v >= 100 ? 'full' : ''}" style="width:${v}%"></span></span><span class="v">${v.toFixed(0)}%</span></div>`;
      });
      h += `</div>`;
    });
    box.innerHTML = h + '</div>';
  }

  S.seg('hm-lang', (v) => { lang = v; draw(); });
  S.seg('hm-sort', (v) => { sort = v; draw(); });
  const search = document.getElementById('hm-search');
  search.addEventListener('input', () => {
    query = search.value;
    const q = query.trim().toLowerCase();
    const hits = T.filter((t) => t.name.toLowerCase() === q);
    if (hits.length === 1) { pinned = hits[0]; detail(); }
    draw();
  });

  pinned = T.find((t) => t.name === 'alertmanager') || null;
  draw();
  detail();
})();

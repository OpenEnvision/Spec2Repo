/* Charts: pass rate vs FCR vs resolved (dumbbell), and FCR vs cost / tokens / calls (scatter). */
(function () {
  const S = window.S2R;
  if (!S.configs) return;
  const C = S.configs;
  const el = S.el;

  /* ---------------- Dumbbell: one row per configuration, grouped by scaffold ---------------- */
  (function gap() {
    const svg = document.getElementById('gap-svg');
    if (!svg) return;
    const W = 1000, L = 230, R = 70, rowH = 30, top = 34, groupGap = 34;
    const groups = [['mini', 'mini-swe-agent'], ['cli', 'CLI agent']];
    const H = top + 12 * rowH + groupGap + 40;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    const x = (v) => L + ((W - L - R) * v) / 100;

    for (let v = 0; v <= 100; v += 20) {
      el('line', { x1: x(v), x2: x(v), y1: top - 10, y2: H - 30, stroke: '#eee8f2', 'stroke-width': 1 }, svg);
      const t = el('text', { x: x(v), y: H - 12, 'text-anchor': 'middle', 'font-size': 12, fill: '#6b7280', 'font-family': 'Inter,sans-serif' }, svg);
      t.textContent = v + '%';
    }

    let y = top;
    groups.forEach(([g, label], gi) => {
      const rs = C.filter((c) => c.group === g).sort((a, b) => b.fcr - a.fcr);
      const gl = el('text', { x: 8, y: y - 8, 'font-size': 12.5, 'font-weight': 700, fill: '#823C95', 'font-family': 'Inter,sans-serif', 'font-style': 'italic' }, svg);
      gl.textContent = label;
      rs.forEach((c) => {
        const cy = y + rowH / 2;
        const gRow = el('g', { class: 'gap-row', style: 'cursor:default' }, svg);
        el('rect', { x: 0, y: y + 1, width: W, height: rowH - 2, fill: 'transparent' }, gRow);
        el('image', { href: `static/images/${S.LOGO[c.key]}`, x: 14, y: cy - 9, width: 18, height: 18 }, gRow);
        const nt = el('text', { x: 40, y: cy + 4.5, 'font-size': 13, 'font-weight': 600, fill: '#1f2937', 'font-family': 'Inter,sans-serif' }, gRow);
        nt.textContent = c.model;
        const res = (100 * c.resolved) / 150;
        el('line', { x1: x(res), x2: x(c.pass), y1: cy, y2: cy, stroke: '#e3d3ec', 'stroke-width': 6, 'stroke-linecap': 'round' }, gRow);
        el('line', { x1: x(c.fcr), x2: x(c.pass), y1: cy, y2: cy, stroke: '#C9A3D9', 'stroke-width': 2, 'stroke-dasharray': '3 3' }, gRow);
        el('circle', { cx: x(res), cy, r: 6.5, fill: '#C2185B', stroke: '#fff', 'stroke-width': 1.5 }, gRow);
        el('circle', { cx: x(c.fcr), cy, r: 7.5, fill: '#823C95', stroke: '#fff', 'stroke-width': 1.5 }, gRow);
        el('circle', { cx: x(c.pass), cy, r: 7, fill: '#C9A3D9', stroke: '#fff', 'stroke-width': 1.5 }, gRow);
        const gapT = el('text', { x: x(c.pass) + 14, y: cy + 4.5, 'font-size': 11.5, fill: '#9b8aa8', 'font-family': 'Inter,sans-serif', 'font-weight': 600 }, gRow);
        gapT.textContent = `−${(c.pass - c.fcr).toFixed(1)}`;
        gRow.addEventListener('mousemove', (ev) => S.tip(ev,
          `<div class="tt-title">${c.model} · ${c.scaffold}</div>Pass rate <b>${c.pass.toFixed(1)}%</b><br>FCR <b>${c.fcr.toFixed(1)}%</b> <span class="tt-dim">(${(c.pass - c.fcr).toFixed(1)} pts lower)</span><br>Resolved <b>${c.resolved}</b> / 150 <span class="tt-dim">(${res.toFixed(1)}%)</span>`));
        gRow.addEventListener('mouseleave', S.untip);
        y += rowH;
      });
      if (gi === 0) y += groupGap;
    });
    const gl2 = el('text', { x: W - 8, y: 18, 'text-anchor': 'end', 'font-size': 11.5, fill: '#9b8aa8', 'font-family': 'Inter,sans-serif' }, svg);
    gl2.textContent = 'gap = pass rate − FCR';
  })();

  /* ---------------- Scatter: FCR vs cost / tokens / calls (log x) ---------------- */
  (function cost() {
    const svg = document.getElementById('cost-svg');
    if (!svg) return;
    const W = 1000, H = 440, L = 70, R = 30, T = 24, B = 56;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    const LAB = { cost: 'Median API cost per run ($, log scale)', tokens: 'Median tokens per run (M, log scale)', calls: 'Median API calls per run (log scale)' };
    const TICKS = { cost: [0.5, 1, 2, 5, 10, 20], tokens: [0.5, 1, 2, 5, 10, 20, 50], calls: [20, 30, 50, 100, 200] };
    const y = (v) => T + ((H - T - B) * (80 - v)) / (80 - 40);

    function draw(metric) {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      const vals = C.map((c) => c[metric]);
      const lo = Math.log10(Math.min(...vals) / 1.6), hi = Math.log10(Math.max(...vals) * 1.6);
      const x = (v) => L + ((W - L - R) * (Math.log10(v) - lo)) / (hi - lo);
      for (let v = 40; v <= 80; v += 10) {
        el('line', { x1: L, x2: W - R, y1: y(v), y2: y(v), stroke: '#eee8f2' }, svg);
        const t = el('text', { x: L - 10, y: y(v) + 4, 'text-anchor': 'end', 'font-size': 12, fill: '#6b7280', 'font-family': 'Inter,sans-serif' }, svg);
        t.textContent = v + '%';
      }
      TICKS[metric].filter((v) => Math.log10(v) > lo && Math.log10(v) < hi).forEach((v) => {
        el('line', { x1: x(v), x2: x(v), y1: T, y2: H - B, stroke: '#f3eff6' }, svg);
        const t = el('text', { x: x(v), y: H - B + 18, 'text-anchor': 'middle', 'font-size': 12, fill: '#6b7280', 'font-family': 'Inter,sans-serif' }, svg);
        t.textContent = metric === 'cost' ? '$' + v : v;
      });
      const xl = el('text', { x: (L + W - R) / 2, y: H - 12, 'text-anchor': 'middle', 'font-size': 12.5, fill: '#4b5563', 'font-family': 'Inter,sans-serif', 'font-weight': 600 }, svg);
      xl.textContent = LAB[metric];
      const yl = el('text', { x: 16, y: (T + H - B) / 2, 'text-anchor': 'middle', 'font-size': 12.5, fill: '#4b5563', 'font-family': 'Inter,sans-serif', 'font-weight': 600, transform: `rotate(-90 16 ${(T + H - B) / 2})` }, svg);
      yl.textContent = 'FCR';

      /* connect the two scaffolds of each model */
      const byModel = {};
      C.forEach((c) => (byModel[c.key] = byModel[c.key] || []).push(c));
      Object.values(byModel).forEach(([a, b]) => {
        el('line', { x1: x(a[metric]), y1: y(a.fcr), x2: x(b[metric]), y2: y(b.fcr), stroke: '#e3d3ec', 'stroke-width': 1.5, 'stroke-dasharray': '4 3' }, svg);
      });
      C.forEach((c) => {
        const cx = x(c[metric]), cy = y(c.fcr);
        const g = el('g', { style: 'cursor:default' }, svg);
        if (c.group === 'mini') el('circle', { cx, cy, r: 17, fill: '#823C95', opacity: 0.14, stroke: '#823C95', 'stroke-width': 2 }, g);
        else el('circle', { cx, cy, r: 17, fill: '#fff', stroke: '#C2185B', 'stroke-width': 2 }, g);
        el('image', { href: `static/images/${S.LOGO[c.key]}`, x: cx - 10, y: cy - 10, width: 20, height: 20 }, g);
        const unit = metric === 'cost' ? `$${c.cost.toFixed(2)}` : metric === 'tokens' ? `${c.tokens.toFixed(1)}M tokens` : `${c.calls} calls`;
        g.addEventListener('mousemove', (ev) => S.tip(ev, `<div class="tt-title">${c.model} · ${c.scaffold}</div>FCR <b>${c.fcr.toFixed(1)}%</b><br>${unit} <span class="tt-dim">median per run</span>`));
        g.addEventListener('mouseleave', S.untip);
      });
    }
    S.seg('cost-x', draw);
    draw('cost');
  })();
})();

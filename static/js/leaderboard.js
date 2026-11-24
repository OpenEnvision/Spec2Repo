/* Leaderboard: twelve model-scaffold configurations (paper Table 3 and Table F.10). */
(function () {
  const S = window.S2R;
  const table = document.getElementById('lb-table');
  if (!table || !S.configs) return;

  const rows = S.configs.map((c, i) => Object.assign({ idx: i }, c));
  let filter = 'all', view = 'lang', sortKey = 'fcr', sortDir = -1;

  const LOWER_BETTER = { cost: 1, tokens: 1, calls: 1 };
  const COLS = {
    lang: [
      { k: 'fcr', h: 'FCR', sub: 'overall', cls: 'fcr' },
      ...S.LANGS.map((l) => ({ k: 'lang.' + l, h: S.LNAME[l], sub: S.NTASK[l] + ' tasks' })),
      { k: 'resolved', h: 'Resolved', sub: '(almost)', cls: 'res' },
      { k: 'pass', h: 'Pass rate', sub: 'tests' },
    ],
    cost: [
      { k: 'fcr', h: 'FCR', sub: 'overall', cls: 'fcr' },
      { k: 'resolved', h: 'Resolved', sub: '(almost)', cls: 'res' },
      { k: 'pass', h: 'Pass rate', sub: 'tests' },
      { k: 'cost', h: 'Cost', sub: '$ / run' },
      { k: 'tokens', h: 'Tokens', sub: 'M / run' },
      { k: 'calls', h: 'API calls', sub: '/ run' },
    ],
  };

  const get = (r, k) => (k.startsWith('lang.') ? r.lang[k.slice(5)] : r[k]);

  function visible() {
    let rs = rows;
    if (filter === 'mini' || filter === 'cli') rs = rs.filter((r) => r.group === filter);
    if (filter === 'best') {
      const best = {};
      rs.forEach((r) => { if (!best[r.key] || r.fcr > best[r.key].fcr) best[r.key] = r; });
      rs = Object.values(best);
    }
    return rs.slice().sort((a, b) => {
      const d = (get(a, sortKey) - get(b, sortKey)) * sortDir;
      return d !== 0 ? d : b.fcr - a.fcr || a.idx - b.idx;
    });
  }

  function render() {
    const cols = COLS[view];
    const rs = visible();
    const fcrRank = rs.slice().sort((a, b) => b.fcr - a.fcr);
    const medal = new Map(fcrRank.slice(0, 3).map((r, i) => [r, i + 1]));
    const extremes = {};
    cols.forEach((c) => {
      const vals = rs.map((r) => get(r, c.k)).sort((a, b) => (LOWER_BETTER[c.k] ? a - b : b - a));
      extremes[c.k] = [vals[0], vals[1]];
    });
    const maxF = 100;

    let h = '<thead><tr><th>#</th><th style="text-align:left">Model</th><th>Scaffold</th>';
    cols.forEach((c) => {
      const on = c.k === sortKey;
      const arr = on ? (sortDir < 0 ? '▼' : '▲') : '▾';
      h += `<th class="sortable${on ? ' sorted' : ''}" data-k="${c.k}">${c.h}<span class="arr">${arr}</span><span class="lb-sub">${c.sub}</span></th>`;
    });
    h += '</tr></thead><tbody>';
    rs.forEach((r, i) => {
      const m = medal.get(r);
      const rank = m ? `<span class="medal g${m}">${m}</span>` : `<span class="rank">${i + 1}</span>`;
      const ver = S.VER[r.scaffold];
      h += `<tr><td>${rank}</td>`;
      h += `<td class="l"><span class="model-cell"><img src="static/images/${S.LOGO[r.key]}" alt="" />${r.model}</span></td>`;
      h += `<td><span class="scaf ${r.group}" title="${r.scaffold} ${ver}"><span class="long">${r.scaffold}</span><span class="short">${r.group === 'mini' ? 'mini' : r.scaffold === 'Codex' ? 'Codex' : 'CC'}</span></span></td>`;
      cols.forEach((c) => {
        const v = get(r, c.k);
        const [b1, b2] = extremes[c.k];
        const cls = v === b1 ? 'best' : v === b2 ? 'second' : '';
        if (c.k === 'fcr') {
          h += `<td class="fcr-cell"><div class="fcr-wrap"><span class="track"><i style="width:${(v / maxF) * 100}%"></i></span><b class="${cls}">${S.fmt(v)}</b></div></td>`;
        } else if (c.k === 'resolved') {
          h += `<td class="res-cell"><b class="${cls}">${v}</b><span class="alm">(${r.almost})</span></td>`;
        } else if (c.k === 'cost') {
          h += `<td class="${cls}">$${S.fmt(v, 2)}</td>`;
        } else if (c.k === 'calls') {
          h += `<td class="${cls}">${v % 1 ? v.toFixed(1) : v}</td>`;
        } else {
          h += `<td class="${cls}">${S.fmt(v)}</td>`;
        }
      });
      h += '</tr>';
    });
    h += '</tbody>';
    table.innerHTML = h;

    table.querySelectorAll('th.sortable').forEach((th) => {
      th.addEventListener('click', () => {
        const k = th.dataset.k;
        if (k === sortKey) sortDir = -sortDir;
        else { sortKey = k; sortDir = LOWER_BETTER[k] ? 1 : -1; }
        render();
      });
    });

    document.getElementById('lb-note').innerHTML = view === 'lang'
      ? 'FCR (%) over each language and all 150 tasks. Resolved counts tasks with every test passing, and almost-resolved tasks (at most one capability undelivered) are in parentheses. CLI agent is Claude Code, or Codex for GPT 5.6 Sol. All models run with high reasoning effort and an 8-hour budget.'
      : 'Median per run of API cost at each provider\'s list price with prompt caching, tokens processed (input and output), and API calls. Lower is cheaper, and higher cost does not deliver more.';
  }

  S.seg('lb-filter', (v) => { filter = v; render(); });
  S.seg('lb-view', (v) => {
    view = v;
    if (!COLS[view].some((c) => c.k === sortKey)) { sortKey = 'fcr'; sortDir = -1; }
    render();
  });
  render();
})();

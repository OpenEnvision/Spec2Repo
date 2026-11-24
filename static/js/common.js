/* Shared helpers: tooltip, tabs, segmented controls, author toggle, BibTeX copy, top nav. */
(function () {
  const S = (window.S2R = window.S2R || {});

  S.LOGO = {
    'claude-opus-5': 'claude-color.png', 'gpt-5.6-sol': 'openai.png', 'qwen3.8-max-0902': 'qwen-color.png',
    'kimi-k3': 'kimi.png', 'deepseek-v4-pro': 'deepseek-color.png', 'glm-5.3': 'zai-glm.png',
  };
  S.LANGS = ['python', 'typescript', 'rust', 'java', 'go'];
  S.LNAME = { python: 'Python', typescript: 'TypeScript', rust: 'Rust', java: 'Java', go: 'Go' };
  S.NTASK = { python: 67, typescript: 28, rust: 24, java: 17, go: 14 };
  S.VER = { 'mini-swe-agent': '2.4.6', 'Claude Code': '2.1.259', Codex: '0.154.0' };
  S.NS = 'http://www.w3.org/2000/svg';

  S.el = function (tag, attrs, parent) {
    const e = document.createElementNS(S.NS, tag);
    for (const k in attrs || {}) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  };
  S.fmt = (v, d = 1) => (v == null ? '–' : Number(v).toFixed(d));

  /* Purple sequential scale, white -> deep, matching the paper's heatmap. */
  const STOPS = [[255, 255, 255], [239, 227, 245], [201, 163, 217], [130, 60, 149], [62, 26, 91]];
  S.color = function (x) {
    x = Math.max(0, Math.min(1, x)) * (STOPS.length - 1);
    const i = Math.min(STOPS.length - 2, Math.floor(x)), f = x - i;
    const c = STOPS[i].map((a, j) => Math.round(a + (STOPS[i + 1][j] - a) * f));
    return `rgb(${c[0]},${c[1]},${c[2]})`;
  };

  /* Tooltip */
  const tt = document.getElementById('chart-tooltip');
  S.tip = function (ev, html) {
    if (!tt) return;
    tt.innerHTML = html;
    tt.classList.add('visible');
    const x = Math.min(window.innerWidth - 180, Math.max(180, ev.clientX));
    tt.style.left = x + 'px';
    tt.style.top = ev.clientY + 'px';
  };
  S.untip = function () { if (tt) tt.classList.remove('visible'); };

  /* Segmented controls: S.seg(id, cb) calls cb(value) on change. */
  S.seg = function (id, cb) {
    const root = document.getElementById(id);
    if (!root) return;
    root.querySelectorAll('button').forEach((b) => {
      b.addEventListener('click', () => {
        root.querySelectorAll('button').forEach((x) => x.classList.remove('active'));
        b.classList.add('active');
        cb(b.dataset.v);
      });
    });
  };

  /* Tabs */
  document.querySelectorAll('.tabs').forEach((bar) => {
    bar.querySelectorAll('.tab').forEach((btn) => {
      btn.addEventListener('click', () => {
        bar.querySelectorAll('.tab').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const sec = bar.parentElement;
        sec.querySelectorAll('.tab-panel').forEach((p) => p.classList.remove('active'));
        const p = document.getElementById(btn.dataset.panel);
        if (p) p.classList.add('active');
      });
    });
  });

  /* Authors */
  const at = document.getElementById('author-toggle'), am = document.getElementById('author-more');
  if (at && am) {
    at.addEventListener('click', () => {
      const open = am.hidden;
      am.hidden = !open;
      at.setAttribute('aria-expanded', String(open));
      at.textContent = open ? '− hide contributors' : '+ 34 contributors';
    });
  }

  /* BibTeX copy */
  const bc = document.getElementById('bibtex-copy');
  if (bc) {
    bc.addEventListener('click', () => {
      const txt = document.getElementById('bibtex-block').innerText;
      (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(
        () => { bc.textContent = 'copied!'; setTimeout(() => (bc.textContent = 'copy'), 1500); },
        () => { bc.textContent = 'select & copy'; });
    });
  }

  /* Top nav: show after the hero, highlight the current section. */
  const nav = document.getElementById('topnav'), hero = document.getElementById('top');
  if (nav && hero) {
    const links = [...nav.querySelectorAll('.navlinks a')];
    const targets = links.map((a) => document.querySelector(a.getAttribute('href')));
    const onScroll = () => {
      nav.classList.toggle('show', window.scrollY > hero.offsetHeight - 80);
      let cur = -1;
      targets.forEach((t, i) => { if (t && t.getBoundingClientRect().top < 120) cur = i; });
      links.forEach((a, i) => a.classList.toggle('on', i === cur && !a.classList.contains('cta')));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* Disabled placeholder links */
  document.querySelectorAll('a[aria-disabled="true"]').forEach((a) => a.addEventListener('click', (e) => e.preventDefault()));
})();

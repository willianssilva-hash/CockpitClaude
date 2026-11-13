/* Runtime mínimo do painel: lê os CSVs embutidos, calcula os indicadores e redesenha a página quando um filtro muda. */
(function () {
  const fontes = {};
  const calcs = {};
  const desenhos = [];
  const ouvintes = [];
  let params = {};
  let cache = {};

  document.querySelectorAll('script[type="text/csv"]').forEach((s) => {
    const linhas = d3.csvParse(s.textContent.trim(), (r) => {
      for (const k in r) if (r[k] === '') r[k] = null;
      return r;
    });
    fontes[s.dataset.id] = linhas;
  });

  const dados = (id) => {
    if (fontes[id]) return { status: 'ok', data: fontes[id], columns: fontes[id].columns, refreshing: false, truncated: false };
    if (calcs[id]) {
      if (!(id in cache)) {
        const c = calcs[id];
        const ins = c.inputs.map((i) => (dados(i).data || []));
        try { cache[id] = { status: 'ok', data: c.fn(...ins) }; }
        catch (e) { console.error('Cálculo', id, e); cache[id] = { status: 'error', data: null, message: String(e) }; }
      }
      return cache[id];
    }
    return { status: 'missing', data: [] };
  };

  const visivel = (el) => !el.closest('[hidden]');
  const desenharTudo = () => {
    ouvintes.forEach((fn) => { try { fn(); } catch (e) { console.error(e); } });
    desenhos.forEach(({ nome, fn }) => {
      document.querySelectorAll('[data-draw="' + nome + '"]').forEach((el) => {
        if (!visivel(el)) return;
        try { fn(el); } catch (e) { console.error('Desenho', nome, e); }
      });
    });
  };
  const mudou = () => { cache = {}; desenharTudo(); };

  const lerHashParams = () => {
    try { const q = new URLSearchParams(location.search); ['dia', 'unidade', 'categoria', 'status'].forEach((k) => { if (q.get(k)) params[k] = q.get(k); }); } catch (e) {}
  };
  lerHashParams();

  window.dash = {
    data: dados,
    calc: (id, def) => { calcs[id] = def; },
    loader: () => {},
    draw: (nome, fn) => {
      if (typeof fn === 'function') desenhos.push({ nome, fn });
      else document.querySelectorAll('[data-draw="' + nome + '"]').forEach((el) => {
        const d = desenhos.find((x) => x.nome === nome); if (d && visivel(el)) d.fn(el);
      });
    },
    onData: (fn) => { ouvintes.push(fn); },
    params: () => ({ ...params }),
    setParams: (p) => {
      for (const k in p) { if (p[k] == null || p[k] === '') delete params[k]; else params[k] = p[k]; }
      mudou();
    },
    resetParams: () => { params = {}; mudou(); },
    setLink: (id) => { try { history.replaceState(null, '', location.pathname + location.search + '#' + id); } catch (e) {} },
    refresh: () => mudou(),
    colors: ['var(--s-carregado)', 'var(--s-viagem)', 'var(--s-desc)', 'var(--s-retorno)']
  };

  const iniciar = () => {
    desenharTudo();
    new MutationObserver((ms) => { if (ms.some((m) => m.attributeName === 'hidden')) desenharTudo(); })
      .observe(document.getElementById('dash-root'), { attributes: true, subtree: true, attributeFilter: ['hidden'] });
    let t;
    window.addEventListener('resize', () => { clearTimeout(t); t = setTimeout(desenharTudo, 150); });
  };
  window.__cdtIniciar = iniciar;
})();

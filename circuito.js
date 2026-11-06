// Portada «Circuito Juárez»: la placa es el trazo real de la ciudad (avenidas principales de OpenStreetMap,
// pasadas a ángulos de 45° como las pistas de un circuito). El río Bravo es el borde de la placa.
(function () {
  const NS = 'http://www.w3.org/2000/svg';
  const D = window.PLACA;
  const svg = document.getElementById('placa');
  const portada = document.getElementById('portada');
  const panel = document.getElementById('panel');
  const stem = document.getElementById('stem');
  const reducido = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const el = (n, a, padre) => { const e = document.createElementNS(NS, n); for (const k in a) e.setAttribute(k, a[k]); if (padre) padre.appendChild(e); return e; };
  const pts = p => p.map(q => q.join(',')).join(' ');
  const dPath = p => 'M' + p.map(q => q.join(' ')).join('L');
  let trazas = [], mapa = null, s = 1, tx = 0, ty = 0, primera = true, vivos = 0, maxPulsos = 0, gen = 0;

  function aPantalla([x, y]) { return [tx + x * s, ty + y * s]; }
  function centroPanel() {
    const b = portada.getBoundingClientRect(), r = panel.getBoundingClientRect();
    return { x: r.left - b.left + r.width / 2, y: r.top - b.top + r.height / 2, r: r, b: b };
  }

  function construir() {
    gen++;
    svg.textContent = '';
    const W = portada.clientWidth, movil = W < 861;
    const H = movil ? 430 : portada.clientHeight;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    // encuadre del mapa
    if (movil) { s = W * 1.35 / D.w; tx = W / 2 - 520 * s; ty = 70 - 40 * s; }
    else {
      const b = portada.getBoundingClientRect(), izq = document.querySelector('.portada__intro').getBoundingClientRect().right - b.left;
      s = H * 1.1 / D.h;
      tx = (izq + W) / 2 - 540 * s;
      ty = H * .55 - 470 * s;
    }
    mapa = el('g', { transform: `translate(${tx} ${ty}) scale(${s})` }, svg);
    // la placa: todo lo que queda al sur del río
    const rio = D.rio;
    el('polygon', { class: 'fondo', points: pts([[-400, rio[0][1]], ...rio, [D.w + 600, rio[rio.length - 1][1]], [D.w + 600, D.h + 600], [-400, D.h + 600]]) }, mapa);
    el('polyline', { class: 'rio-borde', points: pts(rio), 'vector-effect': 'non-scaling-stroke' }, mapa);
    el('polyline', { class: 'rio', points: pts(rio.map(([x, y]) => [x + 2, y - 7])), 'vector-effect': 'non-scaling-stroke' }, mapa);
    // pistas
    trazas = D.trazas.map(t => {
      const p = el('path', { class: 'traza k' + t.k, d: dPath(t.p) }, mapa);
      return { el: p, t, L: p.getTotalLength() };
    });
    const g = el('g', {}, mapa);
    D.trazas.forEach(t => [t.p[0], t.p[t.p.length - 1]].forEach(([x, y]) => el('circle', { class: 'via', cx: x, cy: y, r: (t.k > 1 ? 3.6 : 2.6) / s, 'stroke-width': 1.1 / s }, g)));
    // rótulos en serigrafía
    const rot = (txt, x, y, ang) => { const tt = el('text', { class: 'rotulo', transform: `translate(${tx + x * s} ${ty + y * s}) rotate(${ang})` }, svg); tt.textContent = txt; };
    if (!movil) { rot('Río Bravo', 470, 105, 18); }
    // pines del panel: el formulario es el componente principal de la placa
    const pinesG = el('g', {}, svg);
    if (!movil) {
      const c = centroPanel(), r = c.r, x0 = r.left - c.b.left, y0 = r.top - c.b.top;
      const n = Math.max(5, Math.floor(r.height / 52)), xr = x0 + r.width;
      for (let i = 0; i < n; i++) {
        const y = y0 + 30 + i * (r.height - 60) / (n - 1);
        el('rect', { class: 'pin', x: xr - 2, y: y - 1.5, width: 11, height: 3, rx: 1 }, pinesG);
        const largo = 22 + ((i * 37) % 5) * 14, dy = i % 2 ? (i < n / 2 ? -16 : 16) : 0;
        el('path', { class: 'traza k1', d: `M${xr + 9} ${y}h${largo}${dy ? `l16 ${dy}` : ''}` }, pinesG);
        el('circle', { class: 'pin-pad', cx: xr + 9 + largo + (dy ? 16 : 0), cy: y + dy, r: 3 }, pinesG);
        el('rect', { class: 'pin', x: x0 - 9, y: y - 1.5, width: 11, height: 3, rx: 1 }, pinesG);
      }
    }
    const pulsos = el('g', {}, mapa);
    // entrada: las pistas se dibujan del río hacia el sur
    if (primera && !reducido) {
      trazas.forEach(({ el: p, t }) => {
        const y = Math.min(...t.p.map(q => q[1])) / D.h;
        p.setAttribute('pathLength', '1'); p.style.strokeDasharray = '1 1';
        p.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 900, delay: 120 + y * 1100 + Math.random() * 160, easing: 'cubic-bezier(.5,0,.2,1)', fill: 'backwards' })
          .onfinish = () => { p.removeAttribute('pathLength'); p.style.strokeDasharray = ''; };
      });
      svg.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 400 });
    }
    primera = false;
    // corriente hacia el panel
    vivos = 0; maxPulsos = reducido ? 0 : movil ? 7 : 24;
    const g0 = gen;
    for (let i = 0; i < maxPulsos; i++) setTimeout(() => g0 === gen && pulso(pulsos, g0), 900 + i * 200);
    // alimentación de los cuatro componentes STEM: cada uno recibe corriente de la placa y se enciende
    alimentaciones = [];
    const cajas = [...stem.children], capaA = el('g', {}, svg);
    cajas.forEach((li, i) => {
      if (movil) { alimentaciones.push({ li }); return; }
      const b = portada.getBoundingClientRect(), r = li.getBoundingClientRect();
      const x = r.left - b.left + r.width / 2, y = r.top - b.top;
      const lado = i < 2 ? -1 : 1, alto = 64 + (i % 2) * 26;
      const d = `M${x + lado * 26} ${y - alto - 30}L${x} ${y - alto}V${y + 1}`;
      el('path', { class: 'traza k2 alimenta', d }, capaA);
      el('circle', { class: 'via via--alimenta', cx: x + lado * 26, cy: y - alto - 30, r: 4 }, capaA);
      el('rect', { class: 'pin', x: x - 7, y: y - 3, width: 14, height: 4, rx: 1 }, capaA);
      const halo = el('path', { class: 'pulso pulso--halo', d, style: 'opacity:0' }, capaA);
      const nucleo = el('path', { class: 'pulso pulso--nucleo', d, style: 'opacity:0' }, capaA);
      alimentaciones.push({ li, halo, nucleo, L: halo.getTotalLength() });
    });
    if (!reducido) { let k = 0; const g1 = gen;
      const ciclo = () => { if (g1 !== gen) return; alimentar(alimentaciones[k++ % 4]); setTimeout(ciclo, k % 4 ? 1190 : 2375); };
      setTimeout(ciclo, primeraVez ? 1600 : 400); primeraVez = false; }
  }
  let alimentaciones = [], primeraVez = true;
  function encender() {}   // los cuadros STEM ya no se iluminan
  function alimentar(a) {
    if (!a) return;
    if (!a.halo) return encender(a.li);
    const cola = 40, L = a.L;
    let fin;
    [a.halo, a.nucleo].forEach(p => {
      p.style.opacity = 1; p.style.strokeDasharray = `${cola} ${L + cola * 2}`;
      fin = p.animate([{ strokeDashoffset: cola }, { strokeDashoffset: -L }], { duration: 900, easing: 'cubic-bezier(.5,0,.9,.5)', fill: 'both' });
    });
    fin.onfinish = () => { a.halo.style.opacity = a.nucleo.style.opacity = 0; encender(a.li); };
  }

  function elegir() {
    let tot = 0; const pesos = trazas.map(z => (tot += z.L * z.t.k, tot));
    const r = Math.random() * tot; return trazas[pesos.findIndex(w => w >= r)];
  }
  function pulso(capa, g0, z0, retraso) {
    if (g0 !== gen) return;
    const z = z0 || elegir(); if (!z || z.L < 40) return setTimeout(() => pulso(capa, g0), 50);
    const c = centroPanel();
    const a = aPantalla(z.t.p[0]), b = aPantalla(z.t.p[z.t.p.length - 1]);
    const haciaPanel = Math.hypot(a[0] - c.x, a[1] - c.y) > Math.hypot(b[0] - c.x, b[1] - c.y);
    const cola = 48 / s, punta = 10 / s, L = z.L;
    const desde = haciaPanel ? cola : -L, hasta = haciaPanel ? -L : cola;
    const dur = Math.max(1125, L * s / 192 * 1000);
    const ajuste = haciaPanel ? punta - cola : 0;          // la chispa blanca va al frente del pulso
    const piezas = [['pulso pulso--halo', cola, 0], ['pulso pulso--nucleo', cola, 0], ['pulso pulso--chispa', punta, ajuste]].map(([cl, largo, aj]) => {
      const p = el('path', { class: cl, d: z.el.getAttribute('d') }, capa);
      p.style.strokeDasharray = `${largo} ${L + cola * 2}`;
      return p.animate([{ strokeDashoffset: desde + aj }, { strokeDashoffset: hasta + aj }], { duration: dur, delay: retraso || 0, easing: 'cubic-bezier(.3,0,.7,1)', fill: 'both' });
    });
    if (!z0 && Math.random() < .35) { pulso(capa, g0, z, 210); if (Math.random() < .5) pulso(capa, g0, z, 425); }   // ráfagas
    piezas[1].onfinish = () => {
      piezas.forEach(x => x.effect.target.remove());
      const [ex, ey] = haciaPanel ? z.t.p[z.t.p.length - 1] : z.t.p[0];
      const r = el('circle', { class: 'destello', cx: ex, cy: ey, r: 2 / s, 'stroke-width': 1.6 / s }, capa);
      r.animate([{ r: 2 / s, opacity: 1 }, { r: 16 / s, opacity: 0 }], { duration: 520, easing: 'ease-out' }).onfinish = () => r.remove();
      if (!z0) setTimeout(() => pulso(capa, g0), Math.random() * 350);
    };
  }

  // al entrar: el circuito se cierra y la placa se enciende desde el panel hacia afuera
  function encendido() {
    const c = centroPanel();
    trazas.forEach(({ el: p, t }) => {
      const d = Math.min(...t.p.map(q => { const [x, y] = aPantalla(q); return Math.hypot(x - c.x, y - c.y); }));
      p.animate([{ stroke: '#003B7C' }, { stroke: '#FAB51B', strokeOpacity: .95, offset: .35 }, { stroke: '#003B7C' }],
        { duration: reducido ? 1 : 1100, delay: reducido ? 0 : d * .9, easing: 'ease-out' });
    });
  }
  const fichas = document.getElementById('vistaFichas');
  new MutationObserver(() => { if (!fichas.hidden && !portada.hidden) encendido(); }).observe(fichas, { attributes: true, attributeFilter: ['hidden'] });

  // se construye cuando la portada está a la vista y se detiene cuando se oculta
  let espera, listo = false, ultimo = '';
  const raiz = document.documentElement;
  const arranque = new Promise(ok => {
    if (reducido || !raiz.classList.contains('con-apertura') || raiz.classList.contains('revelado')) return ok();
    ['apertura:textos', 'apertura:saltar'].forEach(ev => document.addEventListener(ev, ok, { once: true }));
    new MutationObserver(() => raiz.classList.contains('revelado') && ok()).observe(raiz, { attributes: true, attributeFilter: ['class'] });
  });
  const fuentes = Promise.all([document.fonts ? document.fonts.ready : 0, arranque]);
  new ResizeObserver(() => {
    clearTimeout(espera);
    espera = setTimeout(() => fuentes.then(() => {
      const f = portada.clientWidth + 'x' + portada.clientHeight;
      if (portada.hidden || !portada.clientWidth) { gen++; ultimo = ''; return; }
      if (f === ultimo) return;
      ultimo = f; construir();
    }), listo ? 180 : 0);
    listo = true;
  }).observe(portada);
})();

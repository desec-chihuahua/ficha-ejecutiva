// Apertura en puntos: una red de nodos se teje, las partículas fluyen y forman el isotipo DESEC.
// Técnica tomada de la apertura aprobada del sitio CODER (nodos → corrientes → logotipo), en WebGL.
import * as THREE from 'three';

const cont = document.getElementById('portadaLienzo');
const movil = matchMedia('(max-width: 860px)').matches;
const reducido = matchMedia('(prefers-reduced-motion: reduce)').matches;
const N_LOGO = movil ? 7000 : 15000;
const N_HUB = movil ? 130 : 240;
const ESTELAS = movil ? 1 : 3;
const VEL = 1.35;                                   // acelera la partitura original
const T_TEXTOS = 5.15;                              // segundos reales

// ---------- 1. Isotipo oficial muestreado ----------
const img = await new Promise((ok, mal) => { const i = new Image(); i.onload = () => ok(i); i.onerror = mal; i.src = 'desec-isotipo-azul.png'; });
const R = 600, cv = document.createElement('canvas'); cv.width = cv.height = R;
const cx = cv.getContext('2d', { willReadFrequently: true });
cx.drawImage(img, 0, 0, R, R);
const dat = cx.getImageData(0, 0, R, R).data;
const ESC = 6.2 / R;
const destinos = [];
for (let g = 0; destinos.length < N_LOGO && g < N_LOGO * 60; g++) {
  const x = Math.random() * R, y = Math.random() * R;
  if (dat[((y | 0) * R + (x | 0)) * 4 + 3] > 140) destinos.push([(x - R / 2) * ESC, -(y - R / 2) * ESC]);
}

// ---------- 2. Partículas ----------
const N = destinos.length;
const aStart = new Float32Array(N * 3), aTarget = new Float32Array(N * 3), aSeed = new Float32Array(N), aHub = new Float32Array(N), aAmbar = new Float32Array(N);
const rnd = (a, b) => a + Math.random() * (b - a);
destinos.forEach(([x, y], i) => {
  const r = Math.pow(Math.random(), .6), th = Math.random() * Math.PI * 2, ph = Math.acos(rnd(-1, 1));
  aStart.set([Math.sin(ph) * Math.cos(th) * 13 * r, Math.sin(ph) * Math.sin(th) * 7.5 * r, rnd(-9, 6)], i * 3);
  aTarget.set([x, y, rnd(-.04, .04)], i * 3);
  aSeed[i] = Math.random();
  aAmbar[i] = Math.random() < .035 ? 1 : 0;
});
for (let q = 0; q < N; q++) {
  if (q < N_HUB) { aHub[q] = 1; continue; }
  const h = (Math.random() * N_HUB) | 0;
  for (let c = 0; c < 3; c++) aStart[q * 3 + c] = aStart[h * 3 + c] + rnd(-.18, .18);
}
const geo = new THREE.BufferGeometry();
for (const [n, arr, s] of [['position', aStart, 3], ['aStart', aStart, 3], ['aTarget', aTarget, 3], ['aSeed', aSeed, 1], ['aHub', aHub, 1], ['aAmbar', aAmbar, 1]])
  geo.setAttribute(n, new THREE.BufferAttribute(arr, s));

const U = { uT: { value: 0 }, uMouse: { value: new THREE.Vector2(99, 99) }, uPx: { value: Math.min(devicePixelRatio, 2) }, uFoco: { value: 18 }, uEsc: { value: 1 }, uFade: { value: 0 } };
const comun = /* glsl */`
  uniform float uT, uFoco; uniform vec2 uMouse;
  attribute vec3 aStart; attribute float aSeed;
  vec3 nodo(vec3 s, float seed, float t){
    vec3 p = s + vec3(sin(t*.31 + seed*6.283), cos(t*.27 + seed*4.1), sin(t*.22 + seed*9.7)) * .28;
    vec2 d = p.xy - uMouse; p.xy += normalize(d + 1e-4) * exp(-dot(d,d)*.35) * 1.1;
    return p;
  }
  float io(float x){ return x < .5 ? 4.*x*x*x : 1. - pow(-2.*x + 2., 3.)/2.; }
  float desenfoque(float prof){ return clamp(abs(prof - uFoco) / 9., 0., 1.); }
`;
function material(lag) {
  return new THREE.ShaderMaterial({
    transparent: true, depthWrite: false,
    uniforms: { ...U, uLag: { value: lag } },
    vertexShader: comun + /* glsl */`
      uniform float uPx, uLag, uEsc, uFade; attribute vec3 aTarget; attribute float aHub, aAmbar;
      varying vec3 vCol; varying float vA, vBlur;
      vec3 bez(vec3 a, vec3 b, vec3 c, vec3 d, float t){ float u = 1.-t; return u*u*u*a + 3.*u*u*t*b + 3.*u*t*t*c + t*t*t*d; }
      void main(){
        float t = uT - uLag;
        vec3 p0 = nodo(aStart, aSeed, t);
        vec3 j = vec3(sin(aSeed*91.), cos(aSeed*57.), sin(aSeed*23.));
        float ang = aSeed*6.283;
        vec3 c1 = vec3(cos(ang)*14., sin(ang)*9., -2.) + j*.6;
        vec3 c2 = vec3(cos(ang*3.)*1.6, sin(ang*3.)*1.6, 1.4) + j*.25;
        float k = clamp((t - 2.9 - aSeed*1.1) / 2.1, 0., 1.);
        float e = io(k);
        vec3 p = bez(p0, c1, c2, aTarget, e);
        float flujo = e*(1.-e)*4.;
        p += vec3(sin(e*9. + aSeed*20.), cos(e*7. + aSeed*13.), sin(e*5. + aSeed*7.)) * .3 * flujo;
        // ya formado: respira y se aparta del cursor
        float vivo = smoothstep(6.2, 7.2, t);
        p += vec3(sin(t*.8 + aSeed*30.), cos(t*.7 + aSeed*17.), 0.) * .018 * vivo;
        vec2 dm = p.xy - uMouse; p.xy += normalize(dm + 1e-4) * exp(-dot(dm,dm)*1.8) * .45 * vivo;
        vec3 azul = vec3(0., .231, .486), vuelo = vec3(.05, .42, 1.), ambar = vec3(.98, .71, .106);
        vCol = mix(vuelo, azul, smoothstep(.15, .85, e));
        vCol = mix(vCol, ambar, aAmbar * (1. - smoothstep(.7, .98, e)));   // el ámbar solo viaja; al posarse todo es azul DESEC
        float recibe = pow(max(0., sin(t*2.7 + aSeed*41.)), 24.) * (1. - smoothstep(2.6, 3.4, t)) * aHub;
        vCol = mix(vCol, vec3(.45, .8, 1.), recibe);
        vec4 mv = modelViewMatrix * vec4(p, 1.);
        float prof = -mv.z; vBlur = desenfoque(prof);
        float tam = aHub > .5 ? mix(7.5, 1.7, smoothstep(0., .25, e)) * (1. + recibe*.6) : 1.8*(1. + flujo*.7);
        tam *= 1. + vBlur*1.6;
        tam *= mix(1., uEsc * .95, smoothstep(.85, 1., e));     // ya posado: punto nítido y del tamaño justo
        gl_PointSize = tam * uPx * 26. / clamp(prof, .6, 80.);
        float nace = aHub > .5 ? 1. : smoothstep(0., .06, e);
        float aparicion = smoothstep(0., 1.4, t - aSeed*.8);
        float estela = uLag > 0. ? flujo * (1. - uLag*5.5) * .55 : 1.;
        vA = aparicion * nace * estela * (1. - vBlur*.55) * (1. - uFade);
        if (prof < .4) vA = 0.;
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */`
      varying vec3 vCol; varying float vA, vBlur;
      void main(){ float d = length(gl_PointCoord - .5); if (d > .5) discard;
        float nucleo = smoothstep(.5, mix(.3, .0, vBlur), d); float halo = smoothstep(.5, .0, d)*.3;
        gl_FragColor = vec4(vCol, (nucleo + halo)*vA); }`
  });
}

// ---------- 3. Red y señales ----------
const seg = [];
for (let a = 0; a < N_HUB; a++) {
  const cerca = [];
  for (let b = a + 1; b < N_HUB; b++) {
    const dx = aStart[b*3]-aStart[a*3], dy = aStart[b*3+1]-aStart[a*3+1], dz = aStart[b*3+2]-aStart[a*3+2], d = dx*dx+dy*dy+dz*dz;
    if (d < 16) cerca.push([d, b]);
  }
  cerca.sort((x, y) => x[0] - y[0]).slice(0, 3).forEach(([, b]) => seg.push(a, b));
}
const L = seg.length, lS = new Float32Array(L*3), lSeed = new Float32Array(L), lRev = new Float32Array(L);
for (let s = 0; s < L; s += 2) {
  const a = seg[s], b = seg[s+1];
  const rev = .9 + Math.hypot((aStart[a*3]+aStart[b*3])/2, (aStart[a*3+1]+aStart[b*3+1])/2) / 13 * 1.4 + Math.random()*.2;
  [a, b].forEach((n, o) => { lS.set(aStart.subarray(n*3, n*3+3), (s+o)*3); lSeed[s+o] = aSeed[n]; lRev[s+o] = rev; });
}
const lgeo = new THREE.BufferGeometry();
lgeo.setAttribute('position', new THREE.BufferAttribute(lS, 3));
lgeo.setAttribute('aStart', new THREE.BufferAttribute(lS, 3));
lgeo.setAttribute('aSeed', new THREE.BufferAttribute(lSeed, 1));
lgeo.setAttribute('aRev', new THREE.BufferAttribute(lRev, 1));
const red = new THREE.LineSegments(lgeo, new THREE.ShaderMaterial({
  transparent: true, depthWrite: false, uniforms: U,
  vertexShader: comun + `attribute float aRev; varying float vA;
    void main(){ vec3 p = nodo(aStart, aSeed, uT);
      vA = smoothstep(aRev, aRev + .45, uT) * (1. - smoothstep(2.6, 3.5, uT)) * (.65 + .35*sin(uT*5. + aRev*11.)) * .45;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.); }`,
  fragmentShader: `varying float vA; void main(){ gl_FragColor = vec4(.05, .33, .8, vA); }`
}));
const NS = Math.min(L/2, movil ? 150 : 380) | 0;
const sA = new Float32Array(NS*3), sB = new Float32Array(NS*3), sSeed = new Float32Array(NS), sSeedB = new Float32Array(NS), sRev = new Float32Array(NS);
for (let q = 0; q < NS; q++) {
  const s = ((Math.random()*L/2)|0)*2, flip = Math.random() < .5, a = flip ? s+1 : s, b = flip ? s : s+1;
  sA.set(lS.subarray(a*3, a*3+3), q*3); sB.set(lS.subarray(b*3, b*3+3), q*3);
  sSeed[q] = lSeed[a]; sSeedB[q] = lSeed[b]; sRev[q] = lRev[a] + .2 + Math.random()*.6;
}
const sgeo = new THREE.BufferGeometry();
for (const [n, arr, s] of [['position', sA, 3], ['aStart', sA, 3], ['aEnd', sB, 3], ['aSeed', sSeed, 1], ['aSeedB', sSeedB, 1], ['aRev', sRev, 1]])
  sgeo.setAttribute(n, new THREE.BufferAttribute(arr, s));
const senales = new THREE.Points(sgeo, new THREE.ShaderMaterial({
  transparent: true, depthWrite: false, uniforms: U,
  vertexShader: comun + `uniform float uPx; attribute vec3 aEnd; attribute float aSeedB, aRev; varying float vA;
    void main(){ float f = fract((uT - aRev) * .9 + aSeed);
      vec3 p = mix(nodo(aStart, aSeed, uT), nodo(aEnd, aSeedB, uT), f);
      vA = step(aRev, uT) * (1. - smoothstep(2.5, 3.2, uT)) * sin(f*3.1416);
      vec4 mv = modelViewMatrix * vec4(p, 1.);
      gl_PointSize = 5.5 * uPx * 26. / clamp(-mv.z, .6, 80.);
      gl_Position = projectionMatrix * mv; }`,
  fragmentShader: `varying float vA; void main(){ float d = length(gl_PointCoord - .5); if (d > .5) discard;
      gl_FragColor = vec4(.2, .6, 1., smoothstep(.5, .0, d) * vA); }`
}));

// ---------- 4. Escena y cámara ----------
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
renderer.setClearColor(0x000000, 0);
cont.appendChild(renderer.domElement);
const escena = new THREE.Scene();
escena.add(red, senales);
for (let s = 0; s <= ESTELAS; s++) { const pts = new THREE.Points(geo, material(s * .028)); pts.renderOrder = -s; escena.add(pts); }
const cam = new THREE.PerspectiveCamera(movil ? 50 : 40, 1, .1, 200);
let tam = '';
function lienzo() {
  const w = cont.clientWidth || innerWidth, h = cont.clientHeight || innerHeight, f = w + 'x' + h;
  if (f !== tam) { tam = f; renderer.setSize(w, h); cam.aspect = w / h; }
  return [w, h];
}
// coloca el isotipo en pantalla: centro (cx, cy) y diámetro D en píxeles
function encuadre(w, h, cx, cy, D, k = 1) {
  const z = 6.2 * h / (D * 2 * Math.tan(cam.fov * Math.PI / 360));
  U.uEsc.value = z / 12 * (w < 861 ? .6 : 1) * k;
  cam.setViewOffset(w, h, w / 2 - cx, h / 2 - cy, w, h);
  cam.updateProjectionMatrix();
  return z;
}
// destino final: el isotipo del logotipo DESEC del encabezado (medido: 24 % del ancho, 75 % del alto)
const logoDesec = document.querySelector('.logo-desec');
function destino() {
  const b = cont.getBoundingClientRect(), r = logoDesec.getBoundingClientRect();
  const lado = r.height * .749;
  return [r.left - b.left + r.width * .1199, r.top - b.top + lado / 2, lado];
}
const raton = new THREE.Vector2(99, 99), rObj = new THREE.Vector2(0, 0);
addEventListener('pointermove', e => {
  const b = cont.getBoundingClientRect();
  const nx = (e.clientX - b.left) / b.width * 2 - 1, ny = -((e.clientY - b.top) / b.height * 2 - 1); rObj.set(nx, ny);
  const v = new THREE.Vector3(nx, ny, .5).unproject(cam).sub(cam.position).normalize();
  const t = -cam.position.z / v.z; raton.set(cam.position.x + v.x * t, cam.position.y + v.y * t);
});
const sm = (a, b, x) => { const t = Math.min(Math.max((x - a) / (b - a), 0), 1); return t * t * (3 - 2 * t); };
const io = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

// ---------- 5. Partitura ----------
// formación al centro (≈4.6 s) → vuelo al logotipo del encabezado (5.0–6.2 s) → se funde con él
const F0 = 5.0, F1 = 6.2, LLEGA = 6.05, APAGA = 6.7;
let t0 = performance.now(), avisado = {};
const avisar = (n, c) => { if (!avisado[n] && c) { avisado[n] = 1; document.dispatchEvent(new Event('apertura:' + n)); } };
function saltar() { t0 = performance.now() - 9000; }
if (reducido) saltar();
document.addEventListener('apertura:saltar', saltar);
const portada = document.getElementById('portada');
function cuadro() {
  const T = (performance.now() - t0) / 1000;
  avisar('textos', T > T_TEXTOS); avisar('llega', T > LLEGA); avisar('fin', T > APAGA);
  if (T > APAGA) { cont.style.visibility = 'hidden'; return; }   // terminó: ya no se dibuja nada
  requestAnimationFrame(cuadro);
  if (portada.hidden || document.hidden) return;
  const [w, h] = lienzo();
  const A = T * VEL;
  U.uT.value = A;
  U.uMouse.value.lerp(raton, .08);
  // encuadre: al centro mientras se forma; luego vuela al logotipo
  const Dc = w < 861 ? Math.min(w * .72, h * .4) : Math.min(w * .42, h * .52);
  const [dx, dy, dD] = destino();
  const f = io(sm(F0, F1, T) ** 1);
  const cx = w / 2 + (dx - w / 2) * f, cy = h / 2 + (dy - h / 2) * f;
  const D = Dc * Math.pow(dD / Dc, f);                       // escala geométrica: se siente como alejarse
  const zf = encuadre(w, h, cx, cy, D, Math.pow(D / Dc, .8));   // los puntos se afinan al encogerse
  const z = 3.2 + 18.5 * sm(.6, 3.8, A) - (21.7 - zf) * sm(4.4, 6.75, A);
  const quieto = sm(F0 - .6, F0, T);                          // sin vaivén ni ratón al volar
  const x = (1.8 * (1 - sm(.4, 3.8, A)) + Math.sin(A * .4) * .3 + rObj.x * .35) * (1 - quieto);
  const y = (-.6 * (1 - sm(.4, 3.8, A)) + Math.cos(A * .33) * .18 + rObj.y * .22) * (1 - quieto);
  cam.position.set(x, y, T > F0 ? zf : z);
  cam.lookAt(0, 0, 0);
  U.uFoco.value = cam.position.length() * (A < 3 ? .55 : 1);
  U.uFade.value = sm(LLEGA - .05, LLEGA + .3, T);
  renderer.render(escena, cam);
}
cuadro();

(() => {
"use strict";
const F = window.FORM;
const API = (window.API_URL || "").trim();
const DEMO = !API;
const MAX = 25 * 1024 * 1024;
const $ = (s, el = document) => el.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const ls = { get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} } };

const INTRO = {
  1: "Lo básico del proyecto. Si algo no lo tiene a la mano, márquelo y siga.",
  2: "Para no repetir lo que ya se financió y saber si esto continúa algo anterior.",
  3: "Las personas que coordinan, conocen el detalle, firman y comprueban.",
  4: "Con esto definimos la mejor vía legal para que el recurso llegue.",
  5: "Solo aparece porque el proyecto incluye formación o certificación.",
  6: "Solo aparece porque el proyecto incluye equipo, materiales, licencias o adecuaciones.",
  7: "Fechas, metas y lo que debamos saber antes de vernos en Juárez."
};

let S = { codigo: null, r: {}, a: {}, estado: "En llenado", paso: 0, u: "", p: "", inst: "" };
// paso: índice de pantalla visible (0..n-1) o "repaso" / "fin"
const todas = F.pantallas.flatMap(p => p.preguntas.map(q => ({ ...q, pantalla: p.n })));
const porId = Object.fromEntries(todas.map(q => [q.id, q]));

/* ================= servidor ================= */
function demoApi(d) {
  // demostración local: usuario «prueba.desec», contraseña «demo123»
  if (d.usuario !== "prueba.desec" || d.contrasena !== "demo123") return { ok: false, error: "El usuario o la contraseña no coinciden." };
  const db = ls.get("demo_db") || {};
  const r = {};
  if (d.accion === "entrar") { r.institucion = "Prueba DESEC"; r.usuario = d.usuario; r.proyectos = Object.entries(db).map(([c, p]) => ({ codigo: c, proyecto: (p.respuestas["1.2"] || {}).v || "", estado: p.estado, avance: p.avance || 0, actualizado: p.t || "" })); }
  else if (d.accion === "nuevo") { const c = Array.from({ length: 10 }, () => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[Math.floor(Math.random() * 32)]).join(""); db[c] = { respuestas: {}, archivos: {}, estado: "En llenado" }; r.codigo = c; }
  else {
    const p = db[d.codigo]; if (!p) return { ok: false, error: "No encontramos ese proyecto" };
    p.t = new Date().toISOString(); if (d.resumen) p.avance = d.resumen.avance;
    if (d.accion === "cargar") Object.assign(r, { respuestas: p.respuestas, archivos: p.archivos, estado: p.estado });
    if (d.accion === "guardar") p.respuestas = d.respuestas;
    if (d.accion === "subir") { const it = { id: "f" + Date.now() + Math.random().toString(36).slice(2, 6), nombre: d.nombre, tam: Math.round(d.datos.length * .75) }; (p.archivos[d.pregunta] = p.archivos[d.pregunta] || []).push(it); r.archivo = it; r.archivos = p.archivos; }
    if (d.accion === "borrar") { for (const k in p.archivos) p.archivos[k] = p.archivos[k].filter(a => a.id !== d.id); r.archivos = p.archivos; }
    if (d.accion === "enviar") { p.respuestas = d.respuestas; p.estado = "Enviado"; }
  }
  ls.set("demo_db", db); r.ok = true; return r;
}
function api(d, onProgress) {
  d = { usuario: S.u, contrasena: S.p, ...d };
  if (DEMO) return new Promise((res, rej) => setTimeout(() => { const j = demoApi(d); j.ok ? res(j) : rej(new Error(j.error)); }, d.accion === "subir" ? 700 : 250));
  return new Promise((res, rej) => {
    const x = new XMLHttpRequest();
    x.open("POST", API);
    x.setRequestHeader("Content-Type", "text/plain;charset=utf-8");
    x.timeout = d.accion === "subir" ? 300000 : 45000;
    // sin x.upload.onprogress: agregarlo fuerza una consulta previa (CORS) que Apps Script no responde
    x.onload = () => { try { const j = JSON.parse(x.responseText); j.ok ? res(j) : rej(new Error(j.error || "Error")); } catch { rej(new Error("Respuesta inválida del servidor")); } };
    x.onerror = () => rej(new Error("Sin conexión"));
    x.ontimeout = () => rej(new Error("Tardó demasiado"));
    x.send(JSON.stringify(d));
  });
}

/* ================= lógica ================= */
const val = id => S.r[id] || {};
function contestada(q) {
  const v = val(q.id);
  if (v.salida) return true;
  if ((S.a[q.id] || []).length || (v.enlaces || []).length) return true;
  if (q.grupo && grupoLleno(q, v) > 0) return true;
  if (q.grupo && q.grupo.reemplaza) return false;
  if (Array.isArray(v.v)) return v.v.length > 0;
  return !!String(v.v ?? "").trim();
}
const lleno = x => !!String(x ?? "").trim();
function filasDe(q, v) { return q.grupo.repetible ? ((v.filas && v.filas.length) ? v.filas : [{}]) : [v.g || {}]; }
// cuántos datos (o renglones) tiene llenos un grupo
function grupoLleno(q, v) {
  const G = q.grupo;
  if (G.repetible) return (v.filas || []).filter(f => G.campos.some(c => lleno(f[c.k]))).length;
  return G.campos.filter(c => lleno((v.g || {})[c.k])).length;
}
function grupoResumen(q, v) {
  const G = q.grupo, n = grupoLleno(q, v);
  if (!n) return "";
  if (G.repetible) {
    const prim = (v.filas || []).filter(f => G.campos.some(c => lleno(f[c.k]))).map(f => G.campos.map(c => f[c.k]).filter(lleno)[0]).slice(0, 3);
    return n + (n === 1 ? " renglón: " : " renglones: ") + prim.join(", ") + (n > 3 ? "…" : "");
  }
  return G.campos.map(c => (v.g || {})[c.k]).filter(lleno).slice(0, 3).join(" · ");
}
function grupoTexto(q, v) {
  const G = q.grupo;
  const fila = f => G.campos.filter(c => lleno(f[c.k])).map(c => c.l + ": " + f[c.k]).join("; ");
  return G.repetible ? (v.filas || []).map(fila).filter(Boolean).map((t, i) => (i + 1) + ") " + t).join(" ") : fila(v.g || {});
}
function elegido(id) { const v = val(id); if (v.salida) return null; return Array.isArray(v.v) ? v.v : (v.v ? [v.v] : []); }
function seccionActiva(nombre) {
  const sel = elegido("1.5");
  if (!sel || !sel.length) return true; // sin decidir: se muestra
  const claves = [...F.secciones[nombre], "Otro"];
  return sel.some(s => claves.some(c => s.startsWith(c)));
}
function visible(q) {
  const c = q.cond; if (!c) return true;
  if (c.seccion) return seccionActiva(c.seccion);
  if (c.q && !visible(porId[c.q])) return false;
  const sel = elegido(c.q);
  if (c.en) return !!(sel && sel.some(s => c.en.some(e => s.startsWith(e))));
  if (c.no) return !(sel && sel.some(s => c.no.some(e => s.startsWith(e))));
  return true;
}
const pantallasVisibles = () => F.pantallas.filter(p => p.preguntas.some(visible));
function avancePantalla(p) { const qs = p.preguntas.filter(visible); return qs.length ? qs.filter(contestada).length / qs.length : 1; }
function avanceTotal() { const qs = todas.filter(visible); return qs.filter(contestada).length / qs.length; }

function resumen() {
  const vis = todas.filter(visible);
  const juarez = vis.filter(q => val(q.id).salida).map(q => `${q.id} · ${corto(q.texto)} — ${val(q.id).salida}`);
  const sin = vis.filter(q => !contestada(q)).map(q => `${q.id} · ${corto(q.texto)} — sin contestar`);
  const legible = todas.map(q => [q.id, visible(q) ? texto(q) : "(no aplica)"]);
  return {
    proyecto: (val("1.2").v || "").trim(), quien: [val("1.1").g?.nombre, val("1.1").g?.cargo, val("1.1").g?.institucion].filter(lleno).join(", "),
    avance: Math.round(avanceTotal() * 100), pendientes: [...juarez, ...sin].join("\n"), legible
  };
}
function corto(t) { t = t.replace(/\s+/g, " "); return t.length > 70 ? t.slice(0, 68) + "…" : t; }
function texto(q) {
  const v = val(q.id); const partes = [];
  if (v.salida) partes.push("[" + v.salida + "]");
  if (Array.isArray(v.v)) partes.push(v.v.map(o => v.otros?.[o] ? `${o}: ${v.otros[o]}` : o).join("; "));
  else if (v.v) partes.push(v.otros?.[v.v] ? `${v.v}: ${v.otros[v.v]}` : v.v);
  if (q.grupo) { const g = grupoTexto(q, v); if (g) partes.push(g); }
  if (lleno(v.extra)) partes.push("Algo más: " + v.extra);
  const arch = (S.a[q.id] || []).map(a => a.nombre);
  if (arch.length) partes.push("Archivos: " + arch.join(", "));
  if ((v.enlaces || []).length) partes.push("Enlaces: " + v.enlaces.join(" "));
  return partes.join(" | ");
}

/* ================= guardado ================= */
let tGuardar = null, guardando = false, pendiente = false;
function setGuardado(est, txt) { const g = $("#guardado"); g.className = "guardado " + est; $("span", g).textContent = txt; }
function cambio() {
  pendiente = true; ls.set("ficha_" + S.codigo, { r: S.r, t: Date.now() });
  setGuardado("guardando", "Guardando…");
  clearTimeout(tGuardar); tGuardar = setTimeout(guardar, 1100);
  pintarProgreso();
}
async function guardar() {
  if (guardando) { clearTimeout(tGuardar); tGuardar = setTimeout(guardar, 800); return; }
  if (!pendiente) return;
  guardando = true; pendiente = false;
  try {
    await api({ accion: "guardar", codigo: S.codigo, respuestas: S.r, resumen: resumen() });
    setGuardado("ok", (innerWidth < 861 ? "Guardado" : "Guardado · " + new Date().toLocaleTimeString("es-MX", { hour: "numeric", minute: "2-digit" })));
  } catch (e) {
    pendiente = true; setGuardado("error", innerWidth < 861 ? "Sin conexión" : "Sin conexión: lo guardamos en cuanto vuelva");
    clearTimeout(tGuardar); tGuardar = setTimeout(guardar, 6000);
  } finally { guardando = false; }
}
window.addEventListener("online", () => pendiente && guardar());
window.addEventListener("beforeunload", e => { if (pendiente || subiendo > 0) { e.preventDefault(); e.returnValue = ""; } });

/* ================= anillos (isotipo DESEC) ================= */
const NS = "http://www.w3.org/2000/svg";
function arco(cx, cy, r, a0, a1) {
  const p = a => [cx + r * Math.cos(a * Math.PI / 180), cy + r * Math.sin(a * Math.PI / 180)];
  const [x0, y0] = p(a0), [x1, y1] = p(a1);
  return `M${x0.toFixed(2)} ${y0.toFixed(2)} A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
}
// abertura arriba a la derecha, como el isotipo
const A0 = -50, A1 = 262;
function dibujarAnillos(svg, n, cx, r0, paso, grosor) {
  svg.innerHTML = "";
  for (let i = 0; i < n; i++) {
    const r = r0 - i * paso;
    for (const cls of ["fondo", "lleno"]) {
      const pth = document.createElementNS(NS, "path");
      pth.setAttribute("d", arco(cx, cx, r, A0, A1));
      pth.setAttribute("fill", "none"); pth.setAttribute("stroke-linecap", "round"); pth.setAttribute("stroke-width", grosor);
      pth.dataset.i = i; pth.classList.add("a-" + cls);
      svg.appendChild(pth);
    }
  }
  svg.querySelectorAll(".a-fondo").forEach(p => p.setAttribute("stroke", "rgba(255,255,255,.2)"));
  svg.querySelectorAll(".a-lleno").forEach(p => {
    const L = p.getTotalLength(); p.style.strokeDasharray = L; p.style.strokeDashoffset = L;
    p.style.transition = "stroke-dashoffset .9s cubic-bezier(.2,.7,.2,1), stroke .4s";
  });
}
function llenarAnillos(svg, valores, actual) {
  svg.querySelectorAll(".a-lleno").forEach(p => {
    const i = +p.dataset.i, L = p.getTotalLength(), v = valores[i] ?? 0;
    p.style.strokeDashoffset = L * (1 - v);
    p.setAttribute("stroke", i === actual ? "#FAB51B" : (v >= 1 ? "#FFFFFF" : "rgba(255,255,255,.75)"));
  });
}
function pintarProgreso() {
  const vis = pantallasVisibles();
  const vals = vis.map(avancePantalla);
  const idx = typeof S.paso === "number" ? S.paso : -1;
  llenarAnillos($("#anillos"), vals, idx);
  const pct = Math.round(avanceTotal() * 100);
  $("#pct").textContent = pct;
  if ($("#anilloMovil").children.length / 2 !== vis.length) dibujarAnillos($("#anilloMovil"), vis.length, 24, 22, 2.8, 1.8);
  llenarAnillos($("#anilloMovil"), vals, idx);
  if ($("#anillos").children.length / 2 !== vis.length) { dibujarAnillos($("#anillos"), vis.length, 150, 140, 17, 9); requestAnimationFrame(() => llenarAnillos($("#anillos"), vals, idx)); }
  pintarPasos(); pintarExpediente();
  document.querySelectorAll(".pregunta").forEach(el => {
    const q = porId[el.dataset.id]; if (!q) return;
    el.classList.toggle("es-contestada", contestada(q) && !val(q.id).salida);
    el.classList.toggle("es-juarez", !!val(q.id).salida);
  });
}
function pintarPasos() {
  const vis = pantallasVisibles();
  const nav = $("#pasos");
  nav.innerHTML = vis.map((p, i) => {
    const v = avancePantalla(p);
    const cls = i === S.paso ? "es-actual" : (v >= 1 ? "es-lista" : "");
    return `<button class="paso ${cls}" data-i="${i}"><span class="paso__n">${v >= 1 && i !== S.paso ? "✓" : p.n}</span><span class="paso__t">${esc(p.titulo)}</span><span class="paso__v">${Math.round(v * 100)}%</span></button>`;
  }).join("") + `<button class="paso ${S.paso === "repaso" ? "es-actual" : ""}" data-i="repaso"><span class="paso__n">✓</span><span class="paso__t">Revisar y enviar</span></button>`;
}

/* ================= expediente ================= */
function pintarExpediente() {
  $("#expProyecto").textContent = (val("1.2").v || "").trim() || "Proyecto sin nombre";
  const vis = todas.filter(visible);
  const docs = vis.filter(q => q.adjunto);
  const nArch = Object.values(S.a).reduce((s, l) => s + l.length, 0) + vis.reduce((s, q) => s + (val(q.id).enlaces || []).length, 0);
  const jz = vis.filter(q => val(q.id).salida).length;
  $("#expResumen").innerHTML = `<div class="cifra"><b>${nArch}</b><span>${nArch === 1 ? "archivo o enlace" : "archivos y enlaces"}</span></div><div class="cifra cifra--ambar"><b>${jz}</b><span>para ver en Juárez</span></div>`;
  $("#expCuentaMovil").textContent = nArch;
  const item = q => {
    const v = val(q.id), n = (S.a[q.id] || []).length + (v.enlaces || []).length;
    const [cls, ico, sub] = n ? ["est--ok", "✓", n + (n === 1 ? " archivo" : " archivos")] : v.salida ? ["est--jz", "J", "Lo vemos en Juárez"] : ["est--pend", "", "Pendiente"];
    return `<li><span class="est ${cls}">${ico}</span><button data-ir="${q.id}">${esc(q.adjunto.etiqueta)}<small>${q.id} · ${sub}</small></button></li>`;
  };
  const grupos = {};
  docs.forEach(q => (grupos[q.pantalla] = grupos[q.pantalla] || []).push(q));
  const jzSin = vis.filter(q => !q.adjunto && val(q.id).salida);
  $("#expLista").innerHTML = (jzSin.length ? `<li class="expediente__grupo">Lo vemos en Juárez</li>` + jzSin.map(q => `<li><span class="est est--jz">J</span><button data-ir="${q.id}">${esc(corto(q.texto))}<small>${q.id} · ${esc(val(q.id).salida)}</small></button></li>`).join("") : "") + Object.entries(grupos).map(([n, qs]) => `<li class="expediente__grupo">${esc(F.pantallas[n - 1].titulo)}</li>` + qs.map(item).join("")).join("");
}

/* ================= render de pantallas ================= */
const ICO = {
  juarez: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M8 1.5a5 5 0 0 0-5 5c0 3.6 5 8 5 8s5-4.4 5-8a5 5 0 0 0-5-5Z"/><circle cx="8" cy="6.5" r="1.8"/></svg>',
  subir: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M10 13V3M6 7l4-4 4 4M3 13v2.5A1.5 1.5 0 0 0 4.5 17h11a1.5 1.5 0 0 0 1.5-1.5V13"/></svg>',
  mas: '<svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10 4v12M4 10h12"/></svg>',
  flecha: '<svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 8l5 5 5-5"/></svg>',
  xls: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="4" y="2.5" width="16" height="19" rx="2.5"/><path d="M8 8.5l8 7M16 8.5l-8 7"/></svg>'
};
function htmlPregunta(q) {
  const v = val(q.id);
  let cuerpo = "";
  const t = q.tipo;
  if (t === "corto") cuerpo = `<input class="campo" data-f="v" value="${esc(v.v)}" aria-label="${esc(q.texto)}">`;
  if (t === "largo") cuerpo = `<textarea class="campo" data-f="v" rows="4" aria-label="${esc(q.texto)}">${esc(v.v)}</textarea>`;
  if (t === "numero") cuerpo = `<input class="campo campo--corto" data-f="v" inputmode="numeric" value="${esc(v.v)}" placeholder="0" aria-label="${esc(q.texto)}">`;
  if (t === "moneda") cuerpo = `<div class="moneda campo--corto"><input class="campo campo--moneda" data-f="v" inputmode="decimal" value="${esc(v.v)}" placeholder="0.00" aria-label="${esc(q.texto)}"></div>`;
  if (t === "fecha") cuerpo = `<input class="campo campo--corto" type="date" data-f="v" value="${esc(v.v)}" min="2026-11-01" max="2028-12-31" aria-label="${esc(q.texto)}">`;
  if (t === "unica" || t === "varias") {
    const sel = Array.isArray(v.v) ? v.v : (v.v ? [v.v] : []);
    cuerpo = `<div class="opciones" role="${t === "unica" ? "radiogroup" : "group"}" aria-label="${esc(q.texto)}">` + q.opciones.map(o => {
      const on = sel.includes(o.v);
      return `<label class="opcion ${t === "varias" ? "opcion--varias" : ""} ${on ? "sel" : ""}"><input type="${t === "unica" ? "radio" : "checkbox"}" name="q${q.id}" value="${esc(o.v)}" ${on ? "checked" : ""}><span class="opcion__marca"></span><span>${esc(o.v.replace(/\s*\((¿[^)]*|explique)\)$/, ""))}</span></label>` +
        (o.otro && on ? `<input class="campo opcion__otro" data-otro="${esc(o.v)}" placeholder="${esc((o.v.match(/\((¿[^)]*\??|explique)\)/) || [, "Escriba aquí"])[1].replace(/^¿/, "¿"))}" value="${esc(v.otros?.[o.v])}">` : "");
    }).join("") + `</div>`;
  }
  if (q.adjunto && q.adjunto.principal) cuerpo = "";
  if (q.grupo) cuerpo = (q.grupo.reemplaza ? "" : cuerpo) + htmlGrupo(q, v);
  let adj = "";
  if (q.adjunto) {
    const archivos = S.a[q.id] || [];
    adj = `<div class="adjunto">` +
      (q.plantilla ? `<a class="plantilla" href="${esc(q.plantilla.url)}" download>${ICO.xls}<div>Descargar ${esc(q.plantilla.nombre.toLowerCase())}<span>Excel · llénela y súbala aquí</span></div></a>` : "") +
      `<div class="zona" data-zona="${q.id}"><input type="file" multiple aria-label="Subir: ${esc(q.adjunto.etiqueta)}"><span class="zona__ico">${ICO.subir}</span><b>${esc(q.adjunto.etiqueta)}</b><span>Arrastre aquí o toque para elegir · PDF, Excel, Word, fotos · hasta 25 MB</span></div>` +
      `<ul class="archivos" data-lista="${q.id}">${archivos.map(htmlArchivo).join("")}</ul>` +
      `<details class="enlaces" ${(v.enlaces || []).length ? "open" : ""}><summary>¿Pesa más de 25 MB o ya está en la nube? Pegue un enlace</summary>` +
      `<div class="enlaces__fila"><input class="campo" data-enlace placeholder="https://drive.google.com/… o OneDrive, Dropbox"><button class="btn btn--linea" data-agregar-enlace>Agregar</button></div>` +
      `<ul class="archivos">${(v.enlaces || []).map((u, i) => `<li class="archivo ok"><span class="archivo__ico">URL</span><span class="archivo__txt"><b>${esc(u)}</b></span><button class="archivo__quitar" data-quitar-enlace="${i}" aria-label="Quitar enlace">×</button></li>`).join("")}</ul></details></div>`;
  }
  const salidas = (q.salidas || []).map(s => `<button type="button" class="chip ${v.salida === s ? "sel" : ""}" data-salida="${esc(s)}" aria-pressed="${v.salida === s}">${ICO.juarez}${esc(s)} · lo vemos en Juárez</button>`).join("");
  return `<article class="pregunta" data-id="${q.id}" id="q-${q.id.replace(".", "-")}">
    <div class="pregunta__cab"><span class="pregunta__n">${q.id}</span><h3 class="pregunta__t">${esc(q.texto)}${q.obligatoria ? '<span class="pregunta__ob">Necesaria</span>' : ""}</h3></div>
    ${q.ayuda ? `<p class="pregunta__ayuda">${esc(q.ayuda)}</p>` : '<div style="height:10px"></div>'}
    <div class="pregunta__cuerpo"><div class="campo-wrap">${cuerpo}${adj}${htmlExtra(q, v)}</div>${salidas ? `<div class="salida">${salidas}</div>` : ""}</div>
  </article>`;
}
const abiertos = new Set(), extras = new Set();
const MESES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
function htmlCampo(c, valor, i) {
  const a = `data-g="${c.k}" data-fila="${i}" placeholder="${esc(c.ph ? "Ej. " + c.ph : "")}"`;
  let inp;
  if (c.t === "largo") inp = `<textarea class="campo" rows="3" ${a}>${esc(valor)}</textarea>`;
  else if (c.t === "mes") inp = `<select class="campo" data-g="${c.k}" data-fila="${i}"><option value="">Elija el mes</option>${MESES.map(m => `<option ${valor === m ? "selected" : ""}>${m}</option>`).join("")}</select>`;
  else if (c.t === "moneda") inp = `<div class="moneda"><input class="campo campo--moneda" inputmode="decimal" value="${esc(valor)}" ${a}></div>`;
  else inp = `<input class="campo" ${c.t === "correo" ? 'type="email" inputmode="email"' : c.t === "tel" ? 'type="tel" inputmode="tel"' : c.t === "numero" ? 'inputmode="numeric"' : ""} value="${esc(valor)}" ${a}>`;
  return `<label class="gcampo gcampo--${c.t}"><span>${esc(c.l)}</span>${inp}</label>`;
}
function htmlGrupo(q, v) {
  const G = q.grupo, abierto = abiertos.has(q.id), filas = filasDe(q, v);
  const n = grupoLleno(q, v), total = G.repetible ? null : G.campos.length;
  const cuenta = G.repetible ? (n ? n + (n === 1 ? " renglón" : " renglones") : "") : n + " de " + total;
  const res = grupoResumen(q, v);
  return `<div class="grupo ${abierto ? "abierto" : ""} ${n && (G.repetible || n === total) ? "completo" : ""}">
    <button type="button" class="grupo__boton" data-grupo="${q.id}" aria-expanded="${abierto}">
      <span class="grupo__ico">${n && (G.repetible || n === total) ? "✓" : ICO.mas}</span>
      <span class="grupo__txt"><b>${esc(G.titulo)}</b><small>${res ? esc(res) : "Haga clic aquí para llenar"}</small></span>
      ${cuenta ? `<span class="grupo__cuenta">${cuenta}</span>` : ""}<span class="grupo__flecha" aria-hidden="true">${ICO.flecha}</span>
    </button>
    <div class="grupo__cuerpo" ${abierto ? "" : "hidden"}>
      ${filas.map((f, i) => `<div class="grupo__fila ${G.repetible ? "grupo__fila--rep" : ""}">${G.repetible ? `<span class="grupo__num">${i + 1}</span>` : ""}${G.campos.map(c => htmlCampo(c, f[c.k], i)).join("")}${G.repetible && filas.length > 1 ? `<button type="button" class="grupo__quitar" data-fila-quitar="${i}" aria-label="Quitar renglón ${i + 1}">×</button>` : ""}</div>`).join("")}
      ${G.repetible ? `<button type="button" class="mas" data-fila-agregar>+ ${esc(G.agregar)}</button>` : ""}
    </div>
  </div>`;
}
function htmlExtra(q, v) {
  if (lleno(v.extra) || extras.has(q.id))
    return `<label class="gcampo extra"><span>Algo más que quiera agregar</span><textarea class="campo" rows="3" data-f="extra" placeholder="Escriba aquí cualquier dato, aclaración o comentario adicional">${esc(v.extra)}</textarea></label>`;
  return `<button type="button" class="mas mas--suave" data-extra>+ ¿Desea agregar algo más?</button>`;
}
function actualizarGrupo(q) {
  const el = document.querySelector(`.pregunta[data-id="${q.id}"] .grupo`); if (!el) return;
  const v = val(q.id), G = q.grupo, n = grupoLleno(q, v), total = G.campos.length;
  el.querySelector(".grupo__txt small").textContent = grupoResumen(q, v) || "Haga clic aquí para llenar";
  const c = el.querySelector(".grupo__cuenta"), txt = G.repetible ? (n ? n + (n === 1 ? " renglón" : " renglones") : "") : n + " de " + total;
  if (c) c.textContent = txt;
  const ok = n && (G.repetible || n === total);
  el.classList.toggle("completo", !!ok);
  el.querySelector(".grupo__ico").innerHTML = ok ? "✓" : ICO.mas;
}
function htmlArchivo(a) {
  const ext = (a.nombre.split(".").pop() || "").slice(0, 4).toUpperCase();
  const est = a.subiendo ? "" : a.error ? "error" : "ok";
  return `<li class="archivo ${est}" data-arch="${esc(a.id)}"><span class="archivo__ico">${esc(ext || "DOC")}</span><span class="archivo__txt"><b>${esc(a.nombre)}</b><small>${a.error ? esc(a.error) : a.subiendo ? "Subiendo…" : tam(a.tam) + " · guardado"}</small>${a.subiendo ? `<div class="archivo__barra archivo__barra--anim"><i></i></div>` : ""}</span>${a.subiendo ? "" : `<button class="archivo__quitar" data-quitar="${esc(a.id)}" aria-label="Quitar archivo">×</button>`}</li>`;
}
const tam = b => b > 1048576 ? (b / 1048576).toFixed(1) + " MB" : Math.max(1, Math.round(b / 1024)) + " KB";

function mostrar(paso, foco) {
  const vis = pantallasVisibles();
  if (typeof paso === "number") paso = Math.max(0, Math.min(paso, vis.length - 1));
  S.paso = paso;
  const el = $("#pantalla");
  if (paso === "repaso") el.innerHTML = htmlRepaso();
  else if (paso === "fin") el.innerHTML = htmlFin();
  else {
    const p = vis[paso];
    el.innerHTML = `<header class="pantalla__cab"><p class="kicker">Pantalla ${paso + 1} de ${vis.length}</p><h1 class="pantalla__titulo">${esc(p.titulo)}</h1><p class="pantalla__intro">${esc(INTRO[p.n] || "")}</p></header>` +
      (paso === 0 ? `<ol class="guia" aria-label="Cómo llenar">
        <li><span class="guia__ico guia__ico--azul">${ICO.mas}</span><b>Toque los botones azules</b><small>se despliegan los cuadros para llenar</small></li>
        <li><span class="guia__ico">+</span><b>Use «+ Agregar»</b><small>para sumar renglones o un comentario</small></li>
        <li><span class="guia__ico guia__ico--ambar">${ICO.juarez}</span><b>¿No lo tiene?</b><small>marque «Aún no lo tenemos» y siga</small></li>
      </ol>` : "") +
      p.preguntas.map(q => visible(q) ? htmlPregunta(q) : `<div class="oculta" data-oculta="${q.id}" hidden></div>`).join("");
    $("#movilPaso").textContent = `Pantalla ${paso + 1} de ${vis.length}`;
    $("#movilTitulo").textContent = p.titulo;
  }
  if (paso === "repaso") { $("#movilPaso").textContent = "Último paso"; $("#movilTitulo").textContent = "Revisar y enviar"; }
  if (paso === "fin") { $("#movilPaso").textContent = "Enviado"; $("#movilTitulo").textContent = "Ficha recibida"; }
  document.querySelector(".navegacion").hidden = paso === "fin";
  el.classList.remove("entra"); void el.offsetWidth; el.classList.add("entra");
  llamados.clear(); setTimeout(vigilar, 450);
  $("#btnAnterior").disabled = paso === 0 || paso === "fin";
  const sig = $("#btnSiguiente");
  sig.hidden = paso === "fin";
  sig.textContent = paso === "repaso" ? (S.estado === "Enviado" ? "Enviar de nuevo" : "Enviar a DESEC") : (paso === vis.length - 1 ? "Revisar y enviar →" : "Siguiente →");
  sig.className = "btn " + (paso === "repaso" ? "btn--ambar" : "btn--azul");
  pintarProgreso();
  if (foco) { const t = document.getElementById("q-" + foco.replace(".", "-")); if (t) { t.scrollIntoView({ behavior: "smooth", block: "center" }); const i = t.querySelector("input,textarea,button"); i && setTimeout(() => i.focus({ preventScroll: true }), 400); return; } }
  window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  $("#principal").scrollTop = 0;
  ls.set("ficha_paso_" + S.codigo, paso);
}

function htmlRepaso() {
  const vis = pantallasVisibles();
  const qs = todas.filter(visible);
  const jz = qs.filter(q => val(q.id).salida), sin = qs.filter(q => !contestada(q));
  const faltan = ["1.1", "1.2"].filter(id => !String(val(id).v || "").trim());
  const li = q => `<li><button data-ir="${q.id}">${q.id} · ${esc(corto(q.texto))}</button></li>`;
  return `<header class="pantalla__cab"><p class="kicker">Último paso</p><h1 class="pantalla__titulo">Revisar y enviar</h1><p class="pantalla__intro">No necesita tener todo. Lo marcado como pendiente lo resolvemos juntos en Ciudad Juárez. Puede seguir editando después de enviar.</p></header>
  <div class="repaso">${vis.map((p, i) => `<div class="repaso__p"><span class="paso__n" style="border-color:var(--linea);color:var(--azul)">${p.n}</span><b>${esc(p.titulo)}</b><small>${Math.round(avancePantalla(p) * 100)} %</small><button class="btn btn--linea" data-pantalla="${i}">Ver</button></div>`).join("")}</div>
  ${faltan.length ? `<div class="bloque" style="border-color:#F0B8B3"><h3>Antes de enviar falta</h3><ul>${faltan.map(id => li(porId[id])).join("")}</ul></div>` : ""}
  <div class="bloque"><h3>Lo vemos en Juárez (${jz.length})</h3>${jz.length ? `<ul>${jz.map(li).join("")}</ul>` : "<p style='margin:0;color:var(--gris)'>Nada marcado.</p>"}</div>
  <div class="bloque"><h3>Sin contestar (${sin.length})</h3>${sin.length ? `<p style="margin:0 0 4px;color:var(--gris)">Puede contestarlas o marcar «Aún no lo tenemos». No es obligatorio para enviar.</p>` +
    vis.map(p => { const l = sin.filter(q => q.pantalla === p.n); return l.length ? `<details class="sin"><summary><b>${esc(p.titulo)}</b><span>${l.length}</span></summary><ul>${l.map(li).join("")}</ul></details>` : ""; }).join("") : "<p style='margin:0;color:var(--gris)'>Todo contestado.</p>"}</div>`;
}
function htmlFin() {
  return `<div class="fin"><svg id="anilloFin" viewBox="0 0 300 300"></svg><h2>¡Listo! Recibimos su ficha.</h2>
  <p>Gracias. Revisaremos la información antes de la sesión de trabajo en Ciudad Juárez, del 17 al 18 de noviembre.</p>
  <p>Puede volver a entrar con su usuario para corregir o agregar documentos.</p>
  <p style="margin-top:22px;display:flex;gap:10px;justify-content:center;flex-wrap:wrap"><button class="btn btn--linea" data-pantalla="0">Seguir editando</button><button class="btn btn--azul" data-misfichas>Mis fichas</button></p></div>`;
}
const fmt = c => c ? c.slice(0, 5) + "-" + c.slice(5) : "";

/* ================= eventos del formulario ================= */
function q_(el) { const a = el.closest(".pregunta"); return a ? porId[a.dataset.id] : null; }
function setR(id, f) { const v = S.r[id] = S.r[id] || {}; f(v); cambio(); }
function refrescarCondiciones() {
  // muestra u oculta preguntas de la pantalla actual sin redibujar todo
  if (typeof S.paso !== "number") return;
  document.querySelectorAll("[data-oculta]").forEach(ph => {
    const q = porId[ph.dataset.oculta];
    if (visible(q)) { const t = document.createElement("div"); t.innerHTML = htmlPregunta(q); const n = t.firstElementChild; n.classList.add("aparece"); ph.replaceWith(n); if (vigia) vigia.observe(n); }
  });
  document.querySelectorAll(".pregunta").forEach(el => {
    const q = porId[el.dataset.id];
    if (!visible(q)) { const ph = document.createElement("div"); ph.className = "oculta"; ph.hidden = true; ph.dataset.oculta = q.id; el.replaceWith(ph); }
  });
}
document.addEventListener("input", e => {
  const el = e.target, q = q_(el); if (!q) return;
  if (el.dataset.f) setR(q.id, v => { v[el.dataset.f] = el.value; });
  else if (el.dataset.g) {
    const i = +el.dataset.fila;
    setR(q.id, v => {
      if (q.grupo.repetible) { v.filas = v.filas && v.filas.length ? v.filas : [{}]; v.filas[i] = v.filas[i] || {}; v.filas[i][el.dataset.g] = el.value; }
      else { v.g = v.g || {}; v.g[el.dataset.g] = el.value; }
    });
    actualizarGrupo(q);
  }
  else if (el.dataset.c) setR(q.id, v => { v.c = v.c || {}; v.c[el.dataset.c] = el.value; });
  else if (el.dataset.otro) setR(q.id, v => { v.otros = v.otros || {}; v.otros[el.dataset.otro] = el.value; });
});
document.addEventListener("change", e => {
  const el = e.target, q = q_(el); if (!q) return;
  if (el.type === "radio" || el.type === "checkbox") {
    setR(q.id, v => {
      if (el.type === "radio") v.v = el.value;
      else { const s = new Set(Array.isArray(v.v) ? v.v : []); el.checked ? s.add(el.value) : s.delete(el.value); v.v = q.opciones.map(o => o.v).filter(o => s.has(o)); }
      if (v.salida) delete v.salida;
    });
    redibujar(q);
    refrescarCondiciones(); pintarProgreso();
    if (el.type === "radio") { const a = document.querySelector(`.pregunta[data-id="${q.id}"]`); a && siguienteLlamado(a); }
  }
  if (el.type === "file") { subirArchivos(q, el.files); el.value = ""; }
  if (el.tagName === "SELECT" && el.dataset.g) el.dispatchEvent(new Event("input", { bubbles: true }));
});
function redibujar(q, foco) {
  const el = document.querySelector(`.pregunta[data-id="${q.id}"]`); if (!el) return;
  const t = document.createElement("div"); t.innerHTML = htmlPregunta(q); el.replaceWith(t.firstElementChild);
  const nuevo = document.querySelector(`.pregunta[data-id="${q.id}"]`);
  if (vigia) vigia.observe(nuevo);
  nuevo.classList.toggle("es-contestada", contestada(q) && !val(q.id).salida);
  nuevo.classList.toggle("es-juarez", !!val(q.id).salida);
  if (foco) { const i = nuevo.querySelector(foco); i && i.focus(); }
  else { const o = nuevo.querySelector(".opcion__otro"); if (o && !o.value) o.focus(); }
}
document.addEventListener("click", e => {
  const t = e.target.closest("button,[data-ir]"); if (!t) return;
  const q = q_(t);
  if (t.dataset.grupo && q) {
    const abrir = !abiertos.has(q.id); abrir ? abiertos.add(q.id) : abiertos.delete(q.id);
    const g = t.closest(".grupo"), cuerpo = g.querySelector(".grupo__cuerpo");
    g.classList.toggle("abierto", abrir); t.setAttribute("aria-expanded", abrir); cuerpo.hidden = !abrir;
    if (abrir) { const i = cuerpo.querySelector("input,textarea,select"); i && i.focus({ preventScroll: true }); }
  } else if (t.hasAttribute("data-fila-agregar") && q) {
    setR(q.id, v => { v.filas = v.filas && v.filas.length ? v.filas : [{}]; v.filas.push({}); });
    redibujar(q, ".grupo__fila:last-of-type input, .grupo__fila:last-of-type select");
  } else if (t.dataset.filaQuitar !== undefined && q) {
    setR(q.id, v => { v.filas.splice(+t.dataset.filaQuitar, 1); });
    redibujar(q, "[data-fila-agregar]");
  } else if (t.hasAttribute("data-extra") && q) {
    extras.add(q.id); redibujar(q, "[data-f=extra]");
  } else if (t.dataset.salida && q) {
    setR(q.id, v => { v.salida = v.salida === t.dataset.salida ? undefined : t.dataset.salida; if (!v.salida) delete v.salida; });
    redibujar(q, `[data-salida="${CSS.escape(t.dataset.salida)}"]`); refrescarCondiciones(); pintarProgreso();
  } else if (t.dataset.quitar && q) quitarArchivo(q, t.dataset.quitar);
  else if (t.hasAttribute("data-agregar-enlace") && q) {
    const inp = t.parentElement.querySelector("[data-enlace]"); const u = inp.value.trim();
    if (!/^https?:\/\/\S+\.\S+/.test(u)) { aviso("Pegue un enlace completo, que empiece con https://"); return; }
    setR(q.id, v => { v.enlaces = [...(v.enlaces || []), u]; delete v.salida; }); redibujar(q, "[data-enlace]");
  } else if (t.dataset.quitarEnlace && q) { setR(q.id, v => { v.enlaces.splice(+t.dataset.quitarEnlace, 1); }); redibujar(q); }
  else if (t.dataset.ir) { cerrarExp(); irA(t.dataset.ir); }
  else if (t.dataset.pantalla) mostrar(+t.dataset.pantalla);
  else if (t.classList.contains("paso")) mostrar(t.dataset.i === "repaso" ? "repaso" : +t.dataset.i);
});
/* ---------- guía visual: el cuadro donde va la respuesta «salta» brevemente ---------- */
const llamados = new Set();
function objetivo(el) { return el.querySelector(".grupo__boton, .opciones, .zona, .moneda, input.campo, textarea.campo, select.campo"); }
function llamar(el) {
  const q = porId[el.dataset.id]; if (!q || contestada(q)) return;
  const t = objetivo(el); if (!t) return;
  t.classList.remove("llamar"); void t.offsetWidth; t.classList.add("llamar");
  setTimeout(() => t.classList.remove("llamar"), 1700);
}
const vigia = "IntersectionObserver" in window ? new IntersectionObserver(ents => ents.forEach(e => {
  if (e.isIntersecting && !llamados.has(e.target.dataset.id)) { llamados.add(e.target.dataset.id); setTimeout(() => llamar(e.target), 250); }
}), { threshold: .55 }) : null;
function vigilar() { if (!vigia) return; vigia.disconnect(); document.querySelectorAll(".pregunta").forEach(el => vigia.observe(el)); }
function siguienteLlamado(desde) {
  // al terminar una pregunta, llama la atención sobre la siguiente sin contestar que esté a la vista
  let el = desde.nextElementSibling;
  while (el && !(el.classList.contains("pregunta") && !contestada(porId[el.dataset.id]))) el = el.nextElementSibling;
  if (!el) return;
  const r = el.getBoundingClientRect();
  if (r.top < innerHeight - 80 && r.bottom > 0) setTimeout(() => llamar(el), 200);
}
document.addEventListener("focusout", e => {
  const a = e.target.closest?.(".pregunta"); if (!a) return;
  setTimeout(() => { if (!a.contains(document.activeElement) && contestada(porId[a.dataset.id])) siguienteLlamado(a); }, 60);
});
function irA(id) { const vis = pantallasVisibles(); const i = vis.findIndex(p => p.n === porId[id].pantalla); mostrar(i, id); }

/* ---------- arrastrar y soltar ---------- */
document.addEventListener("dragover", e => { const z = e.target.closest?.(".zona"); if (z) { e.preventDefault(); z.classList.add("sobre"); } });
document.addEventListener("dragleave", e => { const z = e.target.closest?.(".zona"); z && z.classList.remove("sobre"); });
document.addEventListener("drop", e => { const z = e.target.closest?.(".zona"); if (!z) return; e.preventDefault(); z.classList.remove("sobre"); subirArchivos(q_(z), e.dataTransfer.files); });

/* ---------- archivos ---------- */
let subiendo = 0;
function leer(file) { return new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result).split(",")[1]); r.onerror = rej; r.readAsDataURL(file); }); }
async function reducirImagen(file) {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type) || file.size < 2.5 * 1048576) return file;
  try {
    const bmp = await createImageBitmap(file);
    const k = Math.min(1, 2560 / Math.max(bmp.width, bmp.height));
    const c = document.createElement("canvas"); c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
    c.getContext("2d").drawImage(bmp, 0, 0, c.width, c.height);
    const blob = await new Promise(r => c.toBlob(r, "image/jpeg", .85));
    return blob && blob.size < file.size ? new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" }) : file;
  } catch { return file; }
}
const enCurso = {};
function pintarLista(q) {
  const ul = document.querySelector(`[data-lista="${q.id}"]`); if (!ul) return;
  ul.innerHTML = [...(S.a[q.id] || []), ...(enCurso[q.id] || [])].map(htmlArchivo).join("");
}
async function subirArchivos(q, files) {
  for (const f0 of Array.from(files)) {
    const tmp = { id: "t" + Math.random().toString(36).slice(2), nombre: f0.name, tam: f0.size, subiendo: true, p: 0 };
    (enCurso[q.id] = enCurso[q.id] || []).push(tmp); pintarLista(q);
    subiendo++; setGuardado("guardando", "Subiendo archivo…");
    try {
      const f = await reducirImagen(f0);
      if (f.size > MAX) throw new Error("Pesa más de 25 MB: pegue un enlace abajo");
      if (!f.size) throw new Error("El archivo está vacío");
      const datos = await leer(f);
      const r = await api({ accion: "subir", codigo: S.codigo, pregunta: q.id, nombre: f.name, tipo: f.type, datos }, p => { tmp.p = p; const b = document.querySelector(`[data-arch="${tmp.id}"] .archivo__barra i`); b && (b.style.width = Math.round(p * 100) + "%"); });
      S.a = r.archivos;
      enCurso[q.id] = enCurso[q.id].filter(x => x !== tmp);
      if (val(q.id).salida) setR(q.id, v => { delete v.salida; });
    } catch (err) {
      tmp.subiendo = false; tmp.error = err.message === "Sin conexión" ? "No se pudo subir: revise su conexión e intente de nuevo" : err.message;
      setTimeout(() => { enCurso[q.id] = (enCurso[q.id] || []).filter(x => x !== tmp); pintarLista(q); }, 9000);
    } finally {
      subiendo--; pintarLista(q); pintarProgreso();
      if (!subiendo) setGuardado("ok", "Archivos guardados");
      if (!enCurso[q.id]?.length) { redibujar(q, ".zona input"); }
    }
  }
}
async function quitarArchivo(q, id) {
  if (id.startsWith("t")) { enCurso[q.id] = (enCurso[q.id] || []).filter(x => x.id !== id); pintarLista(q); return; }
  try { const r = await api({ accion: "borrar", codigo: S.codigo, id }); S.a = r.archivos; redibujar(q); pintarProgreso(); aviso("Archivo quitado"); }
  catch (e) { aviso("No se pudo quitar: " + e.message); }
}

/* ================= navegación ================= */
$("#btnAnterior").onclick = () => { if (S.paso === "repaso") mostrar(pantallasVisibles().length - 1); else mostrar(S.paso - 1); };
$("#btnSiguiente").onclick = async () => {
  if (S.paso === "repaso") return enviar();
  const vis = pantallasVisibles();
  if (S.paso === 0 && !String(val("1.2").v || "").trim()) { irA("1.2"); aviso("Escriba al menos el nombre del proyecto para continuar."); return; }
  if (S.paso >= vis.length - 1) mostrar("repaso"); else mostrar(S.paso + 1);
};
async function enviar() {
  const faltan = ["1.1", "1.2"].filter(id => !String(val(id).v || "").trim());
  if (faltan.length) { irA(faltan[0]); aviso("Falta: " + porId[faltan[0]].texto); return; }
  if (subiendo) { aviso("Espere a que terminen de subir los archivos."); return; }
  const b = $("#btnSiguiente"); b.disabled = true; b.textContent = "Enviando…";
  try {
    clearTimeout(tGuardar); pendiente = false;
    await api({ accion: "enviar", codigo: S.codigo, respuestas: S.r, resumen: resumen() });
    S.estado = "Enviado"; mostrar("fin");
    const svg = $("#anilloFin"); dibujarAnillos(svg, 7, 150, 140, 17, 9);
    svg.querySelectorAll(".a-fondo").forEach(p => p.setAttribute("stroke", "#E3DCCD"));
    requestAnimationFrame(() => setTimeout(() => svg.querySelectorAll(".a-lleno").forEach((p, i) => { p.style.transitionDelay = i * 90 + "ms"; p.style.strokeDashoffset = 0; p.setAttribute("stroke", i === 6 ? "#FAB51B" : "#003B7C"); }), 60));
  } catch (e) { aviso("No se pudo enviar: " + e.message + ". Intente de nuevo; sus respuestas están guardadas."); }
  finally { b.disabled = false; }
}

/* ================= expediente móvil ================= */
$("#btnExpMovil").onclick = () => $("#expediente").classList.add("abierto");
$("#btnExpCerrar").onclick = cerrarExp;
function cerrarExp() { $("#expediente").classList.remove("abierto"); }

/* ================= diálogos ================= */
function dialogo(html) { $("#dialogo").innerHTML = html; $("#velo").hidden = false; const f = $("#dialogo").querySelector("input,button"); f && f.focus(); }
function cerrarDialogo() { $("#velo").hidden = true; }
$("#velo").addEventListener("click", e => { if (e.target.id === "velo" || e.target.dataset.cerrar !== undefined) cerrarDialogo(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") { cerrarDialogo(); cerrarExp(); } });
let tAviso; function aviso(t) { const a = $("#aviso"); a.textContent = t; a.hidden = false; clearTimeout(tAviso); tAviso = setTimeout(() => a.hidden = true, 4200); }

/* ================= portada ================= */
const revelar = () => document.documentElement.classList.add("revelado");
document.addEventListener("apertura:textos", revelar);
document.addEventListener("apertura:llega", () => document.documentElement.classList.add("llego"));
$("#btnSaltar").onclick = () => { document.dispatchEvent(new Event("apertura:saltar")); revelar(); document.documentElement.classList.add("llego"); };
function portada() {
  $("#app").hidden = true; $("#portada").hidden = false;
  $("#vistaEntrar").hidden = !!S.u; $("#vistaFichas").hidden = !S.u;
  if (!S.u && innerWidth > 860) setTimeout(() => $("#inpUsuario").focus({ preventScroll: true }), 100);
}
$("#btnVer").onclick = () => { const i = $("#inpContrasena"); const v = i.type === "password"; i.type = v ? "text" : "password"; $("#btnVer").textContent = v ? "Ocultar" : "Ver"; };
$("#formEntrar").onsubmit = async e => {
  e.preventDefault();
  const b = $("#btnEntrar"); b.disabled = true; b.textContent = "Entrando…"; $("#errEntrar").textContent = "";
  try { await entrar($("#inpUsuario").value.trim().toLowerCase(), $("#inpContrasena").value, $("#chkRecordar").checked); }
  catch (err) { $("#errEntrar").textContent = err.message; }
  finally { b.disabled = false; b.innerHTML = 'Entrar <span aria-hidden="true">→</span>'; }
};
async function entrar(u, p, recordar) {
  S.u = u; S.p = p;
  let r;
  try { r = await api({ accion: "entrar" }); } catch (e) { S.u = S.p = ""; throw e; }
  S.inst = r.institucion || "";
  if (recordar) ls.set("ficha_sesion", { u, p }); else try { localStorage.removeItem("ficha_sesion"); } catch {}
  fichas(r.proyectos || []);
}
function fichas(lista) {
  $("#fichasInst").textContent = (S.inst ? S.inst + " · " : "") + S.u;
  lista.sort((a, b) => String(b.actualizado).localeCompare(String(a.actualizado)));
  $("#listaFichas").innerHTML = lista.length ? lista.map(f => {
    const v = Math.max(0, Math.min(100, Number(f.avance) || 0));
    return `<button class="ficha" data-abrir="${esc(f.codigo)}"><svg viewBox="0 0 46 46"><circle cx="23" cy="23" r="19" fill="none" stroke="rgba(255,255,255,.15)" stroke-width="4"/><circle cx="23" cy="23" r="19" fill="none" stroke="#FAB51B" stroke-width="4" stroke-linecap="round" stroke-dasharray="${(119.4 * v / 100).toFixed(1)} 200" transform="rotate(-90 23 23)"/><text x="23" y="27.5" text-anchor="middle" fill="#fff" font-size="12" font-weight="700" font-family="Poppins">${v}</text></svg><span class="ficha__txt"><b>${esc(f.proyecto || "Proyecto sin nombre")}</b><span>${f.actualizado ? "Último cambio: " + new Date(f.actualizado).toLocaleString("es-MX", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" }) : "Sin cambios todavía"}</span></span><span class="ficha__est ${f.estado === "Enviado" ? "ficha__est--env" : ""}">${f.estado === "Enviado" ? "Enviada" : "En llenado"}</span></button>`;
  }).join("") : `<p class="fichas__vacio">Todavía no tiene fichas. Abra la primera para comenzar.</p>`;
  S.codigo = null; portada();
}
async function misFichas() {
  if (pendiente) await guardar();
  const r = await api({ accion: "entrar" });
  fichas(r.proyectos || []);
}
function salir() { try { localStorage.removeItem("ficha_sesion"); } catch {} S.u = S.p = S.inst = ""; S.codigo = null; $("#inpContrasena").value = ""; portada(); }
$("#btnSalir1").onclick = salir;
$("#btnSalir2").onclick = async () => { if (pendiente) await guardar(); salir(); };
$("#btnMisFichas").onclick = () => misFichas().catch(e => aviso(e.message));
document.addEventListener("click", e => {
  const a = e.target.closest("[data-abrir]"); if (a) abrir(a.dataset.abrir).catch(err => aviso(err.message));
  if (e.target.closest("[data-misfichas]")) misFichas().catch(err => aviso(err.message));
});
$("#btnNuevo").onclick = async () => {
  const b = $("#btnNuevo"); b.disabled = true; b.textContent = "Preparando su ficha…";
  try { const r = await api({ accion: "nuevo" }); await abrir(r.codigo, true); }
  catch (e) { aviso("No pudimos abrir la ficha: " + e.message); }
  finally { b.disabled = false; b.innerHTML = 'Abrir una ficha nueva <span aria-hidden="true">+</span>'; }
};

async function abrir(codigo, nuevo) {
  const r = await api({ accion: "cargar", codigo });
  S.codigo = codigo; S.r = r.respuestas || {}; S.a = r.archivos || {}; S.estado = r.estado || "En llenado";
  const loc = ls.get("ficha_" + codigo);
  if (loc && loc.r && JSON.stringify(loc.r) !== JSON.stringify(S.r) && Object.keys(loc.r).length >= Object.keys(S.r).length) { S.r = loc.r; pendiente = true; setTimeout(guardar, 500); }
  $("#portada").hidden = true; $("#app").hidden = false;
  $("#codigoTxt").textContent = S.u; $("#instTxt").textContent = S.inst;
  dibujarAnillos($("#anillos"), pantallasVisibles().length, 150, 140, 17, 9);
  dibujarAnillos($("#anilloMovil"), pantallasVisibles().length, 24, 22, 2.8, 1.8);
  const p = ls.get("ficha_paso_" + codigo);
  mostrar(nuevo ? 0 : (p ?? 0));
  setGuardado("ok", "Todo guardado");
}

/* ================= arranque ================= */
if (DEMO && /recorrido/.test(location.search)) {
  // solo en la versión de prueba local: entra directo a una ficha
  (async () => { await entrar("prueba.desec", "demo123", true); const r = await api({ accion: "entrar" });
    const f = (r.proyectos || [])[0]; await abrir(f ? f.codigo : (await api({ accion: "nuevo" })).codigo, !f); })();
} else {
const ses = ls.get("ficha_sesion");
if (ses && ses.u) { portada(); $("#vistaEntrar").hidden = true; entrar(ses.u, ses.p, true).catch(() => { salir(); $("#errEntrar").textContent = "Su sesión cambió. Entre de nuevo."; }); }
else portada();
}
if (DEMO) console.info("Modo demostración: los datos se guardan solo en este navegador.");
})();

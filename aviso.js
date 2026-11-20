/* Aviso de cierre de captura (temporal). Solo visual: no cierra ni bloquea nada. */
(function () {
  // Cierre: viernes 20 nov 2026, 7:00 p. m. hora de Ciudad Juárez (UTC-7) = 21 nov 02:00 UTC
  var CIERRE = Date.UTC(2026, 10, 21, 2, 0, 0);
  var CUANDO = "Hoy viernes 20 de noviembre, <b>7:00 p. m.</b> (hora de Juárez)";
  function reloj() {
    return '<div class="cierre__reloj" aria-hidden="true">' +
      '<span class="cierre__u"><span class="cierre__d" data-h>00</span><span class="cierre__l">horas</span></span><span class="cierre__sep">:</span>' +
      '<span class="cierre__u"><span class="cierre__d" data-m>00</span><span class="cierre__l">min</span></span><span class="cierre__sep">:</span>' +
      '<span class="cierre__u"><span class="cierre__d" data-s>00</span><span class="cierre__l">seg</span></span></div>';
  }
  var vivo = '<span class="cierre__vivo"><i class="cierre__punto"></i><span data-vivo>Último día de captura</span></span>';
  function el(cls, html) { var d = document.createElement("div"); d.className = "cierre " + cls; d.setAttribute("role", "status"); d.innerHTML = html; return d; }

  var portada = el("cierre--portada",
    '<div class="cierre__txt">' + vivo + '<p class="cierre__tit" data-tit>La captura de fichas cierra hoy</p></div>' + reloj() +
    '<p class="cierre__cuando" data-cuando>' + CUANDO + '. Complete y envíe su ficha antes de esa hora.</p>');
  var franja = el("cierre--franja",
    '<div class="cierre__txt">' + vivo + '<p class="cierre__tit" data-tit>La captura cierra hoy a las <span class="cierre__nw">7:00 p. m.</span></p>' +
    '<p class="cierre__cuando" data-cuando>Hora de Juárez. Complete lo que falte y oprima <b>Enviar</b> antes de esa hora.</p></div>');
  var riel = el("cierre--riel", vivo + reloj() + '<p class="cierre__cuando" data-cuando>Cierra hoy <b>7:00 p. m.</b> (hora de Juárez)</p>');
  var movil = el("cierre--movil", vivo.replace("Último día de captura", "Cierra hoy 7:00 p. m.") + reloj());

  function colocar() {
    // computadora: dentro del recuadro de acceso · celular: arriba de todo, antes del título
    var panel = document.getElementById("panel"), intro = document.querySelector(".portada__intro");
    if (matchMedia("(max-width:860px)").matches) { if (intro && intro.firstElementChild !== portada) intro.insertBefore(portada, intro.firstChild); }
    else if (panel && panel.firstElementChild !== portada) panel.insertBefore(portada, panel.firstChild);
    var logo = document.querySelector(".riel__logo");
    if (logo && !document.querySelector(".riel .cierre")) logo.insertAdjacentElement("afterend", riel);
    var app = document.getElementById("app");
    if (app && !app.contains(movil)) app.appendChild(movil);
    var pant = document.getElementById("pantalla");
    if (pant && pant.firstChild !== franja) pant.insertBefore(franja, pant.firstChild);
  }
  var todos = [portada, franja, riel, movil];
  function dos(n) { return (n < 10 ? "0" : "") + n; }
  function tic() {
    var f = Math.max(0, CIERRE - Date.now()), s = Math.floor(f / 1000);
    var h = dos(Math.floor(s / 3600)), m = dos(Math.floor(s % 3600 / 60)), ss = dos(s % 60);
    todos.forEach(function (c) {
      c.querySelectorAll("[data-h]").forEach(function (x) { x.textContent = h; });
      c.querySelectorAll("[data-m]").forEach(function (x) { x.textContent = m; });
      c.querySelectorAll("[data-s]").forEach(function (x) { x.textContent = ss; });
      if (!f && !c.classList.contains("es-vencido")) {
        c.classList.add("es-vencido");
        c.querySelectorAll("[data-vivo]").forEach(function (x) { x.textContent = "Plazo de captura vencido"; });
        c.querySelectorAll("[data-tit]").forEach(function (x) { x.textContent = "El plazo de captura ya venció"; });
        c.querySelectorAll("[data-cuando]").forEach(function (x) { x.innerHTML = "Si aún no envía su ficha, <b>hágalo de inmediato</b>."; });
      }
    });
  }
  function iniciar() {
    colocar(); tic(); setInterval(tic, 1000); addEventListener("resize", colocar);
    // la ficha redibuja la pantalla al cambiar de paso: volver a colocar la franja
    var pant = document.getElementById("pantalla");
    if (pant) new MutationObserver(function () { if (pant.firstChild !== franja) pant.insertBefore(franja, pant.firstChild); }).observe(pant, { childList: true });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar); else iniciar();
})();

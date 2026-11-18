// Mejoras aprobadas por Ángel el 17 nov 2026 (registro: MEJORAS_17nov_aprobaciones.md).
// Se aplican sobre las preguntas sin tocar preguntas.js: mismas secciones, mismos números, nada se borra.
(function () {
  const F = window.FORM;
  const q = id => F.pantallas.flatMap(p => p.preguntas).find(x => x.id === id);

  /* ---------- textos y opciones aprobados ---------- */
  // 3.5: la sesión ya pasó; la pregunta se queda como opcional
  q("3.5").ayuda = "La sesión de trabajo ya se realizó. Esta pregunta es opcional.\n" + (q("3.5").ayuda || "");
  // 1.8: origen de cada monto
  q("1.8").ayuda = (q("1.8").ayuda || "") + "\nSi algún monto todavía es estimado porque no tiene cotización formal, márquelo como «Estimado». Cuando llegue la cotización, cambie el monto y márquelo como «Cotización formal».";
  q("1.8").grupo.campos.push({ k: "origen", l: "Origen del monto", t: "opcion", ops: ["Cotización formal", "Estimado"] });
  // 6.5: dos opciones nuevas antes de «Otro»
  const o65 = q("6.5").opciones, iOtro = o65.findIndex(o => o.otro);
  o65.splice(iOtro < 0 ? o65.length : iOtro, 0,
    { v: "Capacitación o certificación incluida en el precio", otro: false },
    { v: "Licencias o software incluidos en el precio", otro: false });
  // 7.2: calendario relativo de 4 a 5 meses
  q("7.2").texto = "¿Qué se hará cada mes de la ejecución? Planéelo en 4 a 5 meses.";
  q("7.2").ayuda = "Ejemplo: «Mes 1: compra del equipo. Mes 2: entrega e instalación. Mes 3: capacitación a docentes. Mes 4: inicio de prácticas con alumnos».\nSi ya subió el calendario en la pregunta 1.7, puede saltar esta.";
  q("7.2").grupo.campos.forEach(c => { if (c.k === "mes") c.t = "mesrel"; });
  // 7.6: pregunta abierta con archivos y enlaces
  q("7.6").texto = "¿Algo más que debamos saber?";
  q("7.6").adjunto = { etiqueta: "Archivos (opcional)", principal: false };

  /* ---------- uno solo o uno por plantel (3.2, 3.4, 6.11) ---------- */
  window.ORG = {
    "3.2": { t: "¿Cómo se organiza la parte técnica del proyecto?", uno: "Un solo responsable técnico para todo el proyecto", pl: "Un responsable técnico por plantel" },
    "3.4": { t: "¿Cómo se organiza el manejo del recurso?", uno: "Un solo responsable administrativo para todo el proyecto", pl: "Un responsable administrativo por plantel" },
    "6.11": { t: "¿Cómo se organiza el resguardo del equipo?", uno: "Un solo dueño y resguardo para todo el proyecto", pl: "Uno por plantel" }
  };

  /* ---------- guías «?» (cerradas por defecto) ---------- */
  // cada renglón: [etiqueta, tipo, texto]; tipo: tx = texto, ej = ejemplo, imp = importante
  window.GUIAS = {
    "S3": [
      ["Responsable del proyecto (3.1)", "tx", "Coordina todo y es el único enlace con DESEC."],
      ["Responsable técnico (3.2)", "tx", "Conoce el detalle del equipo o del programa."],
      ["Titular (3.3)", "tx", "Firma el convenio y los documentos oficiales."],
      ["Responsable administrativo (3.4)", "tx", "Recibe el recurso, paga al proveedor y comprueba el gasto."],
      ["Resguardo (6.11)", "tx", "Cuida el equipo ya instalado."],
      ["Importante", "imp", "Una misma persona puede tener más de un papel; si es así, anótela en cada uno."]
    ],
    "1.5": [
      ["Qué le pedimos", "tx", "Todo lo que comprende el proyecto. Con esto se define cómo se va a contratar y a comprobar."],
      ["Cómo contestar", "tx", "<ul><li><b>Si la capacitación viene incluida en el precio del equipo:</b> marque «Equipamiento de talleres o laboratorios» y lo demás que aplique, pero <b>no</b> marque «Formación o certificación de docentes». Indíquelo después en la pregunta 6.5.</li><li><b>Si la capacitación se cobra aparte:</b> sí márquela, porque se contratará y comprobará por separado.</li></ul>"],
      ["Ejemplo", "ej", "El proveedor de un laboratorio de robótica incluye 40 horas de capacitación docente en el precio. Se marca solo «Equipamiento de talleres o laboratorios» y «Licencias o software», y en la 6.5 se marca «Capacitación o certificación incluida en el precio»."],
      ["Importante", "imp", "Si una capacitación incluida se registra como si fuera aparte, la revisión jurídica puede tratarla como otra contratación y hacer observaciones o solicitar información adicional."]
    ],
    "2.2": [
      ["Qué le pedimos", "tx", "Saber si el proyecto tiene antecedentes."],
      ["Cómo contestar", "tx", "<ul><li><b>Proyecto nuevo:</b> no hay recursos ni gestiones anteriores para esto.</li><li><b>Segunda etapa:</b> continúa algo ya iniciado; por ejemplo, el segundo taller de una serie.</li><li><b>Complementaria:</b> agrega lo que el proyecto anterior no cubrió; por ejemplo, la capacitación para el equipo ya comprado.</li></ul>"],
      ["Importante", "imp", "Aunque sea segunda etapa o complementaria, <b>esta ficha se gestiona como un proyecto nuevo e independiente</b>, con su propio convenio y su propia comprobación. Lo anterior sirve de antecedente y no se mezcla con esta solicitud. Si en la gestión anterior hubo obstáculos (retrasos, observaciones o documentos que les pidieron), cuéntelos en la pregunta 7.6: nos ayudan a evitarlos ahora."]
    ],
    "3.1": [
      ["Qué le pedimos", "tx", "La persona que coordina todo el proyecto y que será <b>el único enlace con DESEC</b>. A ella le enviaremos las observaciones, y ella las comparte con los demás participantes."],
      ["Cómo contestar", "tx", "Si participan varios planteles, aquí va el responsable general. Los responsables de cada plantel se anotan en la pregunta 1.4."],
      ["Ejemplo", "ej", "Mtra. Ana López, subdirectora académica, ana.lopez@plantel.edu.mx, 656 000 0000."],
      ["Importante", "imp", "Debe estar atenta durante toda la revisión, incluido el periodo vacacional de diciembre, porque en ese tiempo puede haber observaciones o solicitudes de información adicional."]
    ],
    "3.2": [
      ["Qué le pedimos", "tx", "Quién conoce el detalle del equipo o del programa: armó la lista, habló con los proveedores y puede responder preguntas técnicas."],
      ["Cómo contestar", "tx", "Primero indique si hay <b>un solo responsable técnico</b> para todo el proyecto o <b>uno por plantel</b>. Si es uno por plantel, los planteles que anotó en la pregunta 1.4 aparecen solos y solo tiene que elegir o anotar a la persona de cada uno. Si esa persona ya está registrada en la ficha, elíjala de la lista y sus datos se llenan solos."],
      ["Ejemplo", "ej", "Uno por plantel. CBTIS 128: Ing. Luis Ramos, jefe del taller de mecatrónica. CBTIS 114: Ing. Marta Ruiz, jefa de laboratorio de electrónica."]
    ],
    "3.4": [
      ["Qué le pedimos", "tx", "La persona <b>de la organización que recibirá el recurso</b> que se encargará del dinero del proyecto. Esa organización puede ser su propia institución o la asociación o comité que lo recibiría a su nombre."],
      ["Qué hace", "tx", "Recibe el recurso en la cuenta de esa organización, paga al proveedor y reúne las facturas y evidencias para comprobar el gasto."],
      ["Cómo contestar", "tx", "Anote su nombre, cargo, correo y teléfono. Por lo general es quien encabeza Recursos Financieros o Administración, o el tesorero de la asociación o comité."],
      ["Ejemplo", "ej", "C.P. Rosa Díaz, tesorera de la Asociación de Padres de Familia del plantel, rosa.diaz@correo.com, 656 000 0000."],
      ["Importante", "imp", "Si todavía no está definido qué organización recibirá el recurso, marque «Aún no lo tenemos» y explique en la pregunta 7.6 cuál podría recibirlo."]
    ],
    "6.2": [
      ["Qué le pedimos", "tx", "Cuántas cotizaciones de proveedores distintos tiene <b>por cada componente</b> del proyecto, es decir, por cada laboratorio, kit o paquete."],
      ["Cómo contestar", "tx", "Se piden <b>tres cotizaciones de proveedores distintos por componente</b>, para comparar precios y poder licitar."],
      ["Importante", "imp", "Las cotizaciones no deben tener más de <b>1 a 2 meses de antigüedad</b> al presentar el expediente. Si las suyas son anteriores, pida una actualizada. Si un equipo solo lo vende un proveedor, explíquelo en la pregunta 6.4."]
    ],
    "6.3": [
      ["Qué le pedimos", "tx", "Las cotizaciones de todos los componentes, de todos los proveedores."],
      ["Cómo contestar", "tx", "Cada cotización debe traer:<ul><li>papel membretado del proveedor con su RFC;</li><li>fecha y vigencia;</li><li>descripción y <b>especificaciones técnicas</b> de cada equipo;</li><li>cantidad, precio unitario y total con IVA;</li><li>lo que incluye: envío, instalación, capacitación, garantía o licencias.</li></ul>"],
      ["Ejemplo", "ej", "Nombre de archivo sugerido: «Equipos del Norte · laboratorio de robótica · 10 nov 2026.pdf»."],
      ["Importante", "imp", "Si el proyecto es para varios planteles, la cotización o la lista de equipo debe indicar qué va a cada plantel. Mientras más detalladas sean las especificaciones, menos observaciones habrá al licitar."]
    ],
    "6.5": [
      ["Cómo contestar", "tx", "Marque todo lo que el proveedor incluye <b>sin cobrarlo aparte</b>. Si algo de esto tiene precio propio en la cotización, regístrelo también en el desglose del gasto (pregunta 1.8)."]
    ],
    "6.8": [
      ["Qué le pedimos", "tx", "Conocer el lugar donde se instalará el equipo en cada plantel, para anticipar adecuaciones y evitar retrasos en la instalación."],
      ["Cómo contestar", "tx", "Abra la tarjeta de cada plantel y suba lo que tenga. <b>Nada es obligatorio</b>, pero mientras más información tengamos, menos observaciones habrá después."]
    ],
    "7.1": [
      ["Qué le pedimos", "tx", "Saber si existe una fecha que, si se pasa, haría perder algo: el inicio de un semestre, una generación de alumnos, una certificación programada o una entrega ya comprometida."],
      ["Cómo contestar", "tx", "Si existe, anote la fecha y explique qué se afectaría. Si no hay una fecha así, marque <b>«No aplica»</b>."],
      ["Ejemplo", "ej", "«15 de enero de 2027: el semestre inicia el 26 de enero y el laboratorio debe estar instalado antes»."],
      ["Importante", "imp", "No es la fecha en que les gustaría recibir el recurso, sino la fecha límite real."]
    ],
    "7.2": [
      ["Qué le pedimos", "tx", "El plan de trabajo desde que se reciba el recurso hasta que el proyecto esté funcionando, dividido en meses."],
      ["Cómo contestar", "tx", "Lo ideal es un plan de <b>4 a 5 meses</b>, contados como «Mes 1, Mes 2…» y no con meses del calendario, porque la fecha de inicio depende de cómo se canalice el recurso y todavía no está definida. Anote solo actividades de <b>ejecución</b> que se puedan comprobar con evidencia (factura, acta de entrega, fotos, lista de asistencia). No incluya la gestión del recurso ni la licitación."],
      ["Ejemplo", "ej", "Mes 1: compra y pedido del equipo. Mes 2: entrega e instalación en los planteles. Mes 3: capacitación y certificación de docentes. Mes 4: inicio de prácticas con alumnos. Mes 5: primera evaluación y entrega de evidencias."],
      ["Importante", "imp", "Lo que anote aquí puede pasar al convenio. Si después cambia una actividad o el número de meses, podría requerirse una modificación formal que retrase el proyecto. Anote solo lo que realmente se hará."]
    ],
    "7.5": [
      ["Qué le pedimos", "tx", "Saber si alguna persona que decide, participa o se beneficia del proyecto tiene relación con alguno de los proveedores que cotizaron. Esto se conoce como <b>conflicto de interés</b>."],
      ["Quiénes cuentan", "tx", "Directivos de la institución, personal administrativo y docente que participa en el proyecto, e integrantes del comité o asociación que recibiría el recurso."],
      ["Qué es relación", "tx", "<ul><li><b>Familiar:</b> cónyuge o pareja, padres, hijos, hermanos, abuelos, nietos, tíos, sobrinos, primos, suegros, cuñados, yernos y nueras.</li><li><b>De negocios:</b> ser dueño, socio o accionista del proveedor; trabajar o haber trabajado para él; recibir pagos o comisiones de él; o tener otro negocio en común.</li></ul>"],
      ["Cómo contestar", "tx", "Si no hay ninguna relación, marque «No». Si la hay, marque «Sí» y escriba quién es, con qué proveedor y qué relación tiene."],
      ["Ejemplo", "ej", "«Sí: el jefe de taller, Ing. Juan Pérez, es hermano del dueño de Equipos del Norte, S.A. de C.V., uno de los tres proveedores que cotizaron»."],
      ["Importante", "imp", "Declararlo no descalifica al proveedor; ocultarlo sí puede invalidar la compra. <b>Ante la duda, declárelo.</b>"]
    ],
    "7.6": [
      ["Qué le pedimos", "tx", "Cualquier cosa que nos ayude a entender mejor su proyecto y que no haya cabido en las otras preguntas."],
      ["Puede incluir", "tx", "<ul><li>aclaraciones (como que la capacitación viene incluida en el equipo);</li><li>obstáculos que tuvieron en gestiones anteriores y cómo se resolvieron;</li><li>autorizaciones especiales que necesiten (por ejemplo, de una autoridad federal);</li><li>riesgos que vean para cumplir el calendario.</li></ul>"],
      ["Archivos y enlaces", "tx", "Suba estudios, diagnósticos, presentaciones, cartas de apoyo o cualquier documento que fortalezca el proyecto. Si un archivo pesa más de 25 MB, súbalo a Google Drive y pegue aquí el enlace con permiso de lectura."],
      ["Importante", "imp", "Todo es opcional."]
    ]
  };

  /* ---------- 6.8: información del espacio en cada plantel (todo opcional) ---------- */
  window.ESPACIO = [
    { k: "fotos", l: "Fotos del espacio", tipo: "archivo", g: "De 2 a 5 fotos del lugar <b>como está hoy</b>, donde se vean las paredes, los contactos eléctricos y el espacio libre. No hace falta que esté arreglado." },
    { k: "plano", l: "Plano o croquis", tipo: "archivo", g: "Un dibujo del espacio con sus <b>medidas</b> (largo y ancho) y la ubicación de puertas, ventanas y contactos. Puede ser un plano oficial o un croquis hecho a mano y fotografiado." },
    { k: "video", l: "Video o enlace de Drive", tipo: "video", g: "Un recorrido corto del espacio con el celular. Si pesa más de 25 MB, súbalo a una carpeta de Google Drive y pegue aquí el enlace con permiso de lectura." },
    { k: "elec", l: "Electricidad e internet", tipo: "texto", g: "Cuántos contactos hay y de qué voltaje (127 V o 220 V), y si hay internet por cable o inalámbrico. <b>Ejemplo:</b> «6 contactos de 127 V, ninguno de 220 V; internet por cable»." },
    { k: "adec", l: "Adecuaciones que faltan", tipo: "texto", g: "Lo que habría que hacer para instalar el equipo: contactos, red, mobiliario, aire acondicionado u obra menor. <b>Ejemplo:</b> «Falta un contacto de 220 V y 4 mesas de trabajo». Si no falta nada, escriba «Ninguna»." }
  ];

  /* ---------- avisos generales ---------- */
  window.AVISOS = {
    guia: "Las preguntas con el símbolo <b>?</b> tienen una guía. Tóquelo para ver qué le pedimos, cómo contestar y un ejemplo.",
    fechas: "<b>Fechas de referencia:</b> captura completa, viernes 20 de noviembre · observaciones de DESEC, del 27 de noviembre al 2 de diciembre · cartera integrada, 10 de diciembre.",
    envio: "<p class=\"etapas__t\"><b>Enviar su ficha no significa que el proyecto quede libre de observaciones y/o solicitudes de información adicional.</b> El proceso sigue por etapas:</p>" +
      "<ol class=\"etapas__l\"><li><b>Etapa 1 · DESEC</b> revisa su ficha y le envía observaciones.</li><li><b>Etapa 2 · Gobierno del Estado y sus áreas jurídicas</b> la revisan y también pueden hacer observaciones o solicitar información adicional.</li></ol>" +
      "<p class=\"etapas__p\">Puede seguir corrigiendo y volver a enviar las veces que sea necesario.</p>",
    nota: "Aclare aquí lo que no encaje en las preguntas de esta sección. DESEC lo leerá al revisar su ficha."
  };
})();

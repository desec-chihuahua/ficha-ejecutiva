// Generado desde «Formulario en línea ficha ejecutiva v4.xlsx». No editar a mano: correr excel_a_preguntas.py
window.FORM = {
 "pantallas": [
  {
   "n": 1,
   "titulo": "Su proyecto",
   "preguntas": [
    {
     "id": "1.1",
     "texto": "¿Quién llena este formulario? Nombre, cargo e institución.",
     "tipo": "corto",
     "ayuda": "Ejemplo: Ing. Laura Pérez Ruiz, jefa de Vinculación, CONALEP plantel 1.",
     "cond": null,
     "obligatoria": true,
     "salidas": []
    },
    {
     "id": "1.2",
     "texto": "Nombre del proyecto.",
     "tipo": "corto",
     "ayuda": "Ejemplo: «Equipamiento de talleres de microelectrónica y semiconductores en CONALEP planteles 1 y 2». Si en el proyecto participan varias instituciones, llene un solo formulario para todo el proyecto; en la pregunta siguiente se reparte entre instituciones.",
     "cond": null,
     "obligatoria": true,
     "salidas": []
    },
    {
     "id": "1.3",
     "texto": "¿Cuántas instituciones participan en este proyecto?",
     "tipo": "unica",
     "ayuda": "Si son dos o más, no repita los datos generales: aquí los llena una vez y en la pregunta siguiente reparte qué recibe cada institución.",
     "cond": null,
     "obligatoria": false,
     "opciones": [
      {
       "v": "Solo una",
       "otro": false
      },
      {
       "v": "Dos o más",
       "otro": false
      },
      {
       "v": "Otro (¿cuál?)",
       "otro": true
      }
     ],
     "salidas": [
      "No lo sé"
     ]
    },
    {
     "id": "1.4",
     "texto": "Suba la plantilla de instituciones: para cada una, plantel, CCT, responsable, alumnos, qué recibe y monto asignado.",
     "tipo": "archivo",
     "ayuda": "Descargue la hoja «Plantilla de instituciones». Ejemplo de renglón: «CONALEP plantel 1 | 08DCT0001X | Ing. Laura Pérez | 180 alumnos | 10 estaciones de soldadura | $2,400,000». La suma de montos debe dar el total del proyecto.",
     "cond": {
      "q": "1.3",
      "en": [
       "Dos o más"
      ]
     },
     "obligatoria": false,
     "salidas": [
      "Aún no lo tenemos"
     ],
     "adjunto": {
      "etiqueta": "Plantilla de instituciones llena",
      "principal": true
     },
     "plantilla": {
      "nombre": "Plantilla de instituciones",
      "url": "plantillas/Plantilla_instituciones.xlsx"
     }
    },
    {
     "id": "1.5",
     "texto": "¿Qué incluye el proyecto? Marque todo lo que aplique.",
     "tipo": "varias",
     "ayuda": "Marque todas las que apliquen. Si el curso incluye comprar robots que se quedan en la escuela, marque «Formación de alumnos» y «Materiales, kits o robots».",
     "cond": null,
     "obligatoria": false,
     "opciones": [
      {
       "v": "Formación de alumnos (cursos, talleres, capacitación)",
       "otro": false
      },
      {
       "v": "Formación o certificación de docentes",
       "otro": false
      },
      {
       "v": "Certificaciones para alumnos",
       "otro": false
      },
      {
       "v": "Equipamiento de talleres o laboratorios",
       "otro": false
      },
      {
       "v": "Materiales, kits o robots",
       "otro": false
      },
      {
       "v": "Licencias o software",
       "otro": false
      },
      {
       "v": "Adecuación de espacios (contactos, red, mobiliario)",
       "otro": false
      },
      {
       "v": "Otro (¿cuál?)",
       "otro": true
      }
     ],
     "salidas": [
      "Aún no lo tenemos"
     ]
    },
    {
     "id": "1.6",
     "texto": "¿Qué se busca lograr con el proyecto? Objetivo en una o dos frases.",
     "tipo": "largo",
     "ayuda": "Ejemplo: «Que los alumnos de CONALEP practiquen con el mismo equipo que usa la industria de semiconductores y egresen listos para operarlo».",
     "cond": null,
     "obligatoria": false,
     "salidas": [
      "Aún no lo tenemos"
     ]
    },
    {
     "id": "1.7",
     "texto": "Describa en qué consiste: qué se va a hacer o comprar, para quién y en cuánto tiempo.",
     "tipo": "largo",
     "ayuda": "Ejemplo: «Equipar dos talleres con 20 estaciones de soldadura y prueba electrónica para 320 alumnos de las especialidades de Electrónica y Mecatrónica, entre febrero y agosto de 2027».\nAdjunte el calendario de actividades (puede usar la hoja «Plantilla de calendario»). Si aún no lo tiene, márquelo y lo armamos en Juárez.",
     "cond": null,
     "obligatoria": false,
     "salidas": [
      "Aún no lo tenemos"
     ],
     "adjunto": {
      "etiqueta": "Calendario de actividades",
      "principal": false
     },
     "plantilla": {
      "nombre": "Plantilla de calendario",
      "url": "plantillas/Plantilla_calendario.xlsx"
     }
    },
    {
     "id": "1.8",
     "texto": "¿Cuánto se solicita para 2027, con IVA incluido?",
     "tipo": "moneda",
     "ayuda": "Ejemplo: $6,000,000, que se desglosa así:\n• Equipo de laboratorio: $4,800,000\n• Instalación y puesta en marcha: $350,000\n• Capacitación a docentes: $450,000\n• Licencias de software (12 meses): $400,000\nAdjunte el desglose (hoja «Plantilla de desglose del gasto»). La suma debe dar el monto solicitado.",
     "cond": null,
     "obligatoria": false,
     "salidas": [
      "Aún no lo tenemos"
     ],
     "adjunto": {
      "etiqueta": "Desglose del gasto",
      "principal": false
     },
     "plantilla": {
      "nombre": "Plantilla de desglose del gasto",
      "url": "plantillas/Plantilla_desglose_del_gasto.xlsx"
     }
    },
    {
     "id": "1.9",
     "texto": "¿En qué planteles se realizará? Escriba uno por renglón con su clave de centro de trabajo (CCT).",
     "tipo": "largo",
     "ayuda": "Ejemplo:\nSecundaria Técnica 55, CCT 08XXX0000X\nSecundaria Técnica 91, CCT 08XXX0000X\nLa CCT aparece en las boletas y documentos oficiales del plantel.\nSi ya llenó la plantilla de instituciones (1.4), puede saltar esta pregunta.",
     "cond": null,
     "obligatoria": false,
     "salidas": [
      "Aún no lo tenemos"
     ]
    },
    {
     "id": "1.10",
     "texto": "¿Cuántos alumnos se beneficiarán por ciclo escolar?",
     "tipo": "numero",
     "ayuda": "Ejemplo: 500.",
     "cond": null,
     "obligatoria": false,
     "salidas": [
      "Aún no lo tenemos"
     ]
    },
    {
     "id": "1.11",
     "texto": "¿Cuántos docentes participarán o usarán lo que se adquiera?",
     "tipo": "numero",
     "ayuda": "Ejemplo: 12.",
     "cond": null,
     "obligatoria": false,
     "salidas": [
      "Aún no lo tenemos"
     ]
    },
    {
     "id": "1.12",
     "texto": "En dos o tres renglones, ¿qué problema resuelve el proyecto? Incluya un dato y de dónde sale (puede ser un estudio o un dato interno de la institución).",
     "tipo": "largo",
     "ayuda": "Ejemplo con estudio: «El 74 % de los alumnos de 3.º de secundaria tiene un nivel STEM bajo o muy bajo (diagnóstico IPE, 2025)».\nEjemplo con dato interno: «De 420 alumnos de Electrónica, solo 60 hicieron prácticas con equipo real en 2025 (control escolar del plantel)».\nSi tiene el soporte, adjúntelo.",
     "cond": null,
     "obligatoria": false,
     "salidas": [
      "Aún no lo tenemos"
     ],
     "adjunto": {
      "etiqueta": "Soporte del dato (opcional)",
      "principal": false
     }
    }
   ]
  },
  {
   "n": 2,
   "titulo": "Lo que ya se avanzó",
   "preguntas": [
    {
     "id": "2.1",
     "texto": "¿Este proyecto ya recibió recursos de la primera cartera 2026?",
     "tipo": "unica",
     "ayuda": "La primera cartera son los recursos que ya se trabajan con el I2C o el INADET.",
     "cond": null,
     "obligatoria": false,
     "opciones": [
      {
       "v": "Sí",
       "otro": false
      },
      {
       "v": "No",
       "otro": false
      },
      {
       "v": "Otro (¿cuál?)",
       "otro": true
      }
     ],
     "salidas": [
      "No lo sé"
     ]
    },
    {
     "id": "2.2",
     "texto": "¿Este proyecto es nuevo o continúa uno anterior?",
     "tipo": "unica",
     "ayuda": "Segunda etapa: sigue lo que ya empezó (por ejemplo, el segundo taller). Complementaria: agrega algo que el proyecto anterior no cubría (por ejemplo, la capacitación para el equipo ya comprado).",
     "cond": null,
     "obligatoria": false,
     "opciones": [
      {
       "v": "Proyecto nuevo",
       "otro": false
      },
      {
       "v": "Segunda etapa de un proyecto ya iniciado",
       "otro": false
      },
      {
       "v": "Etapa complementaria de un proyecto anterior",
       "otro": false
      },
      {
       "v": "Otro (¿cuál?)",
       "otro": true
      }
     ],
     "salidas": [
      "No lo sé"
     ]
    },
    {
     "id": "2.3",
     "texto": "Suba el proyecto completo de la etapa anterior.",
     "tipo": "archivo",
     "ayuda": "Ficha, proyecto o convenio de la primera etapa, en PDF. Obligatorio si es etapa complementaria.",
     "cond": {
      "q": "2.2",
      "en": [
       "Segunda etapa",
       "Etapa complementaria"
      ]
     },
     "obligatoria": false,
     "salidas": [
      "Aún no lo tenemos"
     ],
     "adjunto": {
      "etiqueta": "Proyecto completo de la etapa anterior",
      "principal": true
     }
    },
    {
     "id": "2.4",
     "texto": "¿Por qué vía llegó ese recurso?",
     "tipo": "unica",
     "ayuda": "Diga quién dio el recurso y a qué institución exactamente llegó. Ejemplo: «I2C, mediante convenio con CONALEP Chihuahua, para el plantel Ciudad Juárez I».",
     "cond": {
      "q": "2.1",
      "en": [
       "Sí"
      ]
     },
     "obligatoria": false,
     "opciones": [
      {
       "v": "I2C",
       "otro": false
      },
      {
       "v": "INADET",
       "otro": false
      },
      {
       "v": "Otro (¿cuál?)",
       "otro": true
      }
     ],
     "salidas": [
      "No lo sé"
     ]
    },
    {
     "id": "2.5",
     "texto": "¿Qué se compró o contrató ya y cuánto se ha pagado?",
     "tipo": "largo",
     "ayuda": "Ejemplo: «Se compraron 4 estaciones de soldadura y un osciloscopio; pagado $1,200,000 de $3,000,000».\nAdjunte la evidencia que tenga: facturas, actas de entrega, fotografías o el informe de avance.",
     "cond": {
      "q": "2.1",
      "en": [
       "Sí"
      ]
     },
     "obligatoria": false,
     "salidas": [
      "Aún no lo tenemos"
     ],
     "adjunto": {
      "etiqueta": "Evidencia: facturas, actas, fotos o informe",
      "principal": false
     }
    }
   ]
  },
  {
   "n": 3,
   "titulo": "Responsables",
   "preguntas": [
    {
     "id": "3.1",
     "texto": "Responsable del proyecto: nombre, cargo, correo y teléfono.",
     "tipo": "contacto",
     "ayuda": "Es la persona que coordina el proyecto en la institución. Ejemplo: Mtra. Ana López, subdirectora académica, ana.lopez@plantel.edu.mx, 656 000 0000.",
     "cond": null,
     "obligatoria": false,
     "salidas": [
      "Aún no lo tenemos"
     ]
    },
    {
     "id": "3.2",
     "texto": "Responsable técnico: nombre, cargo, correo y teléfono.",
     "tipo": "contacto",
     "ayuda": "Es quien conoce el detalle del equipo o del programa; por ejemplo, el jefe de taller que armó la lista de equipo.",
     "cond": null,
     "obligatoria": false,
     "salidas": [
      "Aún no lo tenemos"
     ]
    },
    {
     "id": "3.3",
     "texto": "Titular que firmaría los documentos: nombre y cargo.",
     "tipo": "corto",
     "ayuda": "Ejemplo: Dr. Juan Martínez, rector. Suele ser el director o rector.",
     "cond": null,
     "obligatoria": false,
     "salidas": [
      "Aún no lo tenemos"
     ]
    },
    {
     "id": "3.4",
     "texto": "Responsable administrativo, quien recibiría, pagaría y comprobaría el recurso: nombre, cargo, correo y teléfono.",
     "tipo": "contacto",
     "ayuda": "Ejemplo: C.P. Rosa Díaz, jefa de Recursos Financieros.",
     "cond": null,
     "obligatoria": false,
     "salidas": [
      "Aún no lo tenemos"
     ]
    },
    {
     "id": "3.5",
     "texto": "¿Quiénes asistirían a la sesión de trabajo en Ciudad Juárez (17 al 18 de noviembre)?",
     "tipo": "varias",
     "ayuda": "La sesión dura unas dos horas por proyecto. Es muy útil que asista el responsable técnico.",
     "cond": null,
     "obligatoria": false,
     "opciones": [
      {
       "v": "Responsable del proyecto",
       "otro": false
      },
      {
       "v": "Responsable técnico",
       "otro": false
      },
      {
       "v": "Titular",
       "otro": false
      },
      {
       "v": "Responsable administrativo",
       "otro": false
      },
      {
       "v": "Proveedor",
       "otro": false
      },
      {
       "v": "Otro (¿cuál?)",
       "otro": true
      }
     ],
     "salidas": [
      "Aún no lo sabemos"
     ]
    }
   ]
  },
  {
   "n": 4,
   "titulo": "Cómo llegaría el recurso",
   "preguntas": [
    {
     "id": "4.1",
     "texto": "¿Qué tipo de institución es la que se beneficia?",
     "tipo": "unica",
     "ayuda": "Esto define si el Estado puede asignarle el recurso directamente o si debe llegar por otra vía.",
     "cond": null,
     "obligatoria": false,
     "opciones": [
      {
       "v": "Federal (por ejemplo, TecNM o DGETI)",
       "otro": false
      },
      {
       "v": "Estatal",
       "otro": false
      },
      {
       "v": "Organismo descentralizado del Estado",
       "otro": false
      },
      {
       "v": "Escuela de educación básica",
       "otro": false
      },
      {
       "v": "Asociación civil o empresa",
       "otro": false
      },
      {
       "v": "Otro (¿cuál?)",
       "otro": true
      }
     ],
     "salidas": [
      "No lo sé"
     ]
    },
    {
     "id": "4.2",
     "texto": "¿Quién recibiría y administraría el dinero?",
     "tipo": "unica",
     "ayuda": "Si no está definido, elija «Aún no lo tenemos»; lo resolvemos juntos en la sesión.",
     "cond": null,
     "obligatoria": false,
     "opciones": [
      {
       "v": "La propia institución",
       "otro": false
      },
      {
       "v": "Una asociación civil",
       "otro": false
      },
      {
       "v": "Que Gobierno compre directamente y entregue",
       "otro": false
      },
      {
       "v": "Otro (¿cuál?)",
       "otro": true
      }
     ],
     "salidas": [
      "Aún no lo tenemos"
     ]
    },
    {
     "id": "4.3",
     "texto": "Nombre legal y RFC de la asociación civil.",
     "tipo": "corto",
     "ayuda": "Ejemplo: Fundación Ejemplo para la Educación, A.C., RFC XAXX010101000.\nSi la tiene, adjunte la constancia de situación fiscal.",
     "cond": {
      "q": "4.2",
      "en": [
       "Una asociación civil"
      ]
     },
     "obligatoria": false,
     "salidas": [
      "Aún no lo tenemos"
     ],
     "adjunto": {
      "etiqueta": "Constancia de situación fiscal (opcional)",
      "principal": false
     }
    },
    {
     "id": "4.4",
     "texto": "¿Esa asociación ya ha recibido y comprobado recursos de Gobierno?",
     "tipo": "unica",
     "ayuda": "",
     "cond": {
      "q": "4.2",
      "en": [
       "Una asociación civil"
      ]
     },
     "obligatoria": false,
     "opciones": [
      {
       "v": "Sí, de Gobierno del Estado",
       "otro": false
      },
      {
       "v": "Sí, de otro orden de gobierno",
       "otro": false
      },
      {
       "v": "No",
       "otro": false
      },
      {
       "v": "Otro (¿cuál?)",
       "otro": true
      }
     ],
     "salidas": [
      "No lo sé"
     ]
    },
    {
     "id": "4.5",
     "texto": "¿La institución necesita autorización de otra instancia para recibir el recurso o el equipo?",
     "tipo": "unica",
     "ayuda": "Ejemplo: «Sí, de la Junta Directiva y del TecNM».\nSi ya la tiene, adjunte el oficio o acta de autorización.",
     "cond": null,
     "obligatoria": false,
     "opciones": [
      {
       "v": "Sí (¿de quién?)",
       "otro": true
      },
      {
       "v": "No",
       "otro": false
      },
      {
       "v": "Sí, y ya la tenemos",
       "otro": false
      },
      {
       "v": "Otro (¿cuál?)",
       "otro": true
      }
     ],
     "salidas": [
      "No lo sé"
     ],
     "adjunto": {
      "etiqueta": "Oficio o acta de autorización",
      "principal": false
     }
    }
   ]
  },
  {
   "n": 5,
   "titulo": "Formación",
   "preguntas": [
    {
     "id": "5.1",
     "texto": "¿Quién impartirá el programa? Nombre o razón social y RFC.",
     "tipo": "corto",
     "ayuda": "Ejemplo: Robótica Educativa del Norte, S.A. de C.V., RFC XAXX010101000.\nSi la tiene, adjunte la constancia de situación fiscal del proveedor.",
     "cond": {
      "seccion": "formacion"
     },
     "obligatoria": false,
     "salidas": [
      "Aún no lo tenemos"
     ],
     "adjunto": {
      "etiqueta": "Constancia de situación fiscal del proveedor (opcional)",
      "principal": false
     }
    },
    {
     "id": "5.2",
     "texto": "¿Hay otros proveedores que podrían dar un programa similar?",
     "tipo": "unica",
     "ayuda": "Ejemplo: «No: es el único distribuidor certificado de la metodología Sphero en la región».\nSi tiene cotizaciones de otros proveedores o carta de exclusividad, adjúntelas.",
     "cond": {
      "seccion": "formacion"
     },
     "obligatoria": false,
     "opciones": [
      {
       "v": "Sí (¿cuáles?)",
       "otro": true
      },
      {
       "v": "No, es el único (¿por qué?)",
       "otro": true
      },
      {
       "v": "Otro (¿cuál?)",
       "otro": true
      }
     ],
     "salidas": [
      "No lo sé"
     ],
     "adjunto": {
      "etiqueta": "Cotizaciones de otros proveedores o carta de exclusividad",
      "principal": false
     }
    },
    {
     "id": "5.3",
     "texto": "Suba el programa del curso o descríbalo: módulos y horas de cada uno.",
     "tipo": "largo",
     "ayuda": "Ejemplo: «Módulo 1, programación por bloques, 20 h; módulo 2, robótica, 30 h; módulo 3, proyecto final, 30 h; inglés, 80 h».\nSi aún no tiene el programa, márquelo y lo vemos en Juárez.",
     "cond": {
      "seccion": "formacion"
     },
     "obligatoria": false,
     "salidas": [
      "Aún no lo tenemos"
     ],
     "adjunto": {
      "etiqueta": "Programa del curso",
      "principal": true
     }
    },
    {
     "id": "5.4",
     "texto": "¿Cuándo y dónde se darán las sesiones?",
     "tipo": "unica",
     "ayuda": "Ejemplo: «Martes y jueves de 14:00 a 16:00 h, de febrero a junio de 2027, en el aula de medios».\nAdjunte el calendario de sesiones (puede usar la hoja «Plantilla de calendario»).",
     "cond": {
      "seccion": "formacion"
     },
     "obligatoria": false,
     "opciones": [
      {
       "v": "Dentro del horario de clases",
       "otro": false
      },
      {
       "v": "Fuera del horario de clases",
       "otro": false
      },
      {
       "v": "Ambos",
       "otro": false
      },
      {
       "v": "Otro (¿cuál?)",
       "otro": true
      }
     ],
     "salidas": [
      "Aún no lo tenemos"
     ],
     "adjunto": {
      "etiqueta": "Calendario de sesiones",
      "principal": false
     },
     "plantilla": {
      "nombre": "Plantilla de calendario",
      "url": "plantillas/Plantilla_calendario.xlsx"
     }
    },
    {
     "id": "5.5",
     "texto": "¿Cuántos instructores habrá y qué perfil tienen?",
     "tipo": "corto",
     "ayuda": "Ejemplo: «6 instructores, ingenieros en sistemas con certificación Sphero».\nAdjunte los currículos de los instructores (uno por archivo o todos en un PDF).",
     "cond": {
      "seccion": "formacion"
     },
     "obligatoria": false,
     "salidas": [
      "Aún no lo tenemos"
     ],
     "adjunto": {
      "etiqueta": "Currículos de los instructores",
      "principal": false
     }
    },
    {
     "id": "5.6",
     "texto": "Robots, kits o licencias del curso:",
     "tipo": "unica",
     "ayuda": "",
     "cond": {
      "seccion": "formacion"
     },
     "obligatoria": false,
     "opciones": [
      {
       "v": "El proveedor los presta y se los lleva al final",
       "otro": false
      },
      {
       "v": "Se compran y se quedan en la escuela",
       "otro": false
      },
      {
       "v": "Se compran y se quedan con el alumno",
       "otro": false
      },
      {
       "v": "El curso no usa materiales",
       "otro": false
      },
      {
       "v": "Otro (¿cuál?)",
       "otro": true
      }
     ],
     "salidas": [
      "No lo sé"
     ]
    },
    {
     "id": "5.7",
     "texto": "¿Cómo se eligen los alumnos que participan?",
     "tipo": "corto",
     "ayuda": "Ejemplo: «Examen diagnóstico del IPE; entran los 25 mejores resultados de 3.º de cada secundaria».",
     "cond": {
      "seccion": "formacion"
     },
     "obligatoria": false,
     "salidas": [
      "Aún no lo tenemos"
     ]
    },
    {
     "id": "5.8",
     "texto": "¿Ya tienen permiso de la autoridad educativa para trabajar en las escuelas?",
     "tipo": "unica",
     "ayuda": "Si ya lo tiene o está en trámite, adjunte el oficio de permiso o la solicitud.",
     "cond": {
      "seccion": "formacion"
     },
     "obligatoria": false,
     "opciones": [
      {
       "v": "Sí",
       "otro": false
      },
      {
       "v": "En trámite",
       "otro": false
      },
      {
       "v": "No",
       "otro": false
      },
      {
       "v": "Otro (¿cuál?)",
       "otro": true
      }
     ],
     "salidas": [
      "No lo sé"
     ],
     "adjunto": {
      "etiqueta": "Oficio de permiso o solicitud",
      "principal": false
     }
    },
    {
     "id": "5.9",
     "texto": "¿Se pedirá autorización por escrito a madres, padres o tutores?",
     "tipo": "unica",
     "ayuda": "Se necesita al trabajar con menores y al usar sus datos o fotografías.\nSi ya tiene el formato de autorización, adjúntelo.",
     "cond": {
      "seccion": "formacion"
     },
     "obligatoria": false,
     "opciones": [
      {
       "v": "Sí",
       "otro": false
      },
      {
       "v": "No",
       "otro": false
      },
      {
       "v": "Otro (¿cuál?)",
       "otro": true
      }
     ],
     "salidas": [
      "No lo sé"
     ],
     "adjunto": {
      "etiqueta": "Formato de autorización (opcional)",
      "principal": false
     }
    },
    {
     "id": "5.10",
     "texto": "Costo total del programa y costo por alumno. Si tiene la cotización, súbala.",
     "tipo": "moneda",
     "ayuda": "Ejemplo: «$13,400,000 para 500 alumnos = $26,800 por alumno».\nAdjunte la cotización del proveedor, de preferencia en papel membretado.",
     "cond": {
      "seccion": "formacion"
     },
     "obligatoria": false,
     "salidas": [
      "Aún no lo tenemos"
     ],
     "adjunto": {
      "etiqueta": "Cotización del programa",
      "principal": false
     }
    }
   ]
  },
  {
   "n": 6,
   "titulo": "Equipamiento",
   "preguntas": [
    {
     "id": "6.1",
     "texto": "Suba la lista de equipo usando la plantilla: qué es, especificaciones, cantidad y precio con IVA.",
     "tipo": "archivo",
     "ayuda": "Descargue la plantilla al inicio de esta sección. Ejemplo de renglón: «Estación de soldadura SMD; 110 V, control digital; 10 piezas; $8,500 c/u; $85,000».\nSi aún no tiene la lista completa, suba lo que tenga.",
     "cond": {
      "seccion": "equipamiento"
     },
     "obligatoria": false,
     "salidas": [
      "Aún no lo tenemos"
     ],
     "adjunto": {
      "etiqueta": "Lista de equipo (plantilla llena)",
      "principal": true
     },
     "plantilla": {
      "nombre": "Plantilla de equipo",
      "url": "plantillas/Plantilla_equipo.xlsx"
     }
    },
    {
     "id": "6.2",
     "texto": "¿Cuántas cotizaciones tienen por cada equipo?",
     "tipo": "unica",
     "ayuda": "Gobierno suele pedir tres cotizaciones de proveedores distintos para comparar precios.",
     "cond": {
      "seccion": "equipamiento"
     },
     "obligatoria": false,
     "opciones": [
      {
       "v": "Tres o más de proveedores distintos",
       "otro": false
      },
      {
       "v": "Una o dos",
       "otro": false
      },
      {
       "v": "Ninguna todavía",
       "otro": false
      },
      {
       "v": "Otro (¿cuál?)",
       "otro": true
      }
     ],
     "salidas": [
      "Aún no lo tenemos"
     ]
    },
    {
     "id": "6.3",
     "texto": "Suba las cotizaciones que tenga.",
     "tipo": "archivo",
     "ayuda": "Suba todas las cotizaciones, en PDF y en papel membretado del proveedor, de preferencia. Si un equipo tiene varias, súbalas todas.",
     "cond": {
      "q": "6.2",
      "no": [
       "Ninguna todavía"
      ]
     },
     "obligatoria": false,
     "salidas": [
      "Aún no lo tenemos"
     ],
     "adjunto": {
      "etiqueta": "Cotizaciones",
      "principal": true
     }
    },
    {
     "id": "6.4",
     "texto": "¿Algún equipo solo lo vende un proveedor?",
     "tipo": "unica",
     "ayuda": "Ejemplo: «Sí, el simulador de semiconductores solo lo vende el distribuidor autorizado de la marca en México».\nSi la tiene, adjunte la carta de distribuidor exclusivo.",
     "cond": {
      "seccion": "equipamiento"
     },
     "obligatoria": false,
     "opciones": [
      {
       "v": "Sí (¿cuál y por qué?)",
       "otro": true
      },
      {
       "v": "No",
       "otro": false
      },
      {
       "v": "Otro (¿cuál?)",
       "otro": true
      }
     ],
     "salidas": [
      "No lo sé"
     ],
     "adjunto": {
      "etiqueta": "Carta de distribuidor exclusivo",
      "principal": false
     }
    },
    {
     "id": "6.5",
     "texto": "¿Qué incluyen las cotizaciones?",
     "tipo": "varias",
     "ayuda": "Marque todo lo que incluyan.",
     "cond": {
      "seccion": "equipamiento"
     },
     "obligatoria": false,
     "opciones": [
      {
       "v": "Envío",
       "otro": false
      },
      {
       "v": "Instalación",
       "otro": false
      },
      {
       "v": "Capacitación a docentes",
       "otro": false
      },
      {
       "v": "Garantía",
       "otro": false
      },
      {
       "v": "Otro (¿cuál?)",
       "otro": true
      }
     ],
     "salidas": [
      "No lo sé"
     ]
    },
    {
     "id": "6.6",
     "texto": "¿Cuánto tarda en llegar el equipo una vez pagado?",
     "tipo": "unica",
     "ayuda": "",
     "cond": {
      "seccion": "equipamiento"
     },
     "obligatoria": false,
     "opciones": [
      {
       "v": "Menos de 1 mes",
       "otro": false
      },
      {
       "v": "De 1 a 3 meses",
       "otro": false
      },
      {
       "v": "De 3 a 6 meses",
       "otro": false
      },
      {
       "v": "Más de 6 meses",
       "otro": false
      },
      {
       "v": "Otro (¿cuál?)",
       "otro": true
      }
     ],
     "salidas": [
      "No lo sé"
     ]
    },
    {
     "id": "6.7",
     "texto": "¿Hay equipo importado o cotizado en dólares?",
     "tipo": "unica",
     "ayuda": "",
     "cond": {
      "seccion": "equipamiento"
     },
     "obligatoria": false,
     "opciones": [
      {
       "v": "Sí",
       "otro": false
      },
      {
       "v": "No",
       "otro": false
      },
      {
       "v": "Otro (¿cuál?)",
       "otro": true
      }
     ],
     "salidas": [
      "No lo sé"
     ]
    },
    {
     "id": "6.8",
     "texto": "¿El espacio donde irá el equipo está listo?",
     "tipo": "unica",
     "ayuda": "Adjunte de 2 a 5 fotografías del espacio tal como está hoy.",
     "cond": {
      "seccion": "equipamiento"
     },
     "obligatoria": false,
     "opciones": [
      {
       "v": "Sí, está listo",
       "otro": false
      },
      {
       "v": "Necesita ajustes menores (contactos, red, mobiliario)",
       "otro": false
      },
      {
       "v": "Necesita obra o instalación eléctrica nueva",
       "otro": false
      },
      {
       "v": "Todavía no hay espacio",
       "otro": false
      },
      {
       "v": "Otro (¿cuál?)",
       "otro": true
      }
     ],
     "salidas": [
      "No lo sé"
     ],
     "adjunto": {
      "etiqueta": "Fotografías del espacio (2 a 5)",
      "principal": false
     }
    },
    {
     "id": "6.9",
     "texto": "¿Quién pagaría esas adecuaciones?",
     "tipo": "corto",
     "ayuda": "Ejemplo: «El plantel, con su presupuesto de mantenimiento».",
     "cond": {
      "q": "6.8",
      "no": [
       "Sí, está listo"
      ]
     },
     "obligatoria": false,
     "salidas": [
      "Aún no lo tenemos"
     ]
    },
    {
     "id": "6.10",
     "texto": "¿En qué carreras o especialidades se usará y cuántos alumnos por ciclo?",
     "tipo": "corto",
     "ayuda": "Ejemplo: «Mecatrónica y Electrónica; 320 alumnos por ciclo».",
     "cond": {
      "seccion": "equipamiento"
     },
     "obligatoria": false,
     "salidas": [
      "Aún no lo tenemos"
     ]
    },
    {
     "id": "6.11",
     "texto": "Ya instalado, ¿quién será dueño del equipo y quién lo resguarda?",
     "tipo": "corto",
     "ayuda": "Ejemplo: «El plantel; queda en su inventario a cargo del jefe de taller».",
     "cond": {
      "seccion": "equipamiento"
     },
     "obligatoria": false,
     "salidas": [
      "Aún no lo tenemos"
     ]
    },
    {
     "id": "6.12",
     "texto": "¿Quién pagará mantenimiento, consumibles y licencias después?",
     "tipo": "unica",
     "ayuda": "",
     "cond": {
      "seccion": "equipamiento"
     },
     "obligatoria": false,
     "opciones": [
      {
       "v": "La institución, con presupuesto propio",
       "otro": false
      },
      {
       "v": "Empresas aliadas",
       "otro": false
      },
      {
       "v": "Otro (¿cuál?)",
       "otro": true
      }
     ],
     "salidas": [
      "Aún no lo tenemos"
     ]
    },
    {
     "id": "6.13",
     "texto": "Si el recurso no alcanzara para todo, ¿qué es lo indispensable?",
     "tipo": "largo",
     "ayuda": "Ejemplo: «Primero las 10 estaciones de PLC; los brazos robóticos pueden esperar a 2028».",
     "cond": {
      "seccion": "equipamiento"
     },
     "obligatoria": false,
     "salidas": [
      "Aún no lo tenemos"
     ]
    }
   ]
  },
  {
   "n": 7,
   "titulo": "Fechas y resultados",
   "preguntas": [
    {
     "id": "7.1",
     "texto": "¿Para qué fecha necesitan el recurso para no perder el ciclo escolar o la entrega?",
     "tipo": "fecha",
     "ayuda": "Ejemplo: 15 de enero de 2027.",
     "cond": null,
     "obligatoria": false,
     "salidas": [
      "Aún no lo tenemos"
     ]
    },
    {
     "id": "7.2",
     "texto": "¿Qué se hará mes por mes en 2027?",
     "tipo": "largo",
     "ayuda": "Ejemplo: «Febrero: compra. Marzo y abril: entrega e instalación. Mayo: capacitación a docentes. Agosto: inicio de prácticas».\nSi ya subió el calendario en la pregunta 1.7, puede saltar esta.",
     "cond": null,
     "obligatoria": false,
     "salidas": [
      "Aún no lo tenemos"
     ],
     "adjunto": {
      "etiqueta": "Calendario 2027",
      "principal": false
     },
     "plantilla": {
      "nombre": "Plantilla de calendario",
      "url": "plantillas/Plantilla_calendario.xlsx"
     }
    },
    {
     "id": "7.3",
     "texto": "¿Cómo sabremos que el proyecto funcionó? Escriba de 1 a 3 metas con número.",
     "tipo": "largo",
     "ayuda": "Ejemplo: «500 alumnos terminan el programa con 80 % de asistencia; 30 % sube a nivel STEM medio en el examen final».",
     "cond": null,
     "obligatoria": false,
     "salidas": [
      "Aún no lo tenemos"
     ]
    },
    {
     "id": "7.4",
     "texto": "¿Quién reunirá las facturas y evidencias para comprobar el gasto?",
     "tipo": "corto",
     "ayuda": "Ejemplo: «C.P. Rosa Díaz, jefa de Recursos Financieros».",
     "cond": null,
     "obligatoria": false,
     "salidas": [
      "Aún no lo tenemos"
     ]
    },
    {
     "id": "7.5",
     "texto": "¿Algún proveedor tiene relación familiar o de negocios con personal de la institución o del comité?",
     "tipo": "unica",
     "ayuda": "Declararlo no descalifica al proveedor; ocultarlo sí puede invalidar la compra.",
     "cond": null,
     "obligatoria": false,
     "opciones": [
      {
       "v": "No",
       "otro": false
      },
      {
       "v": "Sí (explique)",
       "otro": true
      },
      {
       "v": "Otro (¿cuál?)",
       "otro": true
      }
     ],
     "salidas": [
      "No lo sé"
     ]
    },
    {
     "id": "7.6",
     "texto": "¿Algo más que debamos saber antes de la sesión?",
     "tipo": "largo",
     "ayuda": "",
     "cond": null,
     "obligatoria": false,
     "salidas": []
    }
   ]
  }
 ],
 "secciones": {
  "formacion": [
   "Formación de alumnos",
   "Formación o certificación de docentes",
   "Certificaciones para alumnos"
  ],
  "equipamiento": [
   "Equipamiento de talleres o laboratorios",
   "Materiales, kits o robots",
   "Licencias o software",
   "Adecuación de espacios"
  ]
 }
};

// ============================================================
// CALENDARIOS INSTITUCIONALES MAPS · Aula CLARA
// ============================================================
//
// INSTRUCCIONES PARA ACTUALIZAR:
// Cuando Tecmilenio te envíe las fechas del nuevo semestre:
//   1. Copia el bloque de un semestre existente
//   2. Pégalo al final del array SEMESTRES
//   3. Actualiza todas las fechas con las nuevas
//   4. Guarda · commit · push → Vercel despliega en 2 min
//
// REGLAS FIJAS (nunca cambian, no tocar):
//   - Cada módulo tiene exactamente 8 semanas pedagógicas
//   - La Semana 8 de cada módulo SIEMPRE es Assessment/Presentación
//   - Entre módulos hay una Semana SEDI (no lectiva, no cuenta)
//
// FORMATO DE FECHAS: "YYYY-MM-DD" (ISO, siempre lunes de inicio)
// ============================================================

export const SEMESTRES = [
  {
    id: 'maps-ago-dic-2026',
    label: 'MAPS Agosto – Diciembre 2026',
    activo: true,   // ← este es el semestre actual que verán los docentes
    modulos: [
      {
        numero: 1,
        nombre: 'Módulo 1',
        inicio: '2026-08-10',          // Lunes 10 de agosto
        fin: '2026-10-02',             // Viernes 02 de octubre
        semanaSedi: {
          // Semana SEDI: entre M1 y M2, no cuenta como semana pedagógica
          inicio: '2026-10-05',        // Lunes 05 octubre (lunes después del fin M1)
          fin: '2026-10-09',           // Viernes 09 octubre
          label: 'Semana SEDI',
        },
        asuetos: [
          { fecha: '2026-09-16', nombre: 'Independencia de México' },
        ],
        assessments: {
          inicio: '2026-09-28',        // Semana 8 siempre
          fin: '2026-10-02',
          label: 'Periodo de Assessments M1',
        },
        limiteCaptura: {
          fecha: '2026-10-05',
          label: 'Límite captura calificaciones Banner M1',
        },
      },
      {
        numero: 2,
        nombre: 'Módulo 2',
        inicio: '2026-10-12',          // Lunes 12 de octubre (lunes después de SEDI)
        fin: '2026-12-05',             // Viernes 05 de diciembre
        semanaSedi: null,              // No hay SEDI después del último módulo
        asuetos: [
          { fecha: '2026-11-16', nombre: 'Revolución Mexicana' },
        ],
        assessments: {
          inicio: '2026-11-30',        // Semana 8 siempre
          fin: '2026-12-05',
          label: 'Periodo de Assessments M2',
        },
        limiteCaptura: {
          fecha: '2026-12-07',
          label: 'Límite final captura calificaciones Banner',
        },
      },
    ],
  },

  // ── PLANTILLA PARA EL PRÓXIMO SEMESTRE ──────────────────────────────────
  // Cuando lleguen las fechas de enero 2027, descomenta y rellena:
  //
  // {
  //   id: 'maps-ene-abr-2027',
  //   label: 'MAPS Enero – Abril 2027',
  //   activo: false,   // ← cambia a true cuando empiece
  //   modulos: [
  //     {
  //       numero: 1,
  //       nombre: 'Módulo 1',
  //       inicio: 'YYYY-MM-DD',
  //       fin: 'YYYY-MM-DD',
  //       semanaSedi: {
  //         inicio: 'YYYY-MM-DD',
  //         fin: 'YYYY-MM-DD',
  //         label: 'Semana SEDI',
  //       },
  //       asuetos: [
  //         { fecha: 'YYYY-MM-DD', nombre: 'Nombre del asueto' },
  //       ],
  //       assessments: { inicio: 'YYYY-MM-DD', fin: 'YYYY-MM-DD', label: 'Assessments M1' },
  //       limiteCaptura: { fecha: 'YYYY-MM-DD', label: 'Límite Banner M1' },
  //     },
  //     {
  //       numero: 2,
  //       nombre: 'Módulo 2',
  //       inicio: 'YYYY-MM-DD',
  //       fin: 'YYYY-MM-DD',
  //       semanaSedi: null,
  //       asuetos: [],
  //       assessments: { inicio: 'YYYY-MM-DD', fin: 'YYYY-MM-DD', label: 'Assessments M2' },
  //       limiteCaptura: { fecha: 'YYYY-MM-DD', label: 'Límite Banner M2' },
  //     },
  //   ],
  // },
]

// ── Helpers que usa MiPeriodo.jsx ────────────────────────────────────────

/** Devuelve el semestre marcado como activo, o el más reciente si ninguno */
export function getSemestreActivo() {
  return SEMESTRES.find((s) => s.activo) ?? SEMESTRES[SEMESTRES.length - 1]
}

/** Devuelve todos los semestres para el dropdown de selección */
export function getSemestresDisponibles() {
  return SEMESTRES.map((s) => ({ id: s.id, label: s.label, activo: s.activo }))
}

/** Dado un semestreId y numero de módulo, devuelve el objeto módulo completo */
export function getModulo(semestreId, numeroModulo) {
  const sem = SEMESTRES.find((s) => s.id === semestreId)
  if (!sem) return null
  return sem.modulos.find((m) => m.numero === numeroModulo) ?? null
}

/**
 * Dado un módulo, devuelve array de 8 bloques de semana con:
 * { numero, fechaInicio, fechaFin, esAssessment, asuetos[], esSedi }
 * La Semana 8 siempre es Assessment — regla fija.
 */
export function getSemanasModulo(modulo) {
  if (!modulo) return []
  const semanas = []
  let cursor = new Date(modulo.inicio + 'T12:00:00')

  for (let i = 1; i <= 8; i++) {
    const inicioSemana = new Date(cursor)
    const finSemana = new Date(cursor)
    finSemana.setDate(finSemana.getDate() + 4) // lunes → viernes

    const asuetosEnSemana = (modulo.asuetos || []).filter((a) => {
      const fa = new Date(a.fecha + 'T12:00:00')
      return fa >= inicioSemana && fa <= finSemana
    })

    semanas.push({
      numero: i,
      fechaInicio: inicioSemana.toISOString().split('T')[0],
      fechaFin: finSemana.toISOString().split('T')[0],
      esAssessment: i === 8,          // REGLA FIJA: Semana 8 = Assessment siempre
      asuetos: asuetosEnSemana,
      tieneAsueto: asuetosEnSemana.length > 0,
    })

    cursor.setDate(cursor.getDate() + 7)
  }

  return semanas
}

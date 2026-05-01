// ============================================================
// LOCAL STORAGE · Persistencia de Aula CLARA
// ============================================================

const KEYS = {
  SAVED:    'aulaclara_saved',     // Generaciones guardadas
  LESSONS:  'aulaclara_lessons',   // Progreso del mini-curso
  PROFILE:  'aulaclara_profile',   // Perfil docente
  PERIODO:  'aulaclara_periodo',   // Configuración del periodo (Mi periodo)
  TIMERLOG: 'aulaclara_timerlog',  // Registros de Timer
}

function safeLoad(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

function safeSave(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

// ============================================================
// GUARDADOS
// ============================================================

export function getAllSaved() {
  return safeLoad(KEYS.SAVED, [])
}

export function saveGenerated({ type, title, meta, content }) {
  const all = getAllSaved()
  const entry = {
    id: `${type}_${Date.now()}`,
    type, title, meta, content,
    createdAt: new Date().toISOString(),
  }
  all.unshift(entry)
  if (all.length > 50) all.splice(50)
  safeSave(KEYS.SAVED, all)
  return entry
}

export function deleteSaved(id) {
  const all = getAllSaved().filter((x) => x.id !== id)
  safeSave(KEYS.SAVED, all)
}

// ============================================================
// MINI-CURSO · "El porqué de CLARA"
// ============================================================

export function getLessonProgress() {
  return safeLoad(KEYS.LESSONS, {})
}

export function markLessonComplete(lessonId) {
  const prog = getLessonProgress()
  prog[lessonId] = { completed: true, completedAt: new Date().toISOString() }
  safeSave(KEYS.LESSONS, prog)
}

export function markLessonStarted(lessonId) {
  const prog = getLessonProgress()
  if (!prog[lessonId]) {
    prog[lessonId] = { completed: false, startedAt: new Date().toISOString() }
    safeSave(KEYS.LESSONS, prog)
  }
}

export function getLessonStatus(lessonId) {
  const prog = getLessonProgress()
  if (!prog[lessonId]) return 'pending'
  if (prog[lessonId].completed) return 'done'
  return 'now'
}

// ============================================================
// PERFIL DEL DOCENTE
// ============================================================

export function getProfile() {
  const stored = safeLoad(KEYS.PROFILE, null)
  // Defensivo: si nunca se guardó o si lo guardado es incompleto, devolvemos defaults
  return {
    nombre: (stored && stored.nombre) ? stored.nombre : 'Docente',
    cantidad: (stored && stored.cantidad) ? stored.cantidad : 30,
  }
}

export function saveProfile(profile) {
  safeSave(KEYS.PROFILE, profile)
}

// ============================================================
// MI PERIODO (calendario · 8 semanas pedagógicas con feriados,
// semanas no lectivas y reto)
// ============================================================

// modalidad: 'A' = una sola semana del reto, 'B' = fases distribuidas, 'C' = continuo
//
// MODO DE CÁLCULO DE SEMANAS:
// Las semanas pedagógicas son SIEMPRE 8 (regla del modelo MAPS).
// El calendario REAL puede ser más largo si hay semanas no lectivas
// (ej. semana santa). Esas semanas se restan del cálculo pedagógico.
//
// Ejemplo: periodo del 16 mar al 15 may = 9 semanas calendario.
// Si la semana del 30 mar es semana santa (no lectiva) → 8 semanas pedagógicas.
//
// estructura del periodo:
// {
//   materia: 'Base de datos',
//   fechaInicio: '2026-03-16',  // YYYY-MM-DD primer día oficial
//   fechaFin: '2026-05-15',     // YYYY-MM-DD último día oficial (NUEVO)
//   diasClase: ['Lun','Mar','Mié','Jue','Vie'],
//   hora: '9:00 - 11:00',
//   modalidadReto: 'B',
//   semanasReto: [2, 4, 6],          // numeradas en semanas PEDAGÓGICAS
//   fasesReto: { 2: 'Investigación' },
//   feriadosMx: ['05-01', '05-05'],  // mm-dd seleccionados
//   feriadosCustom: [{fecha:'2026-05-10', nombre:'Junta'}],
//   semanasNoLectivas: [              // NUEVO · semanas calendario que se saltan
//     { semanaCalendario: 3, motivo: 'Semana Santa' }
//   ],
//   clasesEditadas: { ... }
// }

export function getPeriodo() {
  return safeLoad(KEYS.PERIODO, null)
}

export function savePeriodo(periodo) {
  safeSave(KEYS.PERIODO, periodo)
}

export function updateClasePeriodo(fechaISO, updates) {
  const p = getPeriodo()
  if (!p) return
  if (!p.clasesEditadas) p.clasesEditadas = {}
  p.clasesEditadas[fechaISO] = { ...(p.clasesEditadas[fechaISO] || {}), ...updates }
  savePeriodo(p)
}

// ============================================================
// LÓGICA DE CÁLCULO DE SEMANAS PEDAGÓGICAS
// ============================================================

// Calcula cuántas semanas calendario hay entre fechaInicio y fechaFin
// (ambas inclusive). Si no se da fechaFin, asume 8 semanas (legacy).
export function calcularSemanasCalendario(fechaInicio, fechaFin) {
  if (!fechaFin) return 8
  const inicio = isoToDate(fechaInicio)
  const fin = isoToDate(fechaFin)
  const diffMs = fin - inicio
  const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1 // inclusive
  return Math.ceil(diffDias / 7)
}

// Devuelve la lista de "bloques de semana" del periodo.
// Cada bloque tiene: numCalendario (1..N), numPedagogica (1..8 o null si no lectiva),
// fechaInicio, fechaFin, esNoLectiva, motivo (si aplica).
// Esta función es el corazón de toda la vista del calendario.
export function getBloquesSemanasPeriodo(periodo) {
  if (!periodo || !periodo.fechaInicio) return []
  const totalCal = calcularSemanasCalendario(periodo.fechaInicio, periodo.fechaFin)
  const noLectivas = periodo.semanasNoLectivas || []
  const noLectivasMap = {}
  noLectivas.forEach((nl) => { noLectivasMap[nl.semanaCalendario] = nl.motivo || 'Semana no lectiva' })

  const bloques = []
  let pedCounter = 0
  for (let i = 1; i <= totalCal; i++) {
    const inicio = addDays(periodo.fechaInicio, (i - 1) * 7)
    const fin = addDays(inicio, 6)
    const esNoLectiva = !!noLectivasMap[i]
    let numPedagogica = null
    if (!esNoLectiva) {
      pedCounter++
      numPedagogica = pedCounter
    }
    bloques.push({
      numCalendario: i,
      numPedagogica,
      fechaInicio: inicio,
      fechaFin: fin,
      esNoLectiva,
      motivo: esNoLectiva ? noLectivasMap[i] : null,
    })
  }
  return bloques
}

// Para un día específico (ISO), devuelve a qué bloque pertenece.
export function getBloqueDeFecha(periodo, fechaISO) {
  const bloques = getBloquesSemanasPeriodo(periodo)
  for (const b of bloques) {
    if (fechaISO >= b.fechaInicio && fechaISO <= b.fechaFin) return b
  }
  return null
}

// Cuenta cuántas semanas pedagógicas hay configuradas (sin contar no lectivas).
export function contarSemanasPedagogicas(periodo) {
  if (!periodo) return 0
  const bloques = getBloquesSemanasPeriodo(periodo)
  return bloques.filter((b) => !b.esNoLectiva).length
}

// ============================================================
// REGISTROS DEL TIMER (auto-registro de práctica)
// ============================================================

export function getTimerLogs() {
  return safeLoad(KEYS.TIMERLOG, [])
}

export function saveTimerLog(log) {
  const all = getTimerLogs()
  all.unshift({ ...log, id: `timer_${Date.now()}`, createdAt: new Date().toISOString() })
  if (all.length > 30) all.splice(30)
  safeSave(KEYS.TIMERLOG, all)
}

// ============================================================
// ESTADÍSTICAS
// ============================================================

export function getStats() {
  const saved = getAllSaved()
  const planeaciones = saved.filter((s) => s.type === 'planeacion').length
  const retos = saved.filter((s) => s.type === 'reto').length
  const simplificaciones = saved.filter((s) => s.type === 'simplificar').length
  const mensajes = saved.filter((s) => s.type === 'mensaje').length
  const timerCount = getTimerLogs().length

  const hoursEst = planeaciones * 1.5 + retos * 2 + simplificaciones * 0.3 + mensajes * 0.2 + timerCount * 0.1

  return {
    planeaciones, retos, simplificaciones, mensajes, timerCount,
    total: saved.length,
    hoursSaved: Math.round(hoursEst * 10) / 10,
  }
}

// ============================================================
// HELPERS DE FECHA
// ============================================================

export function getTodayTipIndex(totalTips) {
  const start = new Date(new Date().getFullYear(), 0, 0)
  const diff = new Date() - start
  const day = Math.floor(diff / (1000 * 60 * 60 * 24))
  return day % totalTips
}

export function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Buenos días'
  if (h < 19) return 'Buenas tardes'
  return 'Buenas noches'
}

export function getTodayFormatted() {
  const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']
  const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
  const d = new Date()
  const dia = dias[d.getDay()]
  const num = d.getDate()
  const mes = meses[d.getMonth()]
  return `${dia.charAt(0).toUpperCase() + dia.slice(1)} ${num} de ${mes}`
}

export function isoToday() {
  return new Date().toISOString().slice(0, 10)
}

// Convierte 'YYYY-MM-DD' a Date
export function isoToDate(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

// Convierte Date a 'YYYY-MM-DD'
export function dateToIso(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

// Suma días a una fecha ISO
export function addDays(iso, days) {
  const d = isoToDate(iso)
  d.setDate(d.getDate() + days)
  return dateToIso(d)
}

// Día de la semana en español (Lun, Mar, etc.)
const DIAS_SEM = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
export function diaSemanaCorto(iso) {
  return DIAS_SEM[isoToDate(iso).getDay()]
}

// Formato corto de fecha "23 abr"
const MESES_CORTOS = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic']
export function formatFechaCorta(iso) {
  const d = isoToDate(iso)
  return `${d.getDate()} ${MESES_CORTOS[d.getMonth()]}`
}

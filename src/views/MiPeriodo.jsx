import { useState } from 'react'
import { Icon } from '../components.jsx'
import { FERIADOS_MX } from '../data.js'
import {
  getPeriodo, savePeriodo, updateClasePeriodo,
  isoToDate, dateToIso, addDays, diaSemanaCorto, formatFechaCorta,
  calcularSemanasCalendario, getBloquesSemanasPeriodo, contarSemanasPedagogicas,
} from '../storage.js'

const DIAS_SEM_OPCIONES = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

export default function MiPeriodo({ onPlanearClase }) {
  const [periodo, setPeriodo] = useState(getPeriodo())
  const [editing, setEditing] = useState(!periodo)
  const [diaSeleccionado, setDiaSeleccionado] = useState(null)
  const [, setTick] = useState(0)

  function handleSavePeriodo(p) {
    savePeriodo(p)
    setPeriodo(p)
    setEditing(false)
    setTick((t) => t + 1)
  }

  function handleEditarClase(fechaISO, updates) {
    updateClasePeriodo(fechaISO, updates)
    setPeriodo(getPeriodo())
    setDiaSeleccionado(null)
    setTick((t) => t + 1)
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Mi periodo</h1>
          <p className="page-subtitle">Tu calendario real con feriados, semana santa, semana del reto y presentación final.</p>
        </div>
      </div>

      {!periodo && !editing && (
        <PeriodoEmpty onStart={() => setEditing(true)} />
      )}

      {editing && (
        <PeriodoConfig periodo={periodo} onSave={handleSavePeriodo} onCancel={() => setEditing(false)} />
      )}

      {periodo && !editing && (
        <>
          <PeriodoSummary periodo={periodo} onEdit={() => setEditing(true)} />
          <Calendario
            periodo={periodo}
            onDayClick={setDiaSeleccionado}
            diaSeleccionado={diaSeleccionado}
            onUpdate={handleEditarClase}
            onPlanearClase={onPlanearClase}
            onCloseEdit={() => setDiaSeleccionado(null)}
          />
        </>
      )}
    </div>
  )
}

// ============================================================
// VACÍO
// ============================================================
function PeriodoEmpty({ onStart }) {
  return (
    <div className="periodo-empty">
      <Icon.Calendar size={32} color="#1a5f5a" />
      <h3 style={{ marginTop: 12 }}>Configura tu periodo</h3>
      <p>
        Aula CLARA necesita conocer tu calendario real para generar el dashboard, planear tus clases con fechas concretas
        y avisarte cuando se acerque la semana del reto.
        <br /><br />
        Toma 2 minutos. Después puedes editarlo cuando quieras.
      </p>
      <button className="btn-primary" onClick={onStart}>
        <Icon.Plus size={14} color="white" /> Comenzar configuración
      </button>
    </div>
  )
}

// ============================================================
// CONFIGURACIÓN · formulario con fecha inicio + fecha fin + semanas no lectivas
// ============================================================
function PeriodoConfig({ periodo, onSave, onCancel }) {
  const today = dateToIso(new Date())
  const [materia, setMateria] = useState(periodo?.materia || '')
  const [fechaInicio, setFechaInicio] = useState(periodo?.fechaInicio || today)
  // fechaFin: si periodo viejo no tenía, calcular 8 semanas desde inicio (legacy)
  const defaultFin = periodo?.fechaFin || addDays(periodo?.fechaInicio || today, 7 * 8 - 1)
  const [fechaFin, setFechaFin] = useState(defaultFin)
  const [diasClase, setDiasClase] = useState(periodo?.diasClase || ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'])
  const [hora, setHora] = useState(periodo?.hora || '')
  const [modalidadReto, setModalidadReto] = useState(periodo?.modalidadReto || 'B')
  const [semanasReto, setSemanasReto] = useState(periodo?.semanasReto || [4])
  const [fasesReto, setFasesReto] = useState(periodo?.fasesReto || { 4: 'Fase del reto' })
  const [feriadosCustom, setFeriadosCustom] = useState(periodo?.feriadosCustom || [])
  const [feriadoNuevo, setFeriadoNuevo] = useState({ fecha: '', nombre: '' })
  const [feriadosMxSeleccion, setFeriadosMxSeleccion] = useState(
    periodo?.feriadosMx ?? FERIADOS_MX.map((f) => f.fecha)
  )
  const [semanasNoLectivas, setSemanasNoLectivas] = useState(periodo?.semanasNoLectivas || [])

  // Calculados en vivo
  const totalSemanasCal = calcularSemanasCalendario(fechaInicio, fechaFin)
  const semanasPed = totalSemanasCal - semanasNoLectivas.length

  function toggleDia(d) {
    setDiasClase((prev) => prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d])
  }

  function toggleSemanaReto(n) {
    setSemanasReto((prev) => {
      if (prev.includes(n)) {
        const nuevas = prev.filter((x) => x !== n)
        const newFases = { ...fasesReto }
        delete newFases[n]
        setFasesReto(newFases)
        return nuevas
      }
      setFasesReto({ ...fasesReto, [n]: `Fase del reto` })
      return [...prev, n].sort((a, b) => a - b)
    })
  }

  function toggleFeriadoMx(fecha) {
    setFeriadosMxSeleccion((prev) =>
      prev.includes(fecha) ? prev.filter((x) => x !== fecha) : [...prev, fecha]
    )
  }

  function agregarFeriadoCustom() {
    if (!feriadoNuevo.fecha || !feriadoNuevo.nombre) return
    setFeriadosCustom([...feriadosCustom, { ...feriadoNuevo }])
    setFeriadoNuevo({ fecha: '', nombre: '' })
  }

  function quitarFeriadoCustom(i) {
    setFeriadosCustom(feriadosCustom.filter((_, idx) => idx !== i))
  }

  function toggleSemanaNoLectiva(numCal) {
    setSemanasNoLectivas((prev) => {
      const existe = prev.find((nl) => nl.semanaCalendario === numCal)
      if (existe) return prev.filter((nl) => nl.semanaCalendario !== numCal)
      return [...prev, { semanaCalendario: numCal, motivo: 'Semana santa' }].sort(
        (a, b) => a.semanaCalendario - b.semanaCalendario
      )
    })
  }

  function actualizarMotivoNoLectiva(numCal, motivo) {
    setSemanasNoLectivas((prev) =>
      prev.map((nl) => (nl.semanaCalendario === numCal ? { ...nl, motivo } : nl))
    )
  }

  function handleSave() {
    if (!materia || !fechaInicio || !fechaFin || diasClase.length === 0) {
      alert('Completa al menos: Materia, Fecha de inicio, Fecha de fin y al menos un día de clase.')
      return
    }
    if (fechaFin <= fechaInicio) {
      alert('La fecha de fin debe ser posterior a la fecha de inicio.')
      return
    }
    if (semanasPed < 1) {
      alert('Tu periodo no tiene semanas pedagógicas. Verifica las semanas no lectivas marcadas.')
      return
    }
    if (semanasPed !== 8) {
      const seguir = window.confirm(
        `Atención · tu periodo tiene ${semanasPed} semana(s) pedagógica(s) en lugar de 8 (regla MAPS). ¿Quieres guardarlo así de todas formas?`
      )
      if (!seguir) return
    }
    const p = {
      materia,
      fechaInicio,
      fechaFin,
      diasClase,
      hora,
      modalidadReto,
      semanasReto: modalidadReto === 'B' || modalidadReto === 'A' ? semanasReto : [],
      fasesReto: modalidadReto === 'B' || modalidadReto === 'A' ? fasesReto : {},
      feriadosMx: feriadosMxSeleccion,
      feriadosCustom,
      semanasNoLectivas,
      clasesEditadas: periodo?.clasesEditadas || {},
    }
    onSave(p)
  }

  // Construir lista de bloques de semana CALENDARIO (preview)
  const bloquesPreview = []
  for (let i = 1; i <= totalSemanasCal; i++) {
    const ini = addDays(fechaInicio, (i - 1) * 7)
    const fin = addDays(ini, 6)
    const noLec = semanasNoLectivas.find((nl) => nl.semanaCalendario === i)
    bloquesPreview.push({ numCal: i, ini, fin, noLectiva: noLec })
  }

  // Obtener el número pedagógico de cada bloque
  let pedCount = 0
  bloquesPreview.forEach((b) => {
    if (!b.noLectiva) {
      pedCount++
      b.numPed = pedCount
    } else {
      b.numPed = null
    }
  })

  return (
    <div className="periodo-config">
      <h3>Configuración del periodo</h3>
      <p className="periodo-config-sub">
        Estos datos se guardan en tu navegador. El modelo MAPS pide 8 semanas pedagógicas.
        Si tu periodo dura más en calendario porque hay semana santa u otra pausa,
        marca esas semanas como no lectivas y el sistema las restará automáticamente.
      </p>

      <div className="row">
        <div className="field">
          <div className="field-label">Materia</div>
          <input value={materia} onChange={(e) => setMateria(e.target.value)} placeholder="Ej. Base de datos" />
        </div>
        <div className="field">
          <div className="field-label">Hora (opcional)</div>
          <input value={hora} onChange={(e) => setHora(e.target.value)} placeholder="Ej. 9:00 - 11:00" />
        </div>
      </div>

      <div className="row">
        <div className="field">
          <div className="field-label">Fecha de inicio del periodo</div>
          <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
          <div className="field-hint">Primer día oficial de clases.</div>
        </div>
        <div className="field">
          <div className="field-label">Fecha de fin del periodo</div>
          <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
          <div className="field-hint">Último día oficial del periodo (incluye presentación final).</div>
        </div>
      </div>

      {/* Resumen vivo */}
      <div className={`periodo-resumen-vivo ${semanasPed === 8 ? 'ok' : 'warn'}`}>
        <div className="prv-row">
          <span><b>{totalSemanasCal}</b> semanas calendario</span>
          <span>−</span>
          <span><b>{semanasNoLectivas.length}</b> no lectivas</span>
          <span>=</span>
          <span className="prv-result">
            <b>{semanasPed}</b> semanas pedagógicas
            {semanasPed === 8 && <span className="prv-ok"> ✓</span>}
            {semanasPed !== 8 && <span className="prv-warn"> ⚠ MAPS pide 8</span>}
          </span>
        </div>
      </div>

      <div className="field">
        <div className="field-label">Días de clase</div>
        <div className="checkbox-row">
          {DIAS_SEM_OPCIONES.map((d) => (
            <button key={d} className={`checkbox-pill ${diasClase.includes(d) ? 'on' : ''}`} onClick={() => toggleDia(d)}>
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* SEMANAS NO LECTIVAS · NUEVA SECCIÓN */}
      <div className="field">
        <div className="field-label">Semanas no lectivas (semana santa, evaluaciones, etc.)</div>
        <div className="field-hint" style={{ marginBottom: 8 }}>
          Marca las semanas calendario que NO cuentan como semana pedagógica. Aparecerán en gris en el calendario.
        </div>
        <div className="semanas-grid">
          {bloquesPreview.map((b) => (
            <button
              key={b.numCal}
              className={`semana-pill ${b.noLectiva ? 'no-lectiva' : ''}`}
              onClick={() => toggleSemanaNoLectiva(b.numCal)}
              type="button"
              title={`Semana ${b.numCal} calendario${b.numPed ? ` · pedagógica ${b.numPed}` : ' · no lectiva'}`}
            >
              <span className="sp-cal">Sem {b.numCal}</span>
              <span className="sp-fechas">{formatFechaCorta(b.ini)} – {formatFechaCorta(b.fin)}</span>
              {b.noLectiva && <span className="sp-tag">No lectiva</span>}
              {!b.noLectiva && <span className="sp-tag-ped">Ped. {b.numPed}</span>}
            </button>
          ))}
        </div>
        {semanasNoLectivas.length > 0 && (
          <div className="motivos-list">
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--tec-dark)', marginTop: 12, marginBottom: 6 }}>
              Motivo de cada semana no lectiva
            </div>
            {semanasNoLectivas.map((nl) => (
              <div key={nl.semanaCalendario} className="motivo-row">
                <span style={{ minWidth: 90, fontWeight: 600, fontSize: 12, color: 'var(--tec-amber-dark)' }}>
                  Sem {nl.semanaCalendario}:
                </span>
                <input
                  style={{ fontSize: 12, flex: 1 }}
                  value={nl.motivo}
                  onChange={(e) => actualizarMotivoNoLectiva(nl.semanaCalendario, e.target.value)}
                  placeholder="Ej. Semana santa · Evaluación institucional"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="field">
        <div className="field-label">Ritmo del reto</div>
        <div className="checkbox-row">
          <button className={`checkbox-pill ${modalidadReto === 'A' ? 'on' : ''}`} onClick={() => setModalidadReto('A')}>A · Una semana intensiva</button>
          <button className={`checkbox-pill ${modalidadReto === 'B' ? 'on' : ''}`} onClick={() => setModalidadReto('B')}>B · Fases distribuidas</button>
          <button className={`checkbox-pill ${modalidadReto === 'C' ? 'on' : ''}`} onClick={() => setModalidadReto('C')}>C · Continuo cada semana</button>
        </div>
        <div className="field-hint">
          {modalidadReto === 'A' && 'El reto se trabaja en una sola semana exclusiva.'}
          {modalidadReto === 'B' && 'Marca qué semanas tienen fase del reto. Cada fase puede tener un nombre.'}
          {modalidadReto === 'C' && 'El reto se trabaja un poco cada semana. No se marcan semanas específicas.'}
        </div>
      </div>

      {(modalidadReto === 'A' || modalidadReto === 'B') && (
        <div className="field">
          <div className="field-label">{modalidadReto === 'A' ? 'Semana del reto (elige una)' : 'Semanas con fase del reto'}</div>
          <div className="field-hint" style={{ marginBottom: 8 }}>
            Numeración de semanas pedagógicas. La última semana siempre es presentación final.
          </div>
          <div className="checkbox-row">
            {Array.from({ length: Math.max(0, semanasPed - 1) }, (_, idx) => idx + 1).map((n) => {
              const isOn = semanasReto.includes(n)
              return (
                <button
                  key={n}
                  className={`checkbox-pill ${isOn ? 'on' : ''}`}
                  onClick={() => {
                    if (modalidadReto === 'A') {
                      setSemanasReto([n])
                      setFasesReto({ [n]: 'Semana del reto' })
                    } else {
                      toggleSemanaReto(n)
                    }
                  }}
                >
                  Sem ped. {n}
                </button>
              )
            })}
          </div>

          {modalidadReto === 'B' && semanasReto.length > 0 && (
            <div style={{ marginTop: 10, background: 'var(--tec-cream)', padding: 12, borderRadius: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--tec-dark)', marginBottom: 8 }}>Nombre de cada fase (opcional)</div>
              {semanasReto.map((n) => (
                <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, minWidth: 90, color: 'var(--tec-amber-dark)' }}>Sem ped. {n}:</span>
                  <input
                    style={{ fontSize: 12, flex: 1 }}
                    value={fasesReto[n] || ''}
                    onChange={(e) => setFasesReto({ ...fasesReto, [n]: e.target.value })}
                    placeholder="Ej. Investigación · Prototipo · Validación"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="field">
        <div className="field-label">Días feriados (México)</div>
        <div className="feriados-list">
          {FERIADOS_MX.map((f) => {
            const checked = feriadosMxSeleccion.includes(f.fecha)
            return (
              <label key={f.fecha} className={`feriado-row ${checked ? 'checked' : ''}`}>
                <input type="checkbox" checked={checked} onChange={() => toggleFeriadoMx(f.fecha)} />
                <span>
                  <span className="feriado-nombre">{f.nombre}</span>
                  <span className="feriado-fecha">({f.fecha})</span>
                </span>
              </label>
            )
          })}
        </div>
        <div className="field-hint">Solo se aplican los que caen dentro de tu periodo.</div>
      </div>

      <div className="field">
        <div className="field-label">Días feriados o cancelaciones adicionales (opcional)</div>
        {feriadosCustom.length > 0 && (
          <div style={{ marginBottom: 8 }}>
            {feriadosCustom.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', fontSize: 12 }}>
                <span style={{ flex: 1 }}>{f.fecha} · {f.nombre}</span>
                <button onClick={() => quitarFeriadoCustom(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--tec-gray-600)' }}>
                  <Icon.Trash size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
        <div style={{ display: 'flex', gap: 8 }}>
          <input type="date" style={{ maxWidth: 160 }} value={feriadoNuevo.fecha} onChange={(e) => setFeriadoNuevo({ ...feriadoNuevo, fecha: e.target.value })} />
          <input style={{ flex: 1 }} value={feriadoNuevo.nombre} onChange={(e) => setFeriadoNuevo({ ...feriadoNuevo, nombre: e.target.value })} placeholder="Motivo (Ej. Junta institucional)" />
          <button className="btn-secondary" onClick={agregarFeriadoCustom} style={{ flexShrink: 0 }}>
            <Icon.Plus size={12} /> Agregar
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        <button className="btn-primary" onClick={handleSave}>
          <Icon.Save size={14} /> Guardar periodo
        </button>
        {periodo && (
          <button className="btn-secondary" onClick={onCancel}>Cancelar</button>
        )}
      </div>
    </div>
  )
}

// ============================================================
// SUMMARY · cuando ya hay periodo guardado
// ============================================================
function PeriodoSummary({ periodo, onEdit }) {
  const semanasPed = contarSemanasPedagogicas(periodo)
  const totalCal = calcularSemanasCalendario(periodo.fechaInicio, periodo.fechaFin)
  const modalidadDesc = periodo.modalidadReto === 'A' ? 'Reto en una semana' : periodo.modalidadReto === 'B' ? 'Reto en fases' : 'Reto continuo'

  return (
    <div className="periodo-summary">
      <div className="ps-item"><b>{periodo.materia}</b></div>
      <div className="ps-item">{formatFechaCorta(periodo.fechaInicio)} → {formatFechaCorta(periodo.fechaFin)}</div>
      <div className="ps-item">{periodo.diasClase.join(' · ')}</div>
      {periodo.hora && <div className="ps-item">{periodo.hora}</div>}
      <div className="ps-item">{modalidadDesc}</div>
      <div className="ps-item"><b>{semanasPed}</b> sem ped. de {totalCal} cal.</div>
      <button className="periodo-edit-btn" onClick={onEdit}><Icon.Edit size={11} /> Editar</button>
    </div>
  )
}

// ============================================================
// CALENDARIO · usa los bloques calculados
// ============================================================
function Calendario({ periodo, onDayClick, diaSeleccionado, onUpdate, onPlanearClase, onCloseEdit }) {
  const bloques = getBloquesSemanasPeriodo(periodo)
  const totalPed = bloques.filter((b) => !b.esNoLectiva).length

  // Feriados aplicables
  const año1 = isoToDate(periodo.fechaInicio).getFullYear()
  const año2 = año1 + 1
  const feriadosSet = {}
  ;(periodo.feriadosMx || []).forEach((mmdd) => {
    [`${año1}-${mmdd}`, `${año2}-${mmdd}`].forEach((iso) => {
      const enRango = bloques.some((b) => iso >= b.fechaInicio && iso <= b.fechaFin)
      if (enRango) {
        const nombre = FERIADOS_MX.find((f) => f.fecha === mmdd)?.nombre || 'Feriado'
        feriadosSet[iso] = nombre
      }
    })
  })
  ;(periodo.feriadosCustom || []).forEach((f) => {
    const enRango = bloques.some((b) => f.fecha >= b.fechaInicio && f.fecha <= b.fechaFin)
    if (enRango) feriadosSet[f.fecha] = f.nombre
  })

  const diasClaseSet = new Set(periodo.diasClase)
  const todayIso = dateToIso(new Date())

  function getEstadoDia(iso, bloque) {
    // Semana no lectiva
    if (bloque.esNoLectiva) return { tipo: 'no-lectiva', motivo: bloque.motivo }
    // Semana 8 pedagógica = presentación
    if (bloque.numPedagogica === totalPed) return { tipo: 'presentacion' }
    // Feriado
    if (feriadosSet[iso]) return { tipo: 'feriado', nombre: feriadosSet[iso] }
    // Día NO de clase
    const dow = diaSemanaCorto(iso)
    if (!diasClaseSet.has(dow)) return { tipo: 'no-clase' }
    // Editado
    const editado = periodo.clasesEditadas?.[iso]
    if (editado?.cancelada) return { tipo: 'cancelada', motivo: editado.motivoCancel, ...editado }

    // Semana del reto (modalidad A o B en sem ped.)
    const numPed = bloque.numPedagogica
    const esSemanaReto = (periodo.semanasReto || []).includes(numPed)
    const faseRetoNombre = periodo.fasesReto?.[numPed]

    let estado = 'plan'
    if (iso === todayIso) estado = 'today'
    else if (iso < todayIso) estado = 'done'
    if (editado?.estado) estado = editado.estado

    return {
      tipo: 'clase',
      estado,
      esReto: esSemanaReto,
      faseRetoNombre,
      tema: editado?.tema || '',
      ...editado,
    }
  }

  return (
    <div className="calendario">
      {bloques.map((bloque) => {
        const numCal = bloque.numCalendario
        const numPed = bloque.numPedagogica
        const esNoLectiva = bloque.esNoLectiva
        const esSemanaReto = !esNoLectiva && numPed && (periodo.semanasReto || []).includes(numPed)
        const fasesReto = periodo.fasesReto || {}
        const esPresentacion = !esNoLectiva && numPed === totalPed

        // Generar 7 días del bloque
        const dias = []
        for (let i = 0; i < 7; i++) dias.push(addDays(bloque.fechaInicio, i))

        // Label de la semana
        let labelClass = 'calendario-week-label'
        if (esSemanaReto) labelClass += ' reto'
        if (esPresentacion) labelClass += ' presentacion'
        if (esNoLectiva) labelClass += ' no-lectiva'

        return (
          <div className="calendario-week" key={numCal}>
            <div className={labelClass}>
              {esNoLectiva ? (
                <>
                  <b>Sem cal. {numCal}</b>
                  <span className="week-fechas">{formatFechaCorta(bloque.fechaInicio)} – {formatFechaCorta(bloque.fechaFin)}</span>
                  <span className="reto-tag" style={{ color: '#888' }}>{bloque.motivo}</span>
                </>
              ) : (
                <>
                  <b>Sem ped. {numPed}</b>
                  <span className="week-fechas">{formatFechaCorta(bloque.fechaInicio)} – {formatFechaCorta(bloque.fechaFin)}</span>
                  {esSemanaReto && <span className="reto-tag">{fasesReto[numPed] || 'Reto'}</span>}
                  {esPresentacion && <span className="reto-tag">Presentación</span>}
                </>
              )}
            </div>
            <div className="calendario-days">
              {dias.slice(0, 5).map((iso) => {
                const estado = getEstadoDia(iso, bloque)
                if (estado.tipo === 'no-lectiva') {
                  return (
                    <div key={iso} className="day-card cancelada" style={{ opacity: 0.5, cursor: 'default' }}>
                      <div className="day-dia">{diaSemanaCorto(iso)}</div>
                      <div className="day-num">{isoToDate(iso).getDate()}</div>
                      <div className="day-topic" style={{ fontSize: 10 }}>{estado.motivo}</div>
                    </div>
                  )
                }
                if (estado.tipo === 'no-clase') {
                  return (
                    <div key={iso} className="day-card" style={{ opacity: 0.4, cursor: 'default', background: '#fafaf6' }}>
                      <div className="day-dia">{diaSemanaCorto(iso)}</div>
                      <div className="day-num">{isoToDate(iso).getDate()}</div>
                      <div className="day-topic" style={{ fontSize: 9, color: '#888' }}>—</div>
                    </div>
                  )
                }
                if (estado.tipo === 'feriado') {
                  return (
                    <div key={iso} className="day-card feriado">
                      <div className="day-dia">{diaSemanaCorto(iso)}</div>
                      <div className="day-num">{isoToDate(iso).getDate()}</div>
                      <div className="day-topic">{estado.nombre}</div>
                      <div className="day-status s-feriado">Feriado</div>
                    </div>
                  )
                }
                if (estado.tipo === 'cancelada') {
                  return (
                    <div key={iso} className="day-card cancelada" onClick={() => onDayClick(iso)}>
                      <div className="day-dia">{diaSemanaCorto(iso)}</div>
                      <div className="day-num">{isoToDate(iso).getDate()}</div>
                      <div className="day-topic">{estado.tema || 'Sin tema'}</div>
                      <div className="day-status s-cancelada">Cancelada</div>
                    </div>
                  )
                }
                if (estado.tipo === 'presentacion') {
                  return (
                    <div key={iso} className="day-card presentacion">
                      <div className="day-dia">{diaSemanaCorto(iso)}</div>
                      <div className="day-num">{isoToDate(iso).getDate()}</div>
                      <div className="day-topic">Presentación final</div>
                      <div className="day-status s-presentacion">Reto</div>
                    </div>
                  )
                }
                // tipo === 'clase'
                const clsExtra = estado.estado === 'done' ? 'done' : estado.estado === 'today' ? 'today' : ''
                return (
                  <div key={iso} className={`day-card ${clsExtra} ${estado.esReto ? 'reto' : ''}`} onClick={() => onDayClick(iso)}>
                    {estado.esReto && <span className="reto-badge">Reto</span>}
                    <div className="day-dia">{diaSemanaCorto(iso)}</div>
                    <div className="day-num">{isoToDate(iso).getDate()}</div>
                    <div className="day-topic">{estado.tema || (estado.esReto ? estado.faseRetoNombre || 'Reto' : 'Sin tema')}</div>
                    <div className={`day-status ${estado.estado === 'done' ? 's-done' : estado.estado === 'today' ? 's-today' : 's-plan'}`}>
                      {estado.estado === 'done' ? 'Impartida' : estado.estado === 'today' ? 'Hoy' : 'Por planear'}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}

      <div className="calendario-legend">
        <div className="cl-leg"><span className="sq" style={{ background: '#E1F5EE', borderColor: '#9FE1CB' }}></span>Impartida</div>
        <div className="cl-leg"><span className="sq" style={{ background: '#FAEEDA', borderColor: '#FAC775' }}></span>Hoy</div>
        <div className="cl-leg"><span className="sq" style={{ background: '#f5f1e5', borderColor: '#e8dec7' }}></span>Por planear</div>
        <div className="cl-leg"><span className="sq" style={{ background: 'white', borderColor: '#BA7517' }}></span>Reto</div>
        <div className="cl-leg"><span className="sq" style={{ background: '#FCEBEB', borderColor: '#F09595' }}></span>Feriado</div>
        <div className="cl-leg"><span className="sq" style={{ background: '#eef0f3', borderColor: '#c8cdd4' }}></span>No lectiva / Cancelada</div>
        <div className="cl-leg"><span className="sq" style={{ background: '#E6F1FB', borderColor: '#85B7EB' }}></span>Presentación final</div>
      </div>

      {diaSeleccionado && (
        <DayEditPanel
          fechaISO={diaSeleccionado}
          datos={periodo.clasesEditadas?.[diaSeleccionado] || {}}
          onSave={(updates) => onUpdate(diaSeleccionado, updates)}
          onCancel={onCloseEdit}
          onPlanear={() => {
            const data = periodo.clasesEditadas?.[diaSeleccionado] || {}
            onPlanearClase({ materia: periodo.materia, tema: data.tema || '' })
          }}
        />
      )}
    </div>
  )
}

// ============================================================
// EDITAR DÍA · sin cambios respecto a v4
// ============================================================
function DayEditPanel({ fechaISO, datos, onSave, onCancel, onPlanear }) {
  const [tema, setTema] = useState(datos.tema || '')
  const [estado, setEstado] = useState(datos.estado || 'plan')
  const [cancelada, setCancelada] = useState(!!datos.cancelada)
  const [motivoCancel, setMotivoCancel] = useState(datos.motivoCancel || '')

  const fechaLegible = `${diaSemanaCorto(fechaISO)} ${formatFechaCorta(fechaISO)}`

  return (
    <div className="day-edit-panel">
      <div className="day-edit-title">Editar clase · {fechaLegible}</div>

      <div className="row">
        <div className="field" style={{ marginBottom: 8 }}>
          <div className="field-label" style={{ fontSize: 11, marginBottom: 4 }}>Tema de la clase</div>
          <input value={tema} onChange={(e) => setTema(e.target.value)} placeholder="Ej. Empatizar con usuarios" />
        </div>
        <div className="field" style={{ marginBottom: 8 }}>
          <div className="field-label" style={{ fontSize: 11, marginBottom: 4 }}>Estado</div>
          <select value={estado} onChange={(e) => setEstado(e.target.value)} disabled={cancelada}>
            <option value="plan">Por planear</option>
            <option value="today">Planeada (hoy)</option>
            <option value="done">Impartida</option>
          </select>
        </div>
      </div>

      <label style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 6, margin: '8px 0' }}>
        <input type="checkbox" checked={cancelada} onChange={(e) => setCancelada(e.target.checked)} />
        Marcar esta clase como CANCELADA
      </label>

      {cancelada && (
        <div className="field" style={{ marginBottom: 8 }}>
          <div className="field-label" style={{ fontSize: 11, marginBottom: 4 }}>Motivo (opcional)</div>
          <input value={motivoCancel} onChange={(e) => setMotivoCancel(e.target.value)} placeholder="Ej. Enfermedad · Junta · Mal clima" />
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
        <button className="btn-secondary" onClick={() => onSave({ tema, estado, cancelada, motivoCancel })}>
          <Icon.Save size={12} /> Guardar
        </button>
        {!cancelada && (
          <button className="btn-secondary" onClick={onPlanear}>
            <Icon.Sparkles size={12} /> Planear con CLARA →
          </button>
        )}
        <button className="btn-secondary" onClick={onCancel} style={{ marginLeft: 'auto' }}>Cerrar</button>
      </div>
    </div>
  )
}

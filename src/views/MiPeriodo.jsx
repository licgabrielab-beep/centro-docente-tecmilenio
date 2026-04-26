import { useState } from 'react'
import { Icon } from '../components.jsx'
import { FERIADOS_MX } from '../data.js'
import {
  getPeriodo, savePeriodo, updateClasePeriodo,
  isoToDate, dateToIso, addDays, diaSemanaCorto, formatFechaCorta,
} from '../storage.js'

const DIAS_SEM_OPCIONES = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const DIAS_INDEX = { Dom: 0, Lun: 1, Mar: 2, Mié: 3, Jue: 4, Vie: 5, Sáb: 6 }

export default function MiPeriodo({ onPlanearClase }) {
  const [periodo, setPeriodo] = useState(getPeriodo())
  const [editing, setEditing] = useState(!periodo)
  const [diaSeleccionado, setDiaSeleccionado] = useState(null)
  const [tick, setTick] = useState(0)

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
          <p className="page-subtitle">Tu calendario real de 8 semanas con feriados, semana del reto y presentación final.</p>
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
// VACÍO · primer uso
// ============================================================
function PeriodoEmpty({ onStart }) {
  return (
    <div className="periodo-empty">
      <Icon.Calendar size={32} color="#1a5f5a" />
      <h3 style={{ marginTop: 12 }}>Configura tu periodo</h3>
      <p>
        Aula CLARA necesita conocer tu calendario real para generar el dashboard, planear tus clases con fechas concretas y avisarte cuando se acerque la semana del reto.
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
// CONFIGURACIÓN · formulario
// ============================================================
function PeriodoConfig({ periodo, onSave, onCancel }) {
  const today = dateToIso(new Date())
  const [materia, setMateria] = useState(periodo?.materia || '')
  const [fechaInicio, setFechaInicio] = useState(periodo?.fechaInicio || today)
  const [diasClase, setDiasClase] = useState(periodo?.diasClase || ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'])
  const [hora, setHora] = useState(periodo?.hora || '')
  const [modalidadReto, setModalidadReto] = useState(periodo?.modalidadReto || 'B')
  const [semanasReto, setSemanasReto] = useState(periodo?.semanasReto || [4])
  const [fasesReto, setFasesReto] = useState(periodo?.fasesReto || { 4: 'Fase del reto' })
  const [feriadosCustom, setFeriadosCustom] = useState(periodo?.feriadosCustom || [])
  const [feriadoNuevo, setFeriadoNuevo] = useState({ fecha: '', nombre: '' })
  const [feriadosMxSeleccion, setFeriadosMxSeleccion] = useState(
    periodo?.feriadosMx ?? FERIADOS_MX.map((f) => f.fecha) // por default todos
  )

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

  function handleSave() {
    if (!materia || !fechaInicio || diasClase.length === 0) {
      alert('Completa al menos: Materia, Fecha de inicio y al menos un día de clase.')
      return
    }
    const p = {
      materia,
      fechaInicio,
      diasClase,
      hora,
      modalidadReto,
      semanasReto: modalidadReto === 'B' ? semanasReto : [],
      fasesReto: modalidadReto === 'B' ? fasesReto : {},
      feriadosMx: feriadosMxSeleccion,
      feriadosCustom,
      clasesEditadas: periodo?.clasesEditadas || {},
    }
    onSave(p)
  }

  return (
    <div className="periodo-config">
      <h3>Configuración del periodo</h3>
      <p className="periodo-config-sub">
        Estos datos se guardan en tu navegador. Toma 2 minutos. La semana 8 siempre se reserva para presentación final del reto.
      </p>

      <div className="row">
        <div className="field">
          <div className="field-label">Materia</div>
          <input value={materia} onChange={(e) => setMateria(e.target.value)} placeholder="Ej. Innovación y emprendimiento" />
        </div>
        <div className="field">
          <div className="field-label">Hora (opcional)</div>
          <input value={hora} onChange={(e) => setHora(e.target.value)} placeholder="Ej. 9:00 - 11:00" />
        </div>
      </div>

      <div className="field">
        <div className="field-label">Fecha de inicio del periodo (semana 1, día 1)</div>
        <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} style={{ maxWidth: 220 }} />
        <div className="field-hint">Las 8 semanas se calculan automáticamente desde aquí.</div>
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

      <div className="field">
        <div className="field-label">Ritmo del reto</div>
        <div className="checkbox-row">
          <button className={`checkbox-pill ${modalidadReto === 'A' ? 'on' : ''}`} onClick={() => setModalidadReto('A')}>A · Una semana intensiva</button>
          <button className={`checkbox-pill ${modalidadReto === 'B' ? 'on' : ''}`} onClick={() => setModalidadReto('B')}>B · Fases distribuidas</button>
          <button className={`checkbox-pill ${modalidadReto === 'C' ? 'on' : ''}`} onClick={() => setModalidadReto('C')}>C · Continuo cada semana</button>
        </div>
        <div className="field-hint">
          {modalidadReto === 'A' && 'El reto se trabaja en una sola semana exclusiva (elige cuál abajo).'}
          {modalidadReto === 'B' && 'Marca qué semanas tienen fase del reto. Cada fase puede tener un nombre.'}
          {modalidadReto === 'C' && 'El reto se trabaja un poco cada semana. No se marcan semanas específicas.'}
        </div>
      </div>

      {(modalidadReto === 'A' || modalidadReto === 'B') && (
        <div className="field">
          <div className="field-label">{modalidadReto === 'A' ? 'Semana del reto (elige una)' : 'Semanas con fase del reto'}</div>
          <div className="checkbox-row">
            {[1, 2, 3, 4, 5, 6, 7].map((n) => {
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
                  Semana {n}
                </button>
              )
            })}
          </div>
          <div className="field-hint">La semana 8 siempre es presentación final, no la marques aquí.</div>

          {modalidadReto === 'B' && semanasReto.length > 0 && (
            <div style={{ marginTop: 10, background: 'var(--tec-cream)', padding: 12, borderRadius: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--tec-dark)', marginBottom: 8 }}>Nombre de cada fase (opcional)</div>
              {semanasReto.map((n) => (
                <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, minWidth: 80, color: 'var(--tec-amber-dark)' }}>Semana {n}:</span>
                  <input
                    style={{ fontSize: 12 }}
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
        <div style={{ background: 'var(--tec-gray-50)', padding: 10, borderRadius: 8, maxHeight: 160, overflowY: 'auto' }}>
          {FERIADOS_MX.map((f) => (
            <label key={f.fecha} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 4, fontSize: 12, cursor: 'pointer' }}>
              <input type="checkbox" checked={feriadosMxSeleccion.includes(f.fecha)} onChange={() => toggleFeriadoMx(f.fecha)} />
              <span>{f.nombre} ({f.fecha})</span>
            </label>
          ))}
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
// SUMMARY · barra superior cuando ya hay periodo
// ============================================================
function PeriodoSummary({ periodo, onEdit }) {
  const fin = addDays(periodo.fechaInicio, 7 * 8 - 1)
  const modalidadDesc = periodo.modalidadReto === 'A' ? 'Reto en una semana' : periodo.modalidadReto === 'B' ? 'Reto en fases' : 'Reto continuo'

  return (
    <div className="periodo-summary">
      <div className="ps-item"><b>{periodo.materia}</b></div>
      <div className="ps-item">{formatFechaCorta(periodo.fechaInicio)} → {formatFechaCorta(fin)}</div>
      <div className="ps-item">{periodo.diasClase.join(' · ')}</div>
      {periodo.hora && <div className="ps-item">{periodo.hora}</div>}
      <div className="ps-item">{modalidadDesc}</div>
      <button className="periodo-edit-btn" onClick={onEdit}><Icon.Edit size={11} /> Editar</button>
    </div>
  )
}

// ============================================================
// CALENDARIO · 8 semanas
// ============================================================
function Calendario({ periodo, onDayClick, diaSeleccionado, onUpdate, onPlanearClase, onCloseEdit }) {
  // Generar lista de fechas para todo el periodo (56 días)
  const todasLasFechas = []
  for (let i = 0; i < 56; i++) {
    todasLasFechas.push(addDays(periodo.fechaInicio, i))
  }

  // Construir lista de feriados aplicables (los que caen dentro del periodo)
  const año1 = isoToDate(periodo.fechaInicio).getFullYear()
  const año2 = año1 + 1
  const feriadosSet = {}
  // Feriados MX seleccionados (probar año actual y siguiente)
  const feriadosMxSel = periodo.feriadosMx || []
  feriadosMxSel.forEach((mmdd) => {
    [`${año1}-${mmdd}`, `${año2}-${mmdd}`].forEach((iso) => {
      if (todasLasFechas.includes(iso)) {
        const nombre = FERIADOS_MX.find((f) => f.fecha === mmdd)?.nombre || 'Feriado'
        feriadosSet[iso] = nombre
      }
    })
  })
  // Feriados custom
  ;(periodo.feriadosCustom || []).forEach((f) => {
    if (todasLasFechas.includes(f.fecha)) feriadosSet[f.fecha] = f.nombre
  })

  // Dividir en 8 semanas de 7 días
  const semanas = []
  for (let s = 0; s < 8; s++) {
    semanas.push(todasLasFechas.slice(s * 7, s * 7 + 7))
  }

  // Filtrar solo días de clase configurados
  const diasClaseSet = new Set(periodo.diasClase)
  const todayIso = dateToIso(new Date())

  function getEstadoDia(iso, semanaNum) {
    // Semana 8 = presentación
    if (semanaNum === 8) return { tipo: 'presentacion' }

    // Feriado
    if (feriadosSet[iso]) return { tipo: 'feriado', nombre: feriadosSet[iso] }

    // Día NO de clase configurado
    const dow = diaSemanaCorto(iso)
    if (!diasClaseSet.has(dow)) return { tipo: 'no-clase' }

    // Datos editados por el docente
    const editado = periodo.clasesEditadas?.[iso]
    if (editado?.cancelada) return { tipo: 'cancelada', motivo: editado.motivoCancel, ...editado }

    // Si es semana del reto (modalidad A o B)
    const esSemanaReto = (periodo.semanasReto || []).includes(semanaNum)
    const faseRetoNombre = periodo.fasesReto?.[semanaNum]

    // Es de hoy o pasó
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
      {semanas.map((dias, idx) => {
        const semanaNum = idx + 1
        const esSemanaReto = (periodo.semanasReto || []).includes(semanaNum)
        const fasesReto = periodo.fasesReto || {}
        const esPresentacion = semanaNum === 8
        const fechaInicio = formatFechaCorta(dias[0])
        const fechaFin = formatFechaCorta(dias[6])

        return (
          <div className="calendario-week" key={semanaNum}>
            <div className={`calendario-week-label ${esSemanaReto ? 'reto' : ''} ${esPresentacion ? 'presentacion' : ''}`}>
              <b>Semana {semanaNum}</b>
              <span className="week-fechas">{fechaInicio} – {fechaFin}</span>
              {esSemanaReto && <span className="reto-tag">{fasesReto[semanaNum] || 'Reto'}</span>}
              {esPresentacion && <span className="reto-tag">Presentación</span>}
            </div>
            <div className="calendario-days">
              {/* Solo mostrar los 5 primeros días (lun-vie) por simplicidad */}
              {dias.slice(0, 5).map((iso) => {
                const estado = getEstadoDia(iso, semanaNum)
                if (estado.tipo === 'no-clase') {
                  // Mostrar como muted
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
        <div className="cl-leg"><span className="sq" style={{ background: '#eef0f3', borderColor: '#c8cdd4' }}></span>Cancelada</div>
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
// EDITAR DÍA · panel inline
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

import { useState } from 'react'
import { Icon } from '../components.jsx'
import { TIPS_DIARIOS, FERIADOS_MX } from '../data.js'
import {
  getPeriodo, getGreeting, getTodayFormatted, getTodayTipIndex, getProfile,
  isoToDate, dateToIso, addDays, diaSemanaCorto, formatFechaCorta, isoToday,
  getBloquesSemanasPeriodo, getBloqueDeFecha, contarSemanasPedagogicas,
} from '../storage.js'

export default function Dashboard({ onOpenTool, onOpenPeriodo, onOpenClass }) {
  const [betaDismissed, setBetaDismissed] = useState(
    localStorage.getItem('aulaclara_beta_dismissed') === '1'
  )
  const periodo = getPeriodo()
  const profile = getProfile()
  const saludo = getGreeting()
  const fecha = getTodayFormatted()
  const tipIdx = getTodayTipIndex(TIPS_DIARIOS.length)
  const tip = TIPS_DIARIOS[tipIdx]

  function dismissBeta() {
    localStorage.setItem('aulaclara_beta_dismissed', '1')
    setBetaDismissed(true)
  }

  // Calcular semana actual del periodo usando los bloques nuevos
  let semanaInfo = null
  if (periodo) {
    const todayIso = isoToday()
    const bloques = getBloquesSemanasPeriodo(periodo)

    if (bloques.length > 0) {
      const primerBloqueInicio = bloques[0].fechaInicio
      const ultimoBloqueFin = bloques[bloques.length - 1].fechaFin

      if (todayIso < primerBloqueInicio) {
        const diff = Math.floor((isoToDate(primerBloqueInicio) - isoToDate(todayIso)) / (1000 * 60 * 60 * 24))
        semanaInfo = { antesDelInicio: true, diasParaInicio: diff }
      } else if (todayIso > ultimoBloqueFin) {
        semanaInfo = { despuesDelFin: true }
      } else {
        // Encontrar el bloque actual
        const bloqueActual = getBloqueDeFecha(periodo, todayIso)
        if (bloqueActual) {
          const dias = []
          for (let i = 0; i < 7; i++) dias.push(addDays(bloqueActual.fechaInicio, i))
          const totalPed = contarSemanasPedagogicas(periodo)
          semanaInfo = {
            bloque: bloqueActual,
            dias,
            totalPed,
          }
        }
      }
    }
  }

  const TOOLS_ANTES = [
    { id: 'diseno',     num: 1, nombre: 'Diseño de clase',         desc: '1-5 sesiones · 120 min c/u' },
    { id: 'banco',      num: 2, nombre: 'Banco · 30 actividades',  desc: 'Por fase · con filtros' },
    { id: 'prompts',    num: 3, nombre: 'Prompts para IA',         desc: '8 prompts alineados a CLARA' },
    { id: 'simplificar',num: 4, nombre: 'Simplificar texto',       desc: 'Carga DOCX, PDF o TXT', nuevo: true },
  ]
  const TOOLS_DURANTE = [
    { id: 'timer',  num: 5, nombre: 'Timer CLARA',  desc: 'Con auto-registro de tiempo', nuevo: true },
  ]
  const TOOLS_DESPUES = [
    { id: 'mensajes', num: 6, nombre: 'Mensajes del curso',     desc: 'Bienvenida · avisos · cierre' },
    { id: 'reto',     num: 7, nombre: 'Asistente de Reto Final', desc: 'Plan de acompañamiento', nuevo: true },
  ]

  function renderToolCard(t) {
    return (
      <button key={t.id} className="tool-card" onClick={() => onOpenTool(t.id)}>
        {t.nuevo && <span className="tool-new">NUEVO</span>}
        <span className="tool-num">{t.num}</span>
        <div className="tool-t">{t.nombre}</div>
        <div className="tool-d">{t.desc}</div>
      </button>
    )
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">{saludo}, {profile.nombre}</h1>
          <p className="page-subtitle">
            {fecha}
            {semanaInfo?.bloque && !semanaInfo.bloque.esNoLectiva && ` · Semana pedagógica ${semanaInfo.bloque.numPedagogica} de ${semanaInfo.totalPed}`}
            {semanaInfo?.bloque && semanaInfo.bloque.esNoLectiva && ` · ${semanaInfo.bloque.motivo} (semana no lectiva)`}
            {semanaInfo?.antesDelInicio && ` · Tu periodo inicia en ${semanaInfo.diasParaInicio} días`}
            {semanaInfo?.despuesDelFin && ` · Tu periodo terminó`}
          </p>
        </div>
        <div className="profile-chip">
          <div className="profile-avatar">{profile.nombre.split(' ').map(s => s[0]).join('').slice(0, 2).toUpperCase()}</div>
          <div>
            <div className="profile-name">{profile.nombre}</div>
            <div className="profile-role">{periodo?.materia || 'Configura tu periodo'} · {profile.cantidad} est.</div>
          </div>
        </div>
      </div>

      {!betaDismissed && (
        <div className="beta-banner">
          <Icon.Beta size={13} color="#854F0B" />
          <span>
            <b>Aula CLARA · versión beta.</b> Tus datos se guardan solo en este navegador. Te recomendamos descargar a Word/PDF tus planeaciones importantes como respaldo.
          </span>
          <button className="beta-banner-x" onClick={dismissBeta} aria-label="Cerrar">×</button>
        </div>
      )}

      {!periodo && (
        <div className="periodo-empty" style={{ marginBottom: 14 }}>
          <Icon.Calendar size={28} color="#1a5f5a" />
          <h3 style={{ marginTop: 12 }}>Configura tu periodo</h3>
          <p>
            Para mostrarte tu semana real, calendario, fechas del reto y semana de presentación, primero configura tu periodo.
            Toma 2 minutos.
          </p>
          <button className="btn-primary" onClick={onOpenPeriodo}>
            <Icon.Plus size={14} color="white" /> Configurar mi periodo
          </button>
        </div>
      )}

      {periodo && semanaInfo?.bloque && (
        <SemanaActual periodo={periodo} semanaInfo={semanaInfo} onOpenClass={onOpenClass} onOpenPeriodo={onOpenPeriodo} />
      )}

      <div className="tip-box">
        <div className="tip-icon"><Icon.Idea size={16} color="white" /></div>
        <div>
          <div className="tip-kicker">Consejo pedagógico del día</div>
          <div className="tip-msg" dangerouslySetInnerHTML={{ __html: tip.msg }} />
        </div>
      </div>

      <div className="section-label"><span className="section-dot" style={{ background: '#378ADD' }}></span>Antes de clase · prepara</div>
      <div className="tools-grid">{TOOLS_ANTES.map(renderToolCard)}</div>

      <div className="section-label"><span className="section-dot" style={{ background: '#D85A30' }}></span>Durante la clase</div>
      <div className="tools-grid">{TOOLS_DURANTE.map(renderToolCard)}</div>

      <div className="section-label"><span className="section-dot" style={{ background: '#BA7517' }}></span>Después de clase · cierra el ciclo</div>
      <div className="tools-grid">{TOOLS_DESPUES.map(renderToolCard)}</div>
    </div>
  )
}

// ============================================================
// SEMANA ACTUAL · 5 días desde lunes
// ============================================================
function SemanaActual({ periodo, semanaInfo, onOpenClass, onOpenPeriodo }) {
  const todayIso = isoToday()
  const diasClaseSet = new Set(periodo.diasClase)
  const bloque = semanaInfo.bloque
  const totalPed = semanaInfo.totalPed
  const numPed = bloque.numPedagogica

  // Si la semana actual es no lectiva, mostrar mensaje especial
  if (bloque.esNoLectiva) {
    return (
      <div className="week-box">
        <div className="week-header">
          <div className="week-title">Esta semana es no lectiva</div>
          <div className="week-counter">{bloque.motivo}</div>
        </div>
        <div style={{ padding: '12px 8px', textAlign: 'center', color: 'var(--tec-gray-700)', fontSize: 13 }}>
          No hay clases programadas. Tu calendario se reanuda la próxima semana.
        </div>
      </div>
    )
  }

  const esSemanaReto = (periodo.semanasReto || []).includes(numPed)
  const esPresentacion = numPed === totalPed

  // Construir feriados aplicables
  const año1 = isoToDate(periodo.fechaInicio).getFullYear()
  const año2 = año1 + 1
  const feriadosSet = {}
  ;(periodo.feriadosMx || []).forEach((mmdd) => {
    [`${año1}-${mmdd}`, `${año2}-${mmdd}`].forEach((iso) => {
      if (semanaInfo.dias.includes(iso)) {
        const nombre = FERIADOS_MX.find((f) => f.fecha === mmdd)?.nombre || 'Feriado'
        feriadosSet[iso] = nombre
      }
    })
  })
  ;(periodo.feriadosCustom || []).forEach((f) => {
    if (semanaInfo.dias.includes(f.fecha)) feriadosSet[f.fecha] = f.nombre
  })

  // Tarjetas de los días de clase
  const tarjetas = semanaInfo.dias.slice(0, 5).map((iso) => {
    const dow = diaSemanaCorto(iso)
    if (!diasClaseSet.has(dow)) return null

    if (feriadosSet[iso]) {
      return (
        <div key={iso} className="day-card feriado">
          <div className="day-dia">{dow}</div>
          <div className="day-num">{isoToDate(iso).getDate()}</div>
          <div className="day-topic">{feriadosSet[iso]}</div>
          <div className="day-status s-feriado">Feriado</div>
        </div>
      )
    }

    if (esPresentacion) {
      return (
        <div key={iso} className="day-card presentacion">
          <div className="day-dia">{dow}</div>
          <div className="day-num">{isoToDate(iso).getDate()}</div>
          <div className="day-topic">Presentación final</div>
          <div className="day-status s-presentacion">Reto</div>
        </div>
      )
    }

    const editado = periodo.clasesEditadas?.[iso] || {}
    if (editado.cancelada) {
      return (
        <div key={iso} className="day-card cancelada" onClick={() => onOpenPeriodo(iso)}>
          <div className="day-dia">{dow}</div>
          <div className="day-num">{isoToDate(iso).getDate()}</div>
          <div className="day-topic">{editado.tema || 'Sin tema'}</div>
          <div className="day-status s-cancelada">Cancelada</div>
        </div>
      )
    }

    let estado = editado.estado || (iso === todayIso ? 'today' : iso < todayIso ? 'done' : 'plan')
    const fasesReto = periodo.fasesReto || {}
    const tema = editado.tema || (esSemanaReto ? fasesReto[numPed] || 'Reto' : 'Sin tema')

    return (
      <div
        key={iso}
        className={`day-card ${estado === 'done' ? 'done' : ''} ${estado === 'today' ? 'today' : ''} ${esSemanaReto ? 'reto' : ''}`}
        onClick={() => onOpenClass({ materia: periodo.materia, tema, fechaIso: iso })}
      >
        {esSemanaReto && <span className="reto-badge">Reto</span>}
        <div className="day-dia">{dow}</div>
        <div className="day-num">{isoToDate(iso).getDate()}</div>
        <div className="day-topic">{tema}</div>
        <div className={`day-status ${estado === 'done' ? 's-done' : estado === 'today' ? 's-today' : 's-plan'}`}>
          {estado === 'done' ? 'Impartida' : estado === 'today' ? 'Hoy' : 'Por planear'}
        </div>
      </div>
    )
  }).filter(Boolean)

  // Contar planeadas
  const planeadas = semanaInfo.dias.slice(0, 5).filter((iso) => {
    const dow = diaSemanaCorto(iso)
    if (!diasClaseSet.has(dow)) return false
    if (feriadosSet[iso]) return false
    const e = periodo.clasesEditadas?.[iso]
    return e?.estado === 'done' || e?.estado === 'today' || iso <= todayIso
  }).length

  return (
    <div className="week-box">
      <div className="week-header">
        <div className="week-title">
          Tu semana pedagógica {numPed}
          {esSemanaReto && <span style={{ color: 'var(--tec-amber)', marginLeft: 8, fontSize: 12 }}>· {periodo.fasesReto?.[numPed] || 'Semana del reto'}</span>}
          {esPresentacion && <span style={{ color: '#185FA5', marginLeft: 8, fontSize: 12 }}>· Presentación final</span>}
        </div>
        <div className="week-counter">{planeadas} de {tarjetas.length} preparadas</div>
      </div>
      <div className="week-days">{tarjetas}</div>
    </div>
  )
}

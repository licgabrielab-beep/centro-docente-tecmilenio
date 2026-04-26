import { useState } from 'react'
import { Icon } from './components.jsx'
import Dashboard from './views/Dashboard.jsx'
import ModeloCLARA from './views/ModeloCLARA.jsx'
import MiniCurso from './views/MiniCurso.jsx'
import Guardados from './views/Guardados.jsx'
import MiPeriodo from './views/MiPeriodo.jsx'

import DisenoDeClase from './tools/DisenoDeClase.jsx'
import BancoActividades from './tools/BancoActividades.jsx'
import PromptsIA from './tools/PromptsIA.jsx'
import Simplificador from './tools/Simplificador.jsx'
import TimerCLARA from './tools/TimerCLARA.jsx'
import Mensajes from './tools/Mensajes.jsx'
import AsistenteReto from './tools/AsistenteReto.jsx'

import { MINI_CURSO } from './data.js'
import { getLessonStatus, getStats, saveProfile, getProfile } from './storage.js'

const TOOL_COMPONENTS = {
  diseno: DisenoDeClase,
  banco: BancoActividades,
  prompts: PromptsIA,
  simplificar: Simplificador,
  timer: TimerCLARA,
  mensajes: Mensajes,
  reto: AsistenteReto,
}

export default function App() {
  const [view, setView] = useState('dashboard')
  // dashboard | modelo | minicurso | guardados | periodo | tool
  const [activeTool, setActiveTool] = useState(null)
  const [toolPrefill, setToolPrefill] = useState(null)
  const [profileOpen, setProfileOpen] = useState(false)
  const [tick, setTick] = useState(0)

  function openTool(id, prefill = null) {
    setActiveTool(id)
    setToolPrefill(prefill)
    setView('tool')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function openClassPlan(clase) {
    openTool('diseno', {
      materia: clase.materia,
      tema: clase.tema,
      certificacion: clase.certificacion,
    })
  }

  function goHome() {
    setView('dashboard')
    setActiveTool(null)
    setToolPrefill(null)
    setTick((t) => t + 1)
  }

  const ActiveToolComp = activeTool ? TOOL_COMPONENTS[activeTool] : null

  return (
    <div className="layout">
      <Sidebar
        view={view}
        activeTool={activeTool}
        onNav={(v) => { setView(v); setActiveTool(null) }}
        onTool={openTool}
      />

      <main className="main">
        {view === 'dashboard' && (
          <Dashboard
            key={tick}
            onOpenTool={openTool}
            onOpenClass={openClassPlan}
            onOpenPeriodo={() => setView('periodo')}
          />
        )}

        {view === 'periodo' && (
          <MiPeriodo onPlanearClase={openClassPlan} />
        )}

        {view === 'modelo' && (
          <>
            <div className="page-header">
              <div>
                <h1 className="page-title">Modelo CLARA</h1>
                <p className="page-subtitle">El marco pedagógico de Tecmilenio, el acróstico REFEREENTE y los 3 pilares.</p>
              </div>
            </div>
            <ModeloCLARA />
          </>
        )}

        {view === 'minicurso' && <MiniCurso />}

        {view === 'guardados' && <Guardados />}

        {view === 'tool' && ActiveToolComp && (
          <ActiveToolComp prefill={toolPrefill} onBack={goHome} />
        )}
      </main>

      <aside className="right-panel">
        <RightPanel
          key={tick}
          onGoMinicurso={() => setView('minicurso')}
          onPlanear={() => openTool('diseno')}
          onEditProfile={() => setProfileOpen(true)}
        />
      </aside>

      {profileOpen && <ProfileModal onClose={() => { setProfileOpen(false); setTick(t => t + 1) }} />}
    </div>
  )
}

// ============================================================
// SIDEBAR · Aula CLARA
// ============================================================
function Sidebar({ view, activeTool, onNav, onTool }) {
  const mk = (id, label, icon, isTool = false) => (
    <button
      key={id + (isTool ? '_t' : '_v')}
      className={`sidebar-item ${(!isTool && view === id) || (isTool && view === 'tool' && activeTool === id) ? 'active' : ''}`}
      onClick={() => isTool ? onTool(id) : onNav(id)}
    >
      {icon} {label}
    </button>
  )

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-t">Aula CLARA</div>
        <div className="sidebar-logo-s">Tu espacio para diseñar, dar y reflexionar la clase Tecmilenio</div>
        <span className="sidebar-beta">BETA</span>
      </div>

      <div className="sidebar-group">
        <div className="sidebar-label">Hoy</div>
        {mk('dashboard', 'Mi semana', <Icon.Home size={15} />)}
        {mk('periodo',   'Mi periodo', <Icon.Calendar size={15} />)}
      </div>

      <div className="sidebar-group">
        <div className="sidebar-label">Preparar</div>
        {mk('diseno',     'Diseño de clase',     <Icon.Diseno size={15} />,   true)}
        {mk('banco',      'Banco · 30 act.',     <Icon.Banco size={15} />,    true)}
        {mk('prompts',    'Prompts de IA',       <Icon.Prompts size={15} />,  true)}
        {mk('simplificar','Simplificar texto',   <Icon.Simplify size={15} />, true)}
      </div>

      <div className="sidebar-group">
        <div className="sidebar-label">En clase</div>
        {mk('timer', 'Timer CLARA', <Icon.Timer size={15} />, true)}
      </div>

      <div className="sidebar-group">
        <div className="sidebar-label">Después</div>
        {mk('mensajes', 'Mensajes del curso',     <Icon.Message size={15} />, true)}
        {mk('reto',     'Asistente de Reto',      <Icon.Target size={15} />,  true)}
      </div>

      <div className="sidebar-group">
        <div className="sidebar-label">Aprender</div>
        {mk('modelo',    'Modelo CLARA',          <Icon.Book size={15} />)}
        {mk('minicurso', 'El porqué de CLARA',    <Icon.Learn size={15} />)}
      </div>

      <div className="sidebar-group">
        <div className="sidebar-label">Mis cosas</div>
        {mk('guardados', 'Guardados', <Icon.Save size={15} />)}
      </div>
    </aside>
  )
}

// ============================================================
// PANEL DERECHO
// ============================================================
function RightPanel({ onGoMinicurso, onPlanear, onEditProfile }) {
  const stats = getStats()
  const done = MINI_CURSO.filter((l) => getLessonStatus(l.id) === 'done').length

  return (
    <>
      <div className="right-card">
        <div className="right-card-title">El porqué de CLARA</div>
        {MINI_CURSO.map((l) => {
          const status = getLessonStatus(l.id)
          return (
            <div key={l.id} className="lesson" onClick={onGoMinicurso}>
              <div className={`lesson-step ${status}`}>
                {status === 'done' ? <Icon.Check size={12} color="white" /> : l.id}
              </div>
              <div>
                <div className="lesson-t">{l.titulo}</div>
                <div className={`lesson-d ${status}`}>
                  {l.duracion}
                  {status === 'done' && ' · completada'}
                  {status === 'now' && ' · en curso'}
                </div>
              </div>
            </div>
          )
        })}
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(done / MINI_CURSO.length) * 100}%` }} />
        </div>
        <div className="progress-label">{done} de {MINI_CURSO.length} lecciones</div>
      </div>

      <div className="right-card">
        <div className="right-card-title">Este periodo</div>
        <div className="stat-row">
          <span className="stat-label">Diseños de clase</span>
          <span className="stat-value">{stats.planeaciones}</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">Asistencias de reto</span>
          <span className="stat-value">{stats.retos}</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">Mensajes generados</span>
          <span className="stat-value">{stats.mensajes}</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">Sesiones cronometradas</span>
          <span className="stat-value">{stats.timerCount}</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">Horas ahorradas</span>
          <span className="stat-value stat-hero">~{stats.hoursSaved} h</span>
        </div>
      </div>

      <button className="cta-big" onClick={onPlanear}>
        <Icon.Sparkles size={14} color="white" />
        Diseñar siguiente clase
      </button>

      <button
        onClick={onEditProfile}
        style={{
          marginTop: 10, width: '100%',
          background: 'transparent', color: 'var(--tec-gray-600)',
          border: '1px dashed var(--tec-gray-300)', padding: '8px',
          borderRadius: 8, fontSize: 11, cursor: 'pointer', fontFamily: 'inherit'
        }}
      >
        Editar mi perfil
      </button>
    </>
  )
}

// ============================================================
// MODAL DE PERFIL
// ============================================================
function ProfileModal({ onClose }) {
  const current = getProfile()
  const [nombre, setNombre] = useState(current.nombre)
  const [cantidad, setCantidad] = useState(current.cantidad)

  function guardar() {
    saveProfile({ nombre, cantidad: Number(cantidad) })
    onClose()
  }

  return (
    <div className="modal-back" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h2>Tu perfil</h2>
        <p className="modal-sub">Se guarda solo en tu navegador.</p>

        <div className="field">
          <div className="field-label">Nombre</div>
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej. Gabriel López" />
        </div>
        <div className="field">
          <div className="field-label">Cantidad de estudiantes (aprox)</div>
          <input type="number" min="1" value={cantidad} onChange={(e) => setCantidad(e.target.value)} />
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <button className="btn-primary" onClick={guardar}>Guardar</button>
          <button className="btn-secondary" onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  )
}

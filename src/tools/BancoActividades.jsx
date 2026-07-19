import { useState, useMemo, useEffect } from 'react'   // ← useEffect agregado
import { BANCO_ACTIVIDADES } from '../data.js'
import { Icon } from '../components.jsx'
import { trackUso } from '../analytics.js'   // ← LÍNEA NUEVA 1

function badgeClass(fase) {
  if (fase === 'Contextualizar') return 'badge badge-C'
  if (fase === 'Llevar a la práctica') return 'badge badge-L'
  if (fase === 'Activar el diálogo') return 'badge badge-A1'
  if (fase === 'Retroalimentar') return 'badge badge-R'
  if (fase === 'Anclar el propósito') return 'badge badge-A2'
  return 'badge'
}

export default function BancoActividades({ onBack }) {
  const [filtroFase, setFiltroFase] = useState('todas')
  const [filtroDur, setFiltroDur] = useState('todas')
  const [filtroFmt, setFiltroFmt] = useState('todos')
  const [soloNoLector, setSoloNoLector] = useState(false)

  useEffect(() => {
    trackUso('Banco de actividades')   // ← LÍNEA NUEVA 2 (apertura, es herramienta de consulta)
  }, [])

  const filtradas = useMemo(() => {
    return BANCO_ACTIVIDADES.filter((a) => {
      if (filtroFase !== 'todas' && a.fase !== filtroFase) return false
      if (filtroFmt !== 'todos' && a.formato !== filtroFmt) return false
      if (filtroDur === 'corta' && a.duracion > 15) return false
      if (filtroDur === 'media' && (a.duracion <= 15 || a.duracion > 30)) return false
      if (filtroDur === 'larga' && a.duracion <= 30) return false
      if (soloNoLector && !a.noLector) return false
      return true
    })
  }, [filtroFase, filtroDur, filtroFmt, soloNoLector])

  return (
    <div className="tool-panel">
      <div className="tool-panel-header">
        <div>
          <h2 className="tool-panel-title">Banco de 30 actividades</h2>
          <p className="tool-panel-subtitle">
            Actividades listas para cualquier fase CLARA. Filtra por tiempo disponible y perfil del grupo.
          </p>
        </div>
        <button className="back-btn" onClick={onBack}><Icon.ChevronL size={12} /> Volver</button>
      </div>

      <div className="why-box">
        <b>¿Qué es esto?</b> 30 actividades probadas en aula, cada una con su tiempo y fase CLARA. Cuando no sepas qué hacer en la fase L o A, filtra por fase y duración, y elige. Todas tienen versión para no-lectores.
      </div>

      <div className="filter-bar">
        <select value={filtroFase} onChange={(e) => setFiltroFase(e.target.value)}>
          <option value="todas">Todas las fases</option>
          <option value="Contextualizar">C · Contextualizar</option>
          <option value="Llevar a la práctica">L · Llevar a la práctica</option>
          <option value="Activar el diálogo">A · Activar el diálogo</option>
          <option value="Retroalimentar">R · Retroalimentar</option>
          <option value="Anclar el propósito">A · Anclar el propósito</option>
        </select>
        <select value={filtroDur} onChange={(e) => setFiltroDur(e.target.value)}>
          <option value="todas">Cualquier duración</option>
          <option value="corta">Corta (≤15 min)</option>
          <option value="media">Media (16-30 min)</option>
          <option value="larga">Larga (&gt;30 min)</option>
        </select>
        <select value={filtroFmt} onChange={(e) => setFiltroFmt(e.target.value)}>
          <option value="todos">Cualquier modalidad</option>
          <option value="Presencial">Presencial</option>
          <option value="Híbrido">Híbrido</option>
          <option value="Online">Online</option>
        </select>
        <label>
          <input type="checkbox" checked={soloNoLector} onChange={(e) => setSoloNoLector(e.target.checked)} />
          Apto no-lectores
        </label>
      </div>

      <p style={{ fontSize: 12, color: 'var(--tec-gray-600)' }}>
        Mostrando <b>{filtradas.length}</b> de {BANCO_ACTIVIDADES.length} actividades
      </p>

      {filtradas.map((a) => (
        <div key={a.id} className="activity-card">
          <div>
            <span className={badgeClass(a.fase)}>{a.fase}</span>
            <span className="badge badge-dur">{a.duracion} min</span>
            <span className="badge badge-fmt">{a.formato}</span>
            {a.noLector && <span className="badge badge-nolector">Apto no-lectores</span>}
          </div>
          <h4>#{a.id} · {a.nombre}</h4>
          <p>{a.descripcion}</p>
        </div>
      ))}

      {filtradas.length === 0 && (
        <p style={{ textAlign: 'center', color: 'var(--tec-gray-600)', padding: '20px' }}>
          No hay actividades con esos filtros. Intenta con otra combinación.
        </p>
      )}
    </div>
  )
}

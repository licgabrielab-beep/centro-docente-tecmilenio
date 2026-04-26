import { FASES_CLARA, REFERENTE, PILARES } from '../data.js'
import { Icon } from '../components.jsx'

export default function ModeloCLARA() {
  const pieData = [
    { label: 'Contextualizar', pct: 15, color: '#ffffff' },
    { label: 'Llevar a práctica + Activar diálogo', pct: 50, color: '#9fd9c7' },
    { label: 'Retroalimentar', pct: 20, color: '#2a8278' },
    { label: 'Anclar el propósito', pct: 15, color: '#5fb8a5' },
  ]

  let cum = 0
  const cx = 80, cy = 80, r = 70
  const slices = pieData.map((d, i) => {
    const s = cum
    const e = cum + (d.pct / 100) * 2 * Math.PI
    cum = e
    const x1 = cx + r * Math.sin(s), y1 = cy - r * Math.cos(s)
    const x2 = cx + r * Math.sin(e), y2 = cy - r * Math.cos(e)
    const large = d.pct > 50 ? 1 : 0
    return (
      <path key={i} d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large} 1 ${x2},${y2} Z`}
        fill={d.color} stroke="#0b3c3a" strokeWidth="1" />
    )
  })

  // Iconos por pilar
  const PilarIcon = ({ idx }) => {
    if (idx === 0) return <Icon.Star size={22} color="currentColor" />
    if (idx === 1) return <Icon.Ladder size={22} color="currentColor" />
    return <Icon.Scale size={22} color="currentColor" />
  }

  return (
    <div className="modelo-wrap">

      {/* Sección 1 · CLARA · fondo verde oscuro */}
      <div className="modelo-clara-block">
        <h2>Modelo de clase: <span style={{ color: 'var(--tec-green-light)' }}>CLARA</span></h2>
        <p className="subt">Marco pedagógico oficial de Universidad Tecmilenio para impartir cada clase del modelo MAPS.</p>

        <div className="clara-bubbles">
          {FASES_CLARA.map((f) => (
            <div key={f.key} className="clara-bubble">
              <div className="clara-letter">{f.key[0]}</div>
              <h4>{f.nombre}</h4>
              <p>{f.desc}</p>
              <span className="clara-pct">{f.pct}%</span>
            </div>
          ))}
        </div>

        <h3>Distribución de una clase de 120 min</h3>
        <div className="pie-wrap">
          <svg width="160" height="160" viewBox="0 0 160 160" role="img" aria-label="Distribución del tiempo CLARA">
            {slices}
          </svg>
          <div className="pie-legend">
            {pieData.map((d, i) => (
              <div key={i}>
                <span className="sq" style={{ background: d.color }}></span>
                <span><b>{d.pct}%</b> — {d.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sección 2 · REFEREENTE · fondo crema con tarjetas blancas */}
      <div className="modelo-referente-block">
        <h2>Soy docente Tecmilenio · REFEREENTE</h2>
        <p className="subt">Las 9 cualidades que definen al docente Tecmilenio.</p>

        <div className="referente-grid">
          {REFERENTE.map((r, i) => (
            <div key={i} className="referente-card">
              <span className="referente-letter-big">{r.letra}</span>
              <div>
                <strong>{r.titulo}</strong>
                <p>{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sección 3 · 3 PILARES · fondo verde claro con columnas blancas */}
      <div className="modelo-pilares-block">
        <h2>3 pilares de la enseñanza</h2>
        <p className="subt">Las columnas que sostienen toda decisión académica en Tecmilenio.</p>

        <div className="pilares-grid">
          {PILARES.map((p, i) => (
            <div key={i} className="pilar-column">
              <div className="pilar-icon"><PilarIcon idx={i} /></div>
              <h4>{p.nombre}</h4>
              <ul>{p.puntos.map((x, j) => <li key={j}>{x}</li>)}</ul>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

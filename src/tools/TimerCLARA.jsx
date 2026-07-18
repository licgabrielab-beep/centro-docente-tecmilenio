import { useState, useEffect, useRef } from 'react'
import { FASES_CLARA } from '../data.js'
import { Icon } from '../components.jsx'
import { saveTimerLog } from '../storage.js'
import { trackUso } from '../analytics.js'   // ← LÍNEA NUEVA 1

export default function TimerCLARA({ onBack }) {
  const [duracionTotal, setDuracionTotal] = useState(120) // minutos
  const [running, setRunning] = useState(false)
  const [paused, setPaused] = useState(false)
  const [elapsed, setElapsed] = useState(0) // segundos transcurridos
  const [pausas, setPausas] = useState(0)
  const [fasesReales, setFasesReales] = useState({}) // { faseKey: segundosUsados }
  const [showSummary, setShowSummary] = useState(false)
  const [feeling, setFeeling] = useState(null) // 'fluida' | 'aceptable' | 'dificil'
  const [evalSaved, setEvalSaved] = useState(false)
  const intervalRef = useRef(null)
  const lastFaseRef = useRef(null)
  const lastTickRef = useRef(0)

  const fasesSec = FASES_CLARA.map((f) => ({
    ...f,
    segundos: Math.round((f.pct / 100) * duracionTotal * 60),
  }))

  let acumulado = 0
  const fasesConRango = fasesSec.map((f) => {
    const inicio = acumulado
    acumulado += f.segundos
    return { ...f, inicio, fin: acumulado }
  })

  const faseActual = fasesConRango.find((f) => elapsed >= f.inicio && elapsed < f.fin)
  const totalSeg = duracionTotal * 60
  const restanteTotal = Math.max(0, totalSeg - elapsed)
  const restanteFase = faseActual ? Math.max(0, faseActual.fin - elapsed) : 0

  // Tracking de tiempo real por fase
  useEffect(() => {
    if (running && !paused && faseActual) {
      const key = faseActual.key
      if (lastFaseRef.current && lastFaseRef.current !== key) {
        // No hacer nada al cambiar fase, los segundos ya fueron acumulados
      }
      lastFaseRef.current = key
    }
  }, [faseActual, running, paused])

  useEffect(() => {
    if (running && !paused) {
      intervalRef.current = setInterval(() => {
        setElapsed((e) => {
          if (e >= totalSeg) {
            // Fin natural: parar y mostrar resumen
            handleStop(true)
            return totalSeg
          }
          // Acumular en la fase actual
          const fase = fasesConRango.find((f) => e >= f.inicio && e < f.fin)
          if (fase) {
            setFasesReales((fr) => ({ ...fr, [fase.key]: (fr[fase.key] || 0) + 1 }))
          }
          return e + 1
        })
      }, 1000)
    }
    return () => clearInterval(intervalRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, paused, totalSeg])

  function start() {
    setElapsed(0)
    setPausas(0)
    setFasesReales({})
    setShowSummary(false)
    setFeeling(null)
    setEvalSaved(false)
    setRunning(true)
    setPaused(false)
    trackUso('Timer CLARA')   // ← LÍNEA NUEVA 2 (registra apertura/inicio)
  }

  function pauseResume() {
    if (!paused) setPausas((p) => p + 1)
    setPaused((p) => !p)
  }

  function handleStop(natural = false) {
    setRunning(false)
    setPaused(false)
    clearInterval(intervalRef.current)
    if (elapsed > 60) {
      // Solo mostrar resumen si fue una sesión real (>1 min)
      setShowSummary(true)
    }
  }

  function descartarSesion() {
    setShowSummary(false)
    setElapsed(0)
    setFasesReales({})
    setPausas(0)
    setFeeling(null)
  }

  function guardarSesion() {
    saveTimerLog({
      duracionPlaneada: duracionTotal,
      duracionReal: Math.round(elapsed / 60),
      pausas,
      fasesReales,
      feeling,
    })
    trackUso('Timer CLARA', Math.round(elapsed / 60))   // ← LÍNEA NUEVA 3 (duración real exacta)
    setEvalSaved(true)
    setTimeout(() => {
      setShowSummary(false)
      setElapsed(0)
      setFasesReales({})
      setPausas(0)
      setFeeling(null)
      setEvalSaved(false)
    }, 1400)
  }

  function formatTime(sec) {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  // Análisis del summary
  function analizarFase(fase) {
    const real = fasesReales[fase.key] || 0
    const planeado = fase.segundos
    const diff = real - planeado
    const diffMin = Math.round(diff / 60)
    if (Math.abs(diffMin) <= 2) return { msg: 'Dentro del rango', tone: 'ok' }
    if (diffMin > 0) return { msg: `+${diffMin} min de más`, tone: 'warn' }
    return { msg: `${diffMin} min faltó`, tone: 'warn' }
  }

  return (
    <div className="tool-panel">
      <div className="tool-panel-header">
        <div>
          <h2 className="tool-panel-title">Timer CLARA</h2>
          <p className="tool-panel-subtitle">
            Proyecta esto en clase. El timer marca las 5 fases con sus tiempos oficiales y registra cómo te fue.
          </p>
        </div>
        <button className="back-btn" onClick={onBack}><Icon.ChevronL size={12} /> Volver</button>
      </div>

      <div className="why-box">
        <b>¿Qué es esto?</b> El error más común al aplicar CLARA es alargarse en Contextualizar y quedarse sin tiempo para Anclar el propósito. Con este timer visible, tú y tu grupo ven exactamente dónde van. Al cerrar la clase, te muestra cómo te fue en tiempos reales.
      </div>

      {!running && !showSummary && (
        <div className="field" style={{ maxWidth: 260 }}>
          <div className="field-label">Duración de la clase</div>
          <select value={duracionTotal} onChange={(e) => setDuracionTotal(Number(e.target.value))}>
            <option value={60}>60 min</option>
            <option value={90}>90 min</option>
            <option value={120}>120 min (estándar)</option>
            <option value={150}>150 min</option>
          </select>
        </div>
      )}

      {!showSummary && (
        <>
          <div className="timer-phases">
            {fasesConRango.map((f, i) => {
              const isActive = running && faseActual && faseActual.key === f.key
              const isPast = elapsed >= f.fin
              const bgColor = isPast ? '#888780' : f.color
              const textColor = (f.color === '#ffffff' || f.color === '#c9ebd9' || f.color === '#9fd9c7') ? '#0b3c3a' : 'white'
              return (
                <div
                  key={f.key + i}
                  className={`timer-phase ${isActive ? 'active' : 'inactive'}`}
                  style={{
                    flex: f.pct,
                    background: bgColor,
                    color: textColor,
                    border: f.color === '#ffffff' ? '1px solid #9fd9c7' : 'none',
                  }}
                >
                  {f.key === 'A1' || f.key === 'A2' ? 'A' : f.key} · {f.nombre}
                  <span className="timer-phase-pct">{f.pct}%</span>
                </div>
              )
            })}
          </div>

          <div className="timer-wrap">
            <div className="timer-circle">
              <div className="timer-time">{formatTime(running ? restanteTotal : totalSeg)}</div>
              {running && faseActual && (
                <>
                  <div className="timer-phase-name">Fase: {faseActual.nombre}</div>
                  <div className="timer-phase-remaining">Quedan {formatTime(restanteFase)} en esta fase</div>
                </>
              )}
              {!running && <div className="timer-phase-name">Listo para iniciar</div>}
            </div>

            <div className="timer-controls">
              {!running && <button className="timer-btn" onClick={start}>Iniciar clase</button>}
              {running && <button className="timer-btn pause" onClick={pauseResume}>{paused ? 'Reanudar' : 'Pausar'}</button>}
              {running && <button className="timer-btn stop" onClick={() => handleStop(false)}>Terminar</button>}
            </div>

            {running && (
              <div className="small-muted" style={{ marginTop: 16, textAlign: 'center', maxWidth: 400 }}>
                Tip: mantén esta pestaña visible en la pantalla del aula. Los estudiantes también se auto-regulan cuando ven el progreso.
              </div>
            )}
          </div>
        </>
      )}

      {/* RESUMEN POST-CLASE */}
      {showSummary && (
        <div className="timer-wrap">
          <div className="timer-summary">
            <h4>Resumen de tu sesión</h4>

            <div className="timer-summary-row">
              <span className="lbl">Duración planeada</span>
              <span className="val">{duracionTotal} min</span>
            </div>
            <div className="timer-summary-row">
              <span className="lbl">Duración real</span>
              <span className="val">{Math.round(elapsed / 60)} min</span>
            </div>
            <div className="timer-summary-row">
              <span className="lbl">Pausas registradas</span>
              <span className="val">{pausas}</span>
            </div>

            <div style={{ marginTop: 14, marginBottom: 6, fontSize: 12, color: 'var(--tec-gray-700)', fontWeight: 600 }}>
              Tiempos por fase
            </div>

            {fasesConRango.map((f) => {
              const real = fasesReales[f.key] || 0
              const realMin = Math.round(real / 60)
              const analysis = analizarFase(f)
              return (
                <div className="timer-summary-row" key={f.key}>
                  <span className="lbl">{f.nombre} <span style={{ opacity: 0.6 }}>({f.min} min planeado)</span></span>
                  <span className={`val ${analysis.tone === 'ok' ? 'ok' : 'warn'}`}>
                    {realMin} min · {analysis.msg}
                  </span>
                </div>
              )
            })}

            {!evalSaved && (
              <>
                <div style={{ marginTop: 18, fontSize: 12.5, color: 'var(--tec-gray-700)', fontWeight: 600, textAlign: 'center' }}>
                  ¿Cómo te sentiste con esta sesión?
                </div>
                <div className="eval-faces">
                  <div className={`eval-face ${feeling === 'fluida' ? 'on' : ''}`} onClick={() => setFeeling('fluida')} title="Fluida y bien lograda">
                    <span>😀</span>
                  </div>
                  <div className={`eval-face ${feeling === 'aceptable' ? 'on' : ''}`} onClick={() => setFeeling('aceptable')} title="Aceptable, con detalles">
                    <span>🙂</span>
                  </div>
                  <div className={`eval-face ${feeling === 'dificil' ? 'on' : ''}`} onClick={() => setFeeling('dificil')} title="Difícil, varios obstáculos">
                    <span>😕</span>
                  </div>
                </div>
                <div className="eval-label">
                  {feeling === 'fluida' && 'Fluida y bien lograda'}
                  {feeling === 'aceptable' && 'Aceptable, con detalles'}
                  {feeling === 'dificil' && 'Difícil, varios obstáculos'}
                  {!feeling && 'Toca un emoji'}
                </div>

                <div style={{ display: 'flex', gap: 8, marginTop: 18, justifyContent: 'center' }}>
                  <button className="btn-secondary" onClick={descartarSesion}>Descartar</button>
                  <button className="btn-primary" onClick={guardarSesion} disabled={!feeling}>
                    <Icon.Save size={13} /> Guardar registro
                  </button>
                </div>
              </>
            )}

            {evalSaved && (
              <div style={{ textAlign: 'center', marginTop: 18, color: '#0F6E56', fontSize: 13, fontWeight: 600 }}>
                <Icon.Check size={14} color="#0F6E56" /> Registro guardado
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

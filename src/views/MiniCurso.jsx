import { useState, useEffect } from 'react'
import { MINI_CURSO } from '../data.js'
import { MarkdownOutput, Icon } from '../components.jsx'
import { getLessonStatus, markLessonComplete, markLessonStarted } from '../storage.js'

export default function MiniCurso({ initialLesson }) {
  const [current, setCurrent] = useState(initialLesson || 1)
  const [, setRefresh] = useState(0)

  useEffect(() => { markLessonStarted(current) }, [current])

  const lesson = MINI_CURSO.find((l) => l.id === current)
  const idx = MINI_CURSO.findIndex((l) => l.id === current)

  function completar() {
    markLessonComplete(current)
    setRefresh((r) => r + 1)
    if (idx < MINI_CURSO.length - 1) {
      setCurrent(MINI_CURSO[idx + 1].id)
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">El porqué de CLARA</h1>
          <p className="page-subtitle">5 reflexiones breves para profesionistas que dan clase. Tono honesto, ejemplos cercanos.</p>
        </div>
      </div>

      {/* Tabs de lecciones con 3 estados visuales claros */}
      <div className="minicurso-tabs">
        {MINI_CURSO.map((l) => {
          const status = getLessonStatus(l.id)
          const active = l.id === current
          let className = 'minicurso-tab'
          if (active) className += ' active'
          else if (status === 'done') className += ' done'
          else if (status === 'now') className += ' now'

          let numClassName = 'minicurso-tab-num'
          if (active) numClassName += ' active'
          else if (status === 'done') numClassName += ' done'
          else if (status === 'now') numClassName += ' now'

          return (
            <button key={l.id} className={className} onClick={() => setCurrent(l.id)}>
              <span className={numClassName}>
                {status === 'done' ? <Icon.Check size={12} color="white" /> : l.id}
              </span>
              <div>
                <div className="minicurso-tab-t">{l.titulo}</div>
                <div className="minicurso-tab-d">{l.duracion}</div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Contenido de la lección */}
      <div className="lesson-content">
        <h1 style={{ marginTop: 0 }}>{lesson.titulo}</h1>
        <div className="duration">{lesson.duracion} de lectura</div>
        <MarkdownOutput markdown={lesson.contenido} />

        <div className="lesson-nav">
          <button
            className="back-btn"
            onClick={() => idx > 0 && setCurrent(MINI_CURSO[idx - 1].id)}
            disabled={idx === 0}
            style={{ opacity: idx === 0 ? 0.4 : 1, cursor: idx === 0 ? 'not-allowed' : 'pointer' }}
          >
            <Icon.ChevronL size={12} /> Lección anterior
          </button>

          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-secondary" onClick={completar}>
              <Icon.Check size={13} /> Marcar completa
            </button>
            {idx < MINI_CURSO.length - 1 && (
              <button className="btn-primary" onClick={() => setCurrent(MINI_CURSO[idx + 1].id)}>
                Siguiente <Icon.ChevronR size={12} color="white" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

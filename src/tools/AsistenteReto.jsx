import { useState } from 'react'
import { callClaude, SYSTEM_CLARA, HelpTip, Icon, MarkdownOutput, markdownToHtml } from '../components.jsx'
import { saveGenerated } from '../storage.js'
import { exportToWord, copyToClipboard, printContent } from '../export.js'

export default function AsistenteReto({ onBack }) {
  const [reto, setReto] = useState('')
  const [competencia, setCompetencia] = useState('')
  const [semanas, setSemanas] = useState(8)
  const [modalidad, setModalidad] = useState('equipos') // 'equipos' | 'individual'
  const [tamEquipo, setTamEquipo] = useState(4)
  const [herramientas, setHerramientas] = useState('')
  const [perfil, setPerfil] = useState('mixto')
  const [modalidadReto, setModalidadReto] = useState('B') // A, B, C
  const [loading, setLoading] = useState(false)
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  async function generar() {
    setLoading(true); setError(''); setOutput(''); setSaved(false)
    try {
      const modalidadDesc = modalidad === 'equipos'
        ? `equipos de ${tamEquipo} estudiantes`
        : 'trabajo individual'

      const ritmoDesc = modalidadReto === 'A'
        ? 'el reto se trabaja exclusivamente en una semana intensiva'
        : modalidadReto === 'B'
        ? 'el reto se trabaja en fases distribuidas a lo largo del periodo'
        : 'el reto se trabaja un poco cada semana de forma continua'

      const adaptaEquipo = modalidad === 'equipos'
        ? `\n\nAdaptación para EQUIPOS:
- Sugiere roles dentro del equipo (líder, investigador, sintetizador, comunicador)
- Incluye dinámicas de trabajo colaborativo
- Define cómo distribuir trabajo y resolver conflictos en equipo
- Propone revisión entre pares ENTRE equipos
- Las señales de alerta deben detectar problemas a nivel equipo (un miembro que no participa, equipo que no se reúne)`
        : `\n\nAdaptación para TRABAJO INDIVIDUAL:
- Acompañamiento uno-a-uno con check-ins individuales
- Las señales de alerta son a nivel persona (entrega tardía, calidad descendente)
- Recomendaciones personalizadas según el progreso individual`

      const tutLine = herramientas.trim()
        ? `\n\nProgramas/herramientas que requiere el reto: ${herramientas}.\nEn la sección de tutoriales sugiere búsquedas optimizadas en YouTube y canales reconocidos para CADA herramienta. NO uses URLs específicos (cambian con el tiempo); usa términos de búsqueda y nombres de canales.`
        : `\n\nNo se especificaron herramientas particulares. En tutoriales sugiere búsquedas genéricas para habilidades transversales del reto.`

      const prompt = `Eres asistente del docente Tecmilenio. Te entrega el RETO FINAL que ya viene definido por la institución (con su rúbrica oficial). Tu trabajo NO es rediseñar el reto ni la rúbrica — es generar el PLAN DE ACOMPAÑAMIENTO al estudiante para que logre completarlo bien.

DATOS DEL RETO:
${reto}

Competencia principal a desarrollar: ${competencia || 'no especificada'}
Duración total: ${semanas} semana(s)
Modalidad de trabajo: ${modalidadDesc}
Ritmo del reto en el periodo: ${ritmoDesc}
Perfil del grupo: ${perfil === 'no-lector' ? 'estudiantes con baja comprensión lectora' : perfil === 'mixto' ? 'mixto (incluye algunos con baja comprensión lectora)' : 'lectores competentes'}${adaptaEquipo}${tutLine}

Entrega un plan completo con estos 5 bloques en markdown:

## 1. Cronograma sugerido por fases

Tabla: | Semana | Foco de la fase | Entregable intermedio | Tipo de avance esperado |
Si el ritmo es A (intensivo), concéntralo en la semana asignada. Si es B (fases), distribuye en 3-4 hitos. Si es C (continuo), avance gradual semana a semana.

## 2. Acompañamiento docente recomendado

Tabla: | Semana | Tipo de sesión sugerida | Pregunta detonadora para el grupo | Señal de alerta a detectar |
Indica claramente cuándo hacer mentoría individual/grupal vs cuándo dejar trabajar de forma autónoma.

## 3. Tutoriales y recursos sugeridos para estudiantes

Por cada herramienta o habilidad del reto, sugiere:
- 1 búsqueda optimizada en YouTube (términos exactos, ej: "Power BI dashboards básicos español 2024")
- 1-2 canales o sitios oficiales reconocidos por su calidad (sin URLs específicos, solo nombres de canal/sitio)
- 1 ejercicio breve para que practiquen antes de aplicar

## 4. Recomendaciones de trabajo por fases

3-5 recomendaciones concretas para que ${modalidad === 'equipos' ? 'los equipos' : 'cada estudiante'} avance sin procrastinar y mantenga calidad. Incluye técnicas como pomodoro, ${modalidad === 'equipos' ? 'rotación de roles, daily checks de equipo' : 'auto-monitoreo, revisión por pares con compañero'}, etc.

## 5. Plantillas de mensajes intermedios

Genera 3 mensajes cortos (50-80 palabras cada uno) listos para copiar a Canvas o WhatsApp:
- A) Mensaje de motivación a la mitad del reto
- B) Mensaje cuando ${modalidad === 'equipos' ? 'un equipo' : 'un estudiante'} se atrasa o muestra baja calidad
- C) Mensaje de cierre justo antes de la entrega final

Tono: cercano, profesional, alineado con los pilares Tecmilenio (calidad, exigencia, integridad académica).
Extensión total máxima: 1500 palabras.`

      const text = await callClaude(prompt, SYSTEM_CLARA, 2400)
      setOutput(text)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  function guardar() {
    if (!output) return
    saveGenerated({
      type: 'reto',
      title: `Asistencia Reto · ${(reto || 'Reto final').slice(0, 50)}${reto.length > 50 ? '…' : ''}`,
      meta: `${semanas} sem · ${modalidad === 'equipos' ? `equipos de ${tamEquipo}` : 'individual'} · modalidad ${modalidadReto}`,
      content: output,
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="tool-panel">
      <div className="tool-panel-header">
        <div>
          <h2 className="tool-panel-title">Asistente de Reto Final</h2>
          <p className="tool-panel-subtitle">
            Pega el reto que ya tienes y obtén el plan completo de acompañamiento al estudiante.
          </p>
        </div>
        <button className="back-btn" onClick={onBack}><Icon.ChevronL size={12} /> Volver</button>
      </div>

      <div className="why-box">
        <b>¿Qué es esto?</b> El reto y su rúbrica ya vienen de Canvas/institución. Esta herramienta NO lo rediseña. Lo que genera es: <b>cronograma sugerido, tipo de acompañamiento por semana, tutoriales para estudiantes, recomendaciones de trabajo por fases, y plantillas de mensajes</b>. Es tu plan de ruta para que el grupo lo logre bien.
      </div>

      <div className="field">
        <div className="field-label">
          Reto final (pega lo que tienes)
          <HelpTip text="Pega aquí la descripción del reto tal como aparece en Canvas o en tu acta. Mientras más detalle pongas, mejor el plan." />
        </div>
        <textarea
          value={reto}
          onChange={(e) => setReto(e.target.value)}
          placeholder="Ej. Diseñar y presentar una propuesta de innovación para un problema real de Cancún, sustentada en investigación de campo, con prototipo y pitch de 5 minutos..."
          style={{ minHeight: 110 }}
        />
      </div>

      <div className="field">
        <div className="field-label">
          Competencia principal
          <HelpTip text="¿Qué será capaz de HACER el estudiante al completar el reto? Usa verbo de acción: diseña, propone, argumenta, construye." />
        </div>
        <textarea value={competencia} onChange={(e) => setCompetencia(e.target.value)} placeholder="Ej. Diseña y argumenta una propuesta de innovación con sustento en datos." style={{ minHeight: 60 }} />
      </div>

      <div className="row-3">
        <div className="field">
          <div className="field-label">Duración (semanas)</div>
          <select value={semanas} onChange={(e) => setSemanas(Number(e.target.value))}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div className="field">
          <div className="field-label">
            Modalidad
            <HelpTip text="¿Trabajan los estudiantes solos o en equipos? Ajusta el plan completo." />
          </div>
          <select value={modalidad} onChange={(e) => setModalidad(e.target.value)}>
            <option value="equipos">Por equipos</option>
            <option value="individual">Individual</option>
          </select>
        </div>
        <div className="field">
          <div className="field-label">
            {modalidad === 'equipos' ? 'Personas por equipo' : 'Perfil'}
            <HelpTip text={modalidad === 'equipos' ? 'Cantidad de estudiantes en cada equipo (3-6 es lo más común).' : 'Si hay no-lectores, las recomendaciones se adaptan.'} />
          </div>
          {modalidad === 'equipos' ? (
            <select value={tamEquipo} onChange={(e) => setTamEquipo(Number(e.target.value))}>
              {[2, 3, 4, 5, 6, 7].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          ) : (
            <select value={perfil} onChange={(e) => setPerfil(e.target.value)}>
              <option value="lector">Lectores</option>
              <option value="mixto">Mixto</option>
              <option value="no-lector">Con no-lectores</option>
            </select>
          )}
        </div>
      </div>

      {modalidad === 'equipos' && (
        <div className="field">
          <div className="field-label">Perfil del grupo</div>
          <select value={perfil} onChange={(e) => setPerfil(e.target.value)}>
            <option value="lector">Lectores competentes</option>
            <option value="mixto">Mixto (recomendado)</option>
            <option value="no-lector">Con baja comprensión lectora</option>
          </select>
        </div>
      )}

      <div className="field">
        <div className="field-label">
          Ritmo del reto en el periodo
          <HelpTip text="A: intensivo en una semana exclusiva. B: distribuido en fases (varias semanas con foco). C: continuo, un poco cada semana." />
        </div>
        <div className="checkbox-row">
          <button className={`checkbox-pill ${modalidadReto === 'A' ? 'on' : ''}`} onClick={() => setModalidadReto('A')}>A · Una semana intensiva</button>
          <button className={`checkbox-pill ${modalidadReto === 'B' ? 'on' : ''}`} onClick={() => setModalidadReto('B')}>B · Fases distribuidas</button>
          <button className={`checkbox-pill ${modalidadReto === 'C' ? 'on' : ''}`} onClick={() => setModalidadReto('C')}>C · Continuo cada semana</button>
        </div>
      </div>

      <div className="field">
        <div className="field-label">
          Programas / herramientas requeridos (opcional)
          <HelpTip text="Si el reto requiere herramientas específicas (Figma, Power BI, Excel avanzado, Trello, etc.), escríbelas aquí. La IA sugerirá búsquedas de tutoriales para cada una." />
        </div>
        <input value={herramientas} onChange={(e) => setHerramientas(e.target.value)} placeholder="Ej. Figma, Power BI, Excel avanzado" />
      </div>

      <button className="btn-primary" onClick={generar} disabled={loading || reto.trim().length < 30}>
        {loading ? <><span className="loading-dot" /> Diseñando el plan de acompañamiento...</> : <><Icon.Sparkles size={14} /> Generar plan de acompañamiento</>}
      </button>

      {error && <div className="error">{error}</div>}

      {output && (
        <>
          <MarkdownOutput markdown={output} />
          <div className="btn-row">
            <button className="btn-secondary" onClick={guardar}><Icon.Save size={13} /> {saved ? 'Guardado' : 'Guardar'}</button>
            <button className="btn-secondary" onClick={() => copyToClipboard(output)}><Icon.Copy size={13} /> Copiar</button>
            <button className="btn-secondary" onClick={() => exportToWord(`Asistencia Reto · ${reto.slice(0,40)}`, output)}><Icon.Download size={13} /> Descargar Word</button>
            <button className="btn-secondary" onClick={() => printContent(`Asistencia Reto Final`, markdownToHtml(output))}><Icon.Print size={13} /> Imprimir / PDF</button>
          </div>
        </>
      )}
    </div>
  )
}

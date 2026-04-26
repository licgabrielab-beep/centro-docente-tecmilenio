import { useState } from 'react'
import { callClaude, SYSTEM_CLARA, HelpTip, Icon, MarkdownOutput, markdownToHtml } from '../components.jsx'
import { saveGenerated } from '../storage.js'
import { exportToWord, copyToClipboard, printContent } from '../export.js'

export default function DisenoDeClase({ prefill, onBack }) {
  const [materia, setMateria] = useState(prefill?.materia || '')
  const [tema, setTema] = useState(prefill?.tema || '')
  const [competencia, setCompetencia] = useState(prefill?.competencia || '')
  const [perfil, setPerfil] = useState('mixto')
  const [sesiones, setSesiones] = useState(1)
  const [contexto, setContexto] = useState('')
  const [certificacion, setCertificacion] = useState(prefill?.certificacion ? 'si' : 'no')
  const [certNombre, setCertNombre] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  async function generar() {
    setLoading(true); setError(''); setOutput(''); setSaved(false)
    setLoadingMsg('Diseñando la fase Contextualizar...')
    const msgs = [
      'Diseñando la fase Contextualizar...',
      'Planeando Llevar a la práctica...',
      'Activando diálogo e interacción...',
      'Ajustando retroalimentación...',
      'Anclando el propósito al estudiante...',
    ]
    let i = 0
    const int = setInterval(() => {
      i = (i + 1) % msgs.length
      setLoadingMsg(msgs[i])
    }, 1800)

    try {
      const adaptacion = perfil === 'no-lector' || perfil === 'mixto'
        ? '\n\nIMPORTANTE · Adaptación para estudiantes con baja comprensión lectora: incluye explícitamente recursos audiovisuales, infografías, audios, trabajo oral/grupal en lugar de lectura larga. Las fases Contextualizar y Activar el diálogo deben apoyarse en imagen/video.'
        : ''

      const certLine = certificacion === 'si'
        ? `\n\nMODO CERTIFICACIÓN: la materia lleva la certificación externa "${certNombre || 'no especificada'}". Alinea cada sesión con el temario oficial de la certificación. Añade al final de cada sesión una micro-práctica del tipo de pregunta o reto que se evalúa en la certificación.`
        : ''

      const prompt = `Diseña una planeación de ${sesiones} sesión(es) de 120 min cada una siguiendo el modelo CLARA.

Materia: ${materia}
Tema de la(s) sesión(es): ${tema || 'inferir del contexto'}
Competencia a desarrollar: ${competencia}
Perfil del grupo: ${perfil === 'no-lector' ? 'estudiantes con baja comprensión lectora' : perfil === 'mixto' ? 'mixto (incluye algunos con baja comprensión lectora)' : 'lectores competentes'}
Contexto adicional: ${contexto || 'ninguno'}${adaptacion}${certLine}

Para CADA sesión (1 a ${sesiones}), entrega un markdown con estos encabezados:

## Sesión N · [Título]

**Aprendizaje esperado:** (1 frase clara)

### Distribución de 120 min

| Fase | Tiempo | Actividades concretas |
|------|--------|----------------------|
| C · Contextualizar (15%) | 18 min | ... |
| L · Llevar a la práctica (25%) | 30 min | ... |
| A · Activar el diálogo (25%) | 30 min | ... |
| R · Retroalimentar (20%) | 24 min | ... |
| A · Anclar el propósito (15%) | 18 min | ... |

### Recursos necesarios
(lista de 3-5 recursos concretos)

### Evidencia de cierre
(qué entrega el estudiante al terminar la sesión)

Extensión: máx ${500 + sesiones * 350} palabras total. Prioriza claridad sobre teoría.`

      const text = await callClaude(prompt, SYSTEM_CLARA, 2200)
      clearInterval(int)
      setOutput(text)
      setLoadingMsg('')
    } catch (e) {
      clearInterval(int)
      setError(e.message)
      setLoadingMsg('')
    } finally {
      setLoading(false)
    }
  }

  function guardar() {
    if (!output) return
    saveGenerated({
      type: 'planeacion',
      title: `${materia || 'Diseño de clase'}${tema ? ' · ' + tema : ''}`,
      meta: `${sesiones} sesión${sesiones > 1 ? 'es' : ''} · ${perfil}${certificacion === 'si' ? ' · Certificación' : ''}`,
      content: output,
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function descargar() {
    if (!output) return
    exportToWord(`Diseño de clase · ${materia} · ${tema || 'sesión'}`, output)
  }

  function imprimir() {
    if (!output) return
    printContent(`Diseño de clase · ${materia}`, markdownToHtml(output))
  }

  return (
    <div className="tool-panel">
      <div className="tool-panel-header">
        <div>
          <h2 className="tool-panel-title">Diseño de clase</h2>
          <p className="tool-panel-subtitle">
            Genera una o varias sesiones de 120 min respetando la distribución oficial 15/25/25/20/15.
          </p>
        </div>
        <button className="back-btn" onClick={onBack}><Icon.ChevronL size={12} /> Volver</button>
      </div>

      <div className="why-box">
        <b>¿Qué es esto?</b> Tu plan de clase en formato CLARA. La IA lo redacta, tú lo revisas. Reemplaza 30-60 min de preparación manual.
      </div>

      <div className="row">
        <div className="field">
          <div className="field-label">
            Materia
            <HelpTip text="Escribe el nombre tal como aparece en tu acta de carga. Ejemplos: 'Cálculo Diferencial', 'Innovación y emprendimiento', 'Marketing Digital'." />
          </div>
          <input value={materia} onChange={(e) => setMateria(e.target.value)} placeholder="Ej. Innovación y emprendimiento" />
        </div>
        <div className="field">
          <div className="field-label">Tema de la sesión</div>
          <input value={tema} onChange={(e) => setTema(e.target.value)} placeholder="Ej. Empatizar con usuarios" />
        </div>
      </div>

      <div className="field">
        <div className="field-label">
          Competencia a desarrollar
          <HelpTip text="Es lo que el estudiante será capaz de HACER al final, no lo que sabrá. Usa verbos de acción: diseña, propone, resuelve, argumenta. Ej: 'Propone soluciones innovadoras con viabilidad económica'." />
        </div>
        <textarea value={competencia} onChange={(e) => setCompetencia(e.target.value)} placeholder="Ej. Argumenta ideas con evidencia para persuadir a un público específico." />
      </div>

      <div className="row-3">
        <div className="field">
          <div className="field-label">
            Sesiones
            <HelpTip text="Cuántas clases de 120 min planeamos de una vez. Cada una respeta la distribución CLARA." />
          </div>
          <select value={sesiones} onChange={(e) => setSesiones(Number(e.target.value))}>
            {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div className="field">
          <div className="field-label">
            Perfil del grupo
            <HelpTip text="Si hay estudiantes con baja comprensión lectora, elige Mixto o No-lector. La IA incluirá audios, videos e infografías en lugar de lecturas largas." />
          </div>
          <select value={perfil} onChange={(e) => setPerfil(e.target.value)}>
            <option value="lector">Lectores competentes</option>
            <option value="mixto">Mixto (recomendado)</option>
            <option value="no-lector">Con baja comprensión lectora</option>
          </select>
        </div>
        <div className="field">
          <div className="field-label">
            Certificación
            <HelpTip text="Si la materia lleva certificación externa (Scrum, AWS, Six Sigma, Google, etc.), la IA alinea cada sesión al temario oficial de la certificación." />
          </div>
          <select value={certificacion} onChange={(e) => setCertificacion(e.target.value)}>
            <option value="no">Sin certificación</option>
            <option value="si">Sí · modo certificación</option>
          </select>
        </div>
      </div>

      {certificacion === 'si' && (
        <div className="field">
          <div className="field-label">Nombre de la certificación</div>
          <input value={certNombre} onChange={(e) => setCertNombre(e.target.value)} placeholder="Ej. Scrum Fundamentals · AWS Cloud Practitioner · Google Ads" />
        </div>
      )}

      <div className="field">
        <div className="field-label">Contexto adicional (opcional)</div>
        <input value={contexto} onChange={(e) => setContexto(e.target.value)} placeholder="Ej. 32 estudiantes · modalidad híbrida · campus Cancún" />
      </div>

      <button className="btn-primary" onClick={generar} disabled={loading || !materia || !competencia}>
        {loading ? <><span className="loading-dot" /> {loadingMsg || 'Generando...'}</> : <><Icon.Sparkles size={14} /> Generar diseño de clase</>}
      </button>

      {error && <div className="error">{error}</div>}

      {output && (
        <>
          <MarkdownOutput markdown={output} />
          <div className="btn-row">
            <button className="btn-secondary" onClick={guardar}>
              <Icon.Save size={13} /> {saved ? 'Guardado' : 'Guardar'}
            </button>
            <button className="btn-secondary" onClick={() => copyToClipboard(output)}>
              <Icon.Copy size={13} /> Copiar texto
            </button>
            <button className="btn-secondary" onClick={descargar}>
              <Icon.Download size={13} /> Descargar Word
            </button>
            <button className="btn-secondary" onClick={imprimir}>
              <Icon.Print size={13} /> Imprimir / PDF
            </button>
          </div>
        </>
      )}
    </div>
  )
}

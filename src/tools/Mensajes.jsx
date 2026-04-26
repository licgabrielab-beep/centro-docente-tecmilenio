import { useState } from 'react'
import { callClaude, SYSTEM_CLARA, HelpTip, Icon, MarkdownOutput, markdownToHtml } from '../components.jsx'
import { saveGenerated } from '../storage.js'
import { copyToClipboard, exportToWord, printContent } from '../export.js'

const TIPOS = [
  { id: 'bienvenida', nombre: 'Bienvenida al curso',     desc: 'Primer mensaje del periodo. Presenta la materia y lo que lograrán.' },
  { id: 'agenda',     nombre: 'Agenda de entregas',       desc: 'Calendario semanal de actividades y evaluaciones.' },
  { id: 'recordatorio', nombre: 'Recordatorio de entrega', desc: 'Aviso de una entrega próxima con detalles clave.' },
  { id: 'ausencia',   nombre: 'Cambio o cancelación',     desc: 'Aviso por cancelación, cambio de aula o reprogramación.' },
  { id: 'motivacion', nombre: 'Mensaje de ánimo',         desc: 'Mitad del periodo: subir la motivación del grupo.' },
  { id: 'cierre',     nombre: 'Mensaje de cierre',        desc: 'Último mensaje: agradece, cierra y conecta con el futuro profesional.' },
]

export default function Mensajes({ onBack }) {
  const [tipo, setTipo] = useState('bienvenida')
  const [materia, setMateria] = useState('')
  const [detalles, setDetalles] = useState('')
  const [canal, setCanal] = useState('canvas')
  const [tono, setTono] = useState('profesional-calido')
  const [loading, setLoading] = useState(false)
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  async function generar() {
    setLoading(true); setError(''); setOutput(''); setSaved(false)
    try {
      const tipoObj = TIPOS.find((t) => t.id === tipo)
      const canalDesc = canal === 'canvas' ? 'anuncio en Canvas — formato pulido, saludo formal, 150-250 palabras, puede incluir viñetas' : canal === 'email' ? 'correo electrónico — saludo formal, firma al final, 100-200 palabras' : 'mensaje de WhatsApp/Teams — breve, 50-80 palabras, directo'
      const tonoDesc = tono === 'profesional-calido' ? 'profesional pero cálido, cercano sin ser informal' : tono === 'formal' ? 'formal institucional' : 'cercano y motivador, ligeramente informal'

      const prompt = `Redacta un mensaje del docente a sus estudiantes de nivel profesional Tecmilenio.

Tipo: ${tipoObj.nombre} · ${tipoObj.desc}
Materia: ${materia || 'no especificada'}
Canal: ${canalDesc}
Tono: ${tonoDesc}

Información específica del mensaje:
${detalles || '(no se dieron detalles específicos, usa buenas prácticas generales)'}

Directrices:
- Empieza con saludo adecuado al canal.
- Conecta con el propósito de vida del estudiante (modelo CLARA, fase Anclar).
- Sé concreto: si es una entrega, da fecha y criterio; si es bienvenida, menciona la competencia que desarrollarán.
- Cierra con una frase que invite a acción o que deje un tono positivo.
- No uses emojis a menos que el canal sea WhatsApp/Teams y el tono sea cercano.

Entrega SOLO el mensaje final listo para copiar, sin explicaciones ni encabezados markdown adicionales.`

      const text = await callClaude(prompt, SYSTEM_CLARA, 900)
      setOutput(text)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  function guardar() {
    const tipoObj = TIPOS.find((t) => t.id === tipo)
    saveGenerated({
      type: 'mensaje',
      title: `${tipoObj.nombre}${materia ? ' · ' + materia : ''}`,
      meta: canal,
      content: output,
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="tool-panel">
      <div className="tool-panel-header">
        <div>
          <h2 className="tool-panel-title">Mensajes del curso</h2>
          <p className="tool-panel-subtitle">
            Bienvenida, agenda, recordatorios, avisos y cierre. Listo para Canvas, correo o chat.
          </p>
        </div>
        <button className="back-btn" onClick={onBack}><Icon.ChevronL size={12} /> Volver</button>
      </div>

      <div className="why-box">
        <b>¿Qué es esto?</b> El <i>Conoce tu materia</i> institucional te pide mensaje de bienvenida, agenda de entregas y cierre en Canvas. Cada periodo los reescribes. Aquí los generas en 30 segundos, adaptados a tu materia y tu tono.
      </div>

      <div className="row">
        <div className="field">
          <div className="field-label">Tipo de mensaje</div>
          <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
            {TIPOS.map((t) => <option key={t.id} value={t.id}>{t.nombre}</option>)}
          </select>
          <div className="field-hint">{TIPOS.find((t) => t.id === tipo).desc}</div>
        </div>
        <div className="field">
          <div className="field-label">Canal</div>
          <select value={canal} onChange={(e) => setCanal(e.target.value)}>
            <option value="canvas">Anuncio en Canvas</option>
            <option value="email">Correo electrónico</option>
            <option value="chat">WhatsApp / Teams</option>
          </select>
        </div>
      </div>

      <div className="row">
        <div className="field">
          <div className="field-label">Materia</div>
          <input value={materia} onChange={(e) => setMateria(e.target.value)} placeholder="Ej. Innovación y emprendimiento" />
        </div>
        <div className="field">
          <div className="field-label">
            Tono
            <HelpTip text="Profesional cálido: recomendado por default para Tecmilenio. Formal: para comunicaciones institucionales oficiales. Cercano: para mensajes de ánimo o grupos ya consolidados." />
          </div>
          <select value={tono} onChange={(e) => setTono(e.target.value)}>
            <option value="profesional-calido">Profesional cálido · recomendado</option>
            <option value="formal">Formal institucional</option>
            <option value="cercano">Cercano motivador</option>
          </select>
        </div>
      </div>

      <div className="field">
        <div className="field-label">
          Información específica del mensaje
          <HelpTip text="Da aquí los datos concretos: si es recordatorio, pon la fecha y el entregable; si es bienvenida, menciona algo único de tu curso; si es cancelación, pon el motivo." />
        </div>
        <textarea
          value={detalles}
          onChange={(e) => setDetalles(e.target.value)}
          placeholder="Ej. Recordatorio entrega ensayo 1 · fecha 30 abril 23:59 · formato PDF · peso 20% · rúbrica disponible en Canvas"
          style={{ minHeight: 100 }}
        />
      </div>

      <button className="btn-primary" onClick={generar} disabled={loading || !materia}>
        {loading ? <><span className="loading-dot" /> Redactando...</> : <><Icon.Sparkles size={14} /> Generar mensaje</>}
      </button>

      {error && <div className="error">{error}</div>}

      {output && (
        <>
          <MarkdownOutput markdown={output} />
          <div className="btn-row">
            <button className="btn-secondary" onClick={guardar}><Icon.Save size={13} /> {saved ? 'Guardado' : 'Guardar'}</button>
            <button className="btn-secondary" onClick={() => copyToClipboard(output)}><Icon.Copy size={13} /> Copiar</button>
            <button className="btn-secondary" onClick={() => exportToWord(`Mensaje · ${materia}`, output)}><Icon.Download size={13} /> Word</button>
            <button className="btn-secondary" onClick={() => printContent(`Mensaje`, markdownToHtml(output))}><Icon.Print size={13} /> PDF</button>
          </div>
        </>
      )}
    </div>
  )
}

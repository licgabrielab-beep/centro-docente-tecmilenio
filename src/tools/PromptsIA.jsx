import { useState } from 'react'
import { PROMPTS_IA } from '../data.js'
import { copyToClipboard } from '../export.js'
import { Icon } from '../components.jsx'

export default function PromptsIA({ onBack }) {
  const [copiado, setCopiado] = useState(null)
  async function copiar(texto, idx) {
    const ok = await copyToClipboard(texto)
    if (ok) {
      setCopiado(idx)
      setTimeout(() => setCopiado(null), 1500)
    }
  }

  return (
    <div className="tool-panel">
      <div className="tool-panel-header">
        <div>
          <h2 className="tool-panel-title">Prompts para IA</h2>
          <p className="tool-panel-subtitle">
            8 prompts listos para usar en Claude, ChatGPT o Gemini. Reemplaza los [CORCHETES] con tus datos.
          </p>
        </div>
        <button className="back-btn" onClick={onBack}><Icon.ChevronL size={12} /> Volver</button>
      </div>

      <div className="why-box">
        <b>¿Qué es esto?</b> No tienes tiempo de escribirle bien a la IA cada vez. Copia un prompt probado, cámbiale las palabras entre [CORCHETES], y pégalo en la IA que uses. Ahorras 10-15 min cada vez.
      </div>

      <div className="prompt-list">
        {PROMPTS_IA.map((p, i) => (
          <div key={i} className="prompt-item">
            <h4>{p.titulo}</h4>
            <div className="prompt-when"><b>Cuándo usarlo:</b> {p.uso}</div>
            <code>{p.prompt}</code>
            <button className="btn-secondary" style={{ marginTop: 10 }} onClick={() => copiar(p.prompt, i)}>
              <Icon.Copy size={13} /> {copiado === i ? 'Copiado' : 'Copiar prompt'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

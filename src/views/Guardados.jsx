import { useState } from 'react'
import { getAllSaved, deleteSaved } from '../storage.js'
import { MarkdownOutput, Icon, markdownToHtml } from '../components.jsx'
import { copyToClipboard, exportToWord, printContent } from '../export.js'

const TYPE_LABELS = {
  planeacion: 'Planeación',
  reto: 'Reto final',
  feedback: 'Feedback',
  simplificar: 'Simplificación',
  mensaje: 'Mensaje',
}

export default function Guardados() {
  const [items, setItems] = useState(getAllSaved())
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(null)

  function refresh() {
    setItems(getAllSaved())
  }

  function remove(id) {
    if (confirm('¿Eliminar este guardado? No se puede deshacer.')) {
      deleteSaved(id)
      refresh()
      if (selected?.id === id) setSelected(null)
    }
  }

  const filtered = filter === 'all' ? items : items.filter((x) => x.type === filter)

  function formatDate(iso) {
    const d = new Date(iso)
    const diff = (Date.now() - d.getTime()) / 1000
    if (diff < 60) return 'hace segundos'
    if (diff < 3600) return `hace ${Math.floor(diff / 60)} min`
    if (diff < 86400) return `hace ${Math.floor(diff / 3600)} h`
    if (diff < 86400 * 7) return `hace ${Math.floor(diff / 86400)} días`
    return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Mis guardados</h1>
          <p className="page-subtitle">Todo lo que has generado con Aula CLARA. Se guarda en tu navegador.</p>
        </div>
      </div>

      <div className="filter-bar" style={{ marginBottom: 14 }}>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">Todos los tipos</option>
          <option value="planeacion">Planeaciones</option>
          <option value="reto">Retos finales</option>
          <option value="feedback">Feedbacks</option>
          <option value="simplificar">Simplificaciones</option>
          <option value="mensaje">Mensajes</option>
        </select>
        <span style={{ fontSize: 12, color: 'var(--tec-gray-600)', padding: '8px 4px' }}>
          {filtered.length} {filtered.length === 1 ? 'guardado' : 'guardados'}
        </span>
      </div>

      {filtered.length === 0 && (
        <div style={{ background: 'white', borderRadius: 12, padding: '40px 24px', textAlign: 'center', color: 'var(--tec-gray-600)', border: '1px solid var(--tec-gray-200)' }}>
          <p style={{ margin: 0, fontSize: 14 }}>
            Aún no tienes guardados {filter !== 'all' ? 'de este tipo' : ''}.<br />
            Cuando generes una planeación, reto, feedback, simplificación o mensaje, podrás guardarlos aquí.
          </p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1.5fr' : '1fr', gap: 14 }}>
        <div className="saved-list">
          {filtered.map((item) => (
            <div key={item.id} className="saved-item" onClick={() => setSelected(item)} style={{ borderColor: selected?.id === item.id ? 'var(--tec-green)' : 'var(--tec-gray-200)' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="saved-type">{TYPE_LABELS[item.type] || item.type}</div>
                <div className="saved-title">{item.title}</div>
                <div className="saved-meta">{item.meta} · {formatDate(item.createdAt)}</div>
              </div>
              <button className="saved-delete" onClick={(e) => { e.stopPropagation(); remove(item.id) }} aria-label="Eliminar">
                <Icon.Trash size={14} />
              </button>
            </div>
          ))}
        </div>

        {selected && (
          <div className="tool-panel" style={{ marginTop: 0 }}>
            <div className="tool-panel-header">
              <div>
                <h2 className="tool-panel-title">{selected.title}</h2>
                <p className="tool-panel-subtitle">{TYPE_LABELS[selected.type]} · {selected.meta} · {formatDate(selected.createdAt)}</p>
              </div>
              <button className="back-btn" onClick={() => setSelected(null)}>Cerrar</button>
            </div>
            <MarkdownOutput markdown={selected.content} />
            <div className="btn-row">
              <button className="btn-secondary" onClick={() => copyToClipboard(selected.content)}><Icon.Copy size={13} /> Copiar</button>
              <button className="btn-secondary" onClick={() => exportToWord(selected.title, selected.content)}><Icon.Download size={13} /> Descargar Word</button>
              <button className="btn-secondary" onClick={() => printContent(selected.title, markdownToHtml(selected.content))}><Icon.Print size={13} /> Imprimir / PDF</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

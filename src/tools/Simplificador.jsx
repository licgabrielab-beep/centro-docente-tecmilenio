import { useState, useRef } from 'react'
import { callClaude, SYSTEM_CLARA, HelpTip, Icon, MarkdownOutput, markdownToHtml } from '../components.jsx'
import { saveGenerated } from '../storage.js'
import { exportToWord, copyToClipboard, printContent, readFileText } from '../export.js'

export default function Simplificador({ onBack }) {
  const [texto, setTexto] = useState('')
  const [tema, setTema] = useState('')
  const [nivel, setNivel] = useState('intermedio')
  const [loading, setLoading] = useState(false)
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const [fileLoading, setFileLoading] = useState(false)
  const [fileLoaded, setFileLoaded] = useState(null)
  const [dragging, setDragging] = useState(false)
  const fileInputRef = useRef(null)

  async function handleFile(file) {
    if (!file) return
    setError('')
    setFileLoading(true)
    try {
      const text = await readFileText(file)
      if (!text || text.trim().length < 10) {
        throw new Error('No se pudo extraer texto legible del archivo. Si es un PDF escaneado, prueba copiar/pegar el texto manualmente.')
      }
      setTexto(text)
      setFileLoaded({ name: file.name, size: Math.round(file.size / 1024) })
    } catch (e) {
      setError(`Error leyendo archivo: ${e.message}`)
    } finally {
      setFileLoading(false)
    }
  }

  function clearFile() {
    setFileLoaded(null)
    setTexto('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function onDrop(e) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  async function generar() {
    setLoading(true); setError(''); setOutput(''); setSaved(false)
    try {
      const nivelDesc = nivel === 'basico'
        ? 'estudiantes que casi no leen — lenguaje muy simple, frases de menos de 10 palabras'
        : nivel === 'intermedio'
        ? 'estudiantes con baja comprensión lectora — lenguaje simple, frases cortas'
        : 'estudiantes de nivel medio — lenguaje accesible pero puede usar términos técnicos explicados'

      const prompt = `Transforma el siguiente texto académico en un material accesible para ${nivelDesc}.

Tema: ${tema || 'inferir del texto'}

Entrega estas 4 secciones con encabezados markdown:

## Resumen en 5 viñetas

5 viñetas, máximo 15 palabras cada una. Si hay términos técnicos, defínelos entre paréntesis al aparecer.

## Palabras clave (máx 6)

Lista con término + 1 frase explicándolo.

## 2 recursos alternativos

2 sugerencias concretas de material audiovisual que el docente puede buscar (tipo: "busca en YouTube 'X explicado en 5 min'" o "infografía en Google Imágenes de Y"). Con un término de búsqueda real.

## 3 preguntas de comprensión

3 preguntas que el docente puede hacer al grupo para verificar que entendieron. No "¿qué es X?", sino aplicadas: "¿Dónde has visto algo parecido a X en tu vida?".

TEXTO ORIGINAL:
${texto}`

      const text = await callClaude(prompt, SYSTEM_CLARA, 1800)
      setOutput(text)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  function guardar() {
    saveGenerated({
      type: 'simplificar',
      title: `Simplificación · ${tema || 'texto'}`,
      meta: `Nivel ${nivel}`,
      content: output,
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="tool-panel">
      <div className="tool-panel-header">
        <div>
          <h2 className="tool-panel-title">Simplificar texto para no-lectores</h2>
          <p className="tool-panel-subtitle">
            Convierte un artículo, capítulo o documento denso en 5 viñetas accesibles + recursos audiovisuales alternativos.
          </p>
        </div>
        <button className="back-btn" onClick={onBack}><Icon.ChevronL size={12} /> Volver</button>
      </div>

      <div className="why-box">
        <b>¿Qué es esto?</b> Tienes estudiantes que no leen. Pega aquí el texto o carga el archivo y obtienes: un resumen simple, palabras clave, 2 recursos audiovisuales para reemplazar la lectura, y 3 preguntas para verificar comprensión. <b>La competencia se puede demostrar sin leer.</b>
      </div>

      <div className="row">
        <div className="field">
          <div className="field-label">Tema general (opcional)</div>
          <input value={tema} onChange={(e) => setTema(e.target.value)} placeholder="Ej. Flujo de efectivo" />
        </div>
        <div className="field">
          <div className="field-label">
            Nivel de simplificación
            <HelpTip text="Básico: lenguaje muy simple, ideal para estudiantes que casi no leen. Intermedio: recomendado. Medio: mantiene términos técnicos con definiciones." />
          </div>
          <select value={nivel} onChange={(e) => setNivel(e.target.value)}>
            <option value="basico">Básico · máximo simple</option>
            <option value="intermedio">Intermedio · recomendado</option>
            <option value="medio">Medio · permite términos técnicos</option>
          </select>
        </div>
      </div>

      <div className="field">
        <div className="field-label">
          Cargar archivo (opcional)
          <HelpTip text="Soporta DOCX, PDF y TXT. El archivo se procesa solo en tu navegador, no se sube a ningún servidor. Tus documentos quedan privados." />
        </div>
        {!fileLoaded ? (
          <div
            className={`file-drop ${dragging ? 'dragging' : ''}`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".docx,.pdf,.txt"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
            {fileLoading ? (
              <p><span className="loading-dot" style={{ borderColor: 'var(--tec-green)', borderTopColor: 'transparent' }} /> Leyendo archivo...</p>
            ) : (
              <>
                <p><Icon.Upload size={14} /> Arrastra un archivo o haz click para seleccionarlo</p>
                <p className="file-types">Acepta DOCX, PDF, TXT · todo se procesa local en tu navegador</p>
              </>
            )}
          </div>
        ) : (
          <div className="file-loaded">
            <Icon.File size={14} />
            <span>{fileLoaded.name} · {fileLoaded.size} KB · texto extraído</span>
            <button className="file-x" onClick={clearFile} aria-label="Quitar archivo">×</button>
          </div>
        )}
      </div>

      <div className="field">
        <div className="field-label">
          Texto a simplificar
          <HelpTip text="Pega el texto o se llena automáticamente al cargar un archivo. Puedes editarlo después de cargar." />
        </div>
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Pega aquí el texto que quieres simplificar... o carga un archivo arriba."
          style={{ minHeight: 200 }}
        />
        <div className="field-hint">{texto.length} caracteres · {texto.trim().split(/\s+/).filter(Boolean).length} palabras</div>
      </div>

      <button className="btn-primary" onClick={generar} disabled={loading || texto.trim().length < 50}>
        {loading ? <><span className="loading-dot" /> Simplificando...</> : <><Icon.Sparkles size={14} /> Simplificar texto</>}
      </button>

      {error && <div className="error">{error}</div>}

      {output && (
        <>
          <MarkdownOutput markdown={output} />
          <div className="btn-row">
            <button className="btn-secondary" onClick={guardar}><Icon.Save size={13} /> {saved ? 'Guardado' : 'Guardar'}</button>
            <button className="btn-secondary" onClick={() => copyToClipboard(output)}><Icon.Copy size={13} /> Copiar</button>
            <button className="btn-secondary" onClick={() => exportToWord(`Simplificación · ${tema}`, output)}><Icon.Download size={13} /> Descargar Word</button>
            <button className="btn-secondary" onClick={() => printContent(`Simplificación · ${tema}`, markdownToHtml(output))}><Icon.Print size={13} /> Imprimir / PDF</button>
          </div>
        </>
      )}
    </div>
  )
}
